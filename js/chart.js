var moodData = {data: []};

var ctx = document.getElementById('moodChart').getContext('2d');

var moodChart = ($(window).width() > 600) ? new Chart(ctx, DESKTOP_LINE_CHART) : new Chart(ctx, MOBILE_LINE_CHART);

$( document ).ready(function() {
    if(localStorage.getItem("moodData") === null) {
        localStorage.setItem("moodData", "{\"data\": []}");
    }
    else {
        moodData = JSON.parse(localStorage.getItem("moodData"));
        updateChart();
    }

    $('#importScreen').hide(); 
    
    $( "#datepicker" ).datepicker().datepicker('setDate', new Date());

    $( "#importDaylio" ).click(function() {
        $( '#importScreen' ).show();
    });

    $( "#clear" ).click(function() {
        var r = confirm("This will remove all of your mood data. Are you sure you want to clear cache?");
        if(r) {
            localStorage.setItem("moodData", "{\"data\": []}");
            moodData = {data: []};
            updateChart();
        }
    });

    $( "#addMood" ).submit(function( event ) {
        if (moodChart.data.datasets.length > 0) {
            // var month = MONTHS[moodChart.data.labels.length % MONTHS.length];
            var values = getFormValues("#addMood");

            var dateObj = $("#datepicker").datepicker("getDate");
            var dateStr = $.datepicker.formatDate("yy-mm-dd", dateObj);

            var currMood = {mood: parseInt(values["currentMood"]), date: dateStr, tag: values["tag"]};
            addMood(currMood);
            updateChart();
        }
        event.preventDefault();
    });

    $( "#import" ).submit(function( event ) {
        $('#importScreen').hide(); 
        var values = getFormValues("#import");
        // TODOd validate CSV
        moodData = moodDataFromCSV(values.inputData);
        localStorage.setItem("moodData", JSON.stringify(moodData));
        updateChart();
        event.preventDefault();
    });
});

function longToShortDate(longDate) {
    var datePieces = longDate.split("-");
    var shortMonthName = MONTHS[parseInt(datePieces[1]) - 1].substr(0,3);
    return shortMonthName + " " + datePieces[2];
}

function getFormValues(formID) {
    var values = {};
    $.each($(formID).serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    return values;
}

function updateChart() {
    chartData = getChartData();
    
    moodChart.data.labels = chartData[0];
    moodChart.data.datasets.forEach(function(dataset) {
        dataset.data = chartData[1];
    });
    moodChart.update();
}

function getChartData() {
    var moodDates = [];
    var moodLevels = [];
    var moodsPerDay = 1;

    for(var i = 0; i < moodData.data.length; i++) {
        // If repeat, don't add date to chartData and update average for that date.
        if(i > 0 && moodDates[moodDates.length - 1] === moodData.data[i].date) {
            moodsPerDay++;
            var currAvg = moodLevels[moodLevels.length - 1];
            currAvg -= currAvg / moodsPerDay;
            currAvg += moodData.data[i].mood / moodsPerDay;
            moodLevels[moodLevels.length - 1] = currAvg;
        }
        // Otherwise, reset average counter and push moodData to chartData.
        else {
            moodsPerDay = 1;
            moodDates.push(moodData.data[i].date);
            moodLevels.push(moodData.data[i].mood);
        }
    }

    // Convert floats to ints from averaging.
    for(var i = 0; i < moodLevels.length ; i++)
        moodLevels[i] = Math.round(moodLevels[i]);

    return [moodDates, moodLevels];
}

function addMood(currMood) {
    moodData.data.push(currMood);
    moodData.data.sort(function(a, b) { return (a.date > b.date) ? 1 : -1});
    localStorage.setItem("moodData", JSON.stringify(moodData));
}

function convertDaylioMood(daylioMood) {
    switch(daylioMood) {
        case "awful":
            return 0;
        case "fugly":
            return 1;
        case "bad":
            return 1;
        case "apathy":
            return 2;
        case "meh":
            return 3;
        case "good":
            return 4;
        case "rad":
            return 6;
        default:
            return 3;
    }
}

function moodDataFromCSV(csv) {
    var csvObjArr = csvToObjectArr(csv);
    csvObjArr.sort(function(a, b) { return (a.full_date > b.full_date) ? 1 : -1});
    var tempData = {data: []};

    for(var i = 0; i < csvObjArr.length; i++) {
        if(csvObjArr[i].mood === undefined) {
            continue;
        }
        console.log(csvObjArr[i].full_date + ": " + csvObjArr[i].mood + " (" + convertDaylioMood(csvObjArr[i].mood) + ")");
        var tempObj = {mood: convertDaylioMood(csvObjArr[i].mood),
                       date:csvObjArr[i].full_date,
                       tag:csvObjArr[i].activities};
        tempData.data.push(tempObj);
    }
    return tempData;
}

function csvToObjectArr(csv){
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
  
    for(var i = 1; i < lines.length; i++){
        var obj = {};
        var currentline = lines[i].split(",");
  
        for(var j = 0; j < headers.length; j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
    }
  
    return result;
  }