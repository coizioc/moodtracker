var moodData = {data: []};
var ctx = document.getElementById('moodChart').getContext('2d');
var statsChart = ($(window).width() > 600) ? new Chart(ctx, DESKTOP_BAR_CHART) : new Chart(ctx, MOBILE_BAR_CHART);
var isWeekly = false;

$( document ).ready(function() {
    if(localStorage.getItem("moodData") === null) {
        localStorage.setItem("moodData", "{\"data\": []}");
    }
    else {
        moodData = JSON.parse(localStorage.getItem("moodData"));
        console.log(moodData);
        updateChart();
    }

    $( "#switchWeeklyMonthly" ).click(function() {
        // TODO fix text switching on button.
        if(isWeekly) {
            $( "switchWeeklyMonthly" ).html("See Weekly Stats");
        }
        else {
            $( "switchWeeklyMonthly" ).html("See Monthly Stats");
        }
        // Flip value of isWeekly.
        isWeekly ^= true;
        updateChart(isWeekly);
    });
});

function updateChart(isWeekly) {
    var chartData = null;
    if(isWeekly) {
        chartData = getWeeklyChartData();
    }
    else {
        chartData = getMonthlyChartData();
    }
    
    
    statsChart.data.labels = chartData[0];
    statsChart.data.datasets.forEach(function(dataset) {
        dataset.data = chartData[1];
    });
    statsChart.update();
}

function getMonthlyChartData() {
    var moodDates = [];
    var moodLevels = [];
    var moodsPerMonth = 1;

    for(var i = 0; i < moodData.data.length; i++) {
        // If repeat, don't add date to chartData and update average for that date.
        if(moodData.data[i] === undefined) {
            continue;
        }
        var currMoodMonth = moodData.data[i].date.split('-')[1];
        // If currMoodMonth is the same as the the previous entry of moodDates,
        // update the running average for that month.
        if(i > 0 && moodDates[moodDates.length - 1] === currMoodMonth) {
            moodsPerMonth++;
            var currAvg = moodLevels[moodLevels.length - 1];
            currAvg -= currAvg / moodsPerMonth;
            currAvg += moodData.data[i].mood / moodsPerMonth;
            moodLevels[moodLevels.length - 1] = currAvg;
        }
        // Otherwise, reset average counter and push moodData to chartData.
        else {
            moodsPerMonth = 1;
            moodDates.push(currMoodMonth);
            moodLevels.push(moodData.data[i].mood);
        }
    }

    console.log(moodDates);

    // Convert each moodDate element to its respective month.
    for(var i = 0; i < moodDates.length ; i++)
        moodDates[i] = MONTHS[parseInt(moodDates[i]) - 1];

    return [moodDates, moodLevels];
}

function getMonday(d) {
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

function getWeeklyChartData() {
    var moodDates = [];
    var moodLevels = [];
    var moodsPerWeek = 1;
    var lastMonday = null;

    for(var i = 0; i < moodData.data.length; i++) {
        // If repeat, don't add date to chartData and update average for that date.
        if(moodData.data[i] === undefined) {
            continue;
        }
        var currMoodDate = new Date(moodData.data[i].date);
        var currMonday = getMonday(currMoodDate);
        var isCurrMondayEqualToLastMonday = false;
        if(lastMonday !== null) {
            isCurrMondayEqualToLastMonday = (currMonday.getFullYear() === lastMonday.getFullYear()) &&
                                            (currMonday.getMonth() === lastMonday.getMonth()) &&
                                            (currMonday.getDate() == lastMonday.getDate());
        }
        // If currMoodDate is the same week as the the previous entry of moodDates,
        // update the running average for that week.
        if(i > 0 && isCurrMondayEqualToLastMonday) {
            currDayOfTheWeek = currMoodDate.getDate();
            moodsPerWeek++;
            var currAvg = moodLevels[moodLevels.length - 1];
            currAvg -= currAvg / moodsPerWeek;
            currAvg += moodData.data[i].mood / moodsPerWeek;
            moodLevels[moodLevels.length - 1] = currAvg;
        }
        // Otherwise, reset average counter and push moodData to chartData.
        else {
            moodsPerWeek = 1;
            lastMonday = currMonday;
            moodDates.push(currMonday);
            moodLevels.push(moodData.data[i].mood);
        }
    }

    console.log(moodDates);
    
    // Convert each moodDate Date object into a formatted date.
    for(var i = 0; i < moodDates.length ; i++) {
        moodDates[i] = formatDate(moodDates[i]);
    }

    return [moodDates, moodLevels];
}

function formatDate(date) {
    var dd = date.getDate();
    var mm = date.getMonth() + 1;
    var yyyy = date.getFullYear();

    if(dd < 10) {
        dd = "0" + dd;
    }
    if(mm < 10) {
        mm = "0" + mm;
    }

    return yyyy + "-" + mm + "-" + dd;
}