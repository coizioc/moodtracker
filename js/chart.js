var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var CHART_OPTIONS = {
    scales: {
        yAxes: [{
            display: true,
            ticks: {
                min: 0,
                max: 6,
                stepSize: 1,
                defaultFontSize: 36,
                callback: function(label, index, labels) {
                    switch (label) {
                        case 0:
                            return '😭';
                        case 1:
                            return '😢';
                        case 2:
                            return '🙁';
                        case 3:
                            return '😐';
                        case 4:
                            return '🙂';
                        case 5:
                            return '😃';
                        case 6:
                            return '😁';
                    }
                }
            }
        }]
    }
}

var moodData = {data: []};

var ctx = document.getElementById('moodChart').getContext('2d');

var moodChart = new Chart(ctx, {
    type: 'line',

    data: {
        labels: [],
        datasets: [{
            label: 'Avg. Daily Mood',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 255, 255)',
            lineTension: 0,
            fill: false,
            data: []
        }]
    },

    options: CHART_OPTIONS
});

$( document ).ready(function() {
    if(localStorage.getItem("moodData") === null) {
        localStorage.setItem("moodData", "{\"data\": []}");
    }
    else {
        moodData = JSON.parse(localStorage.getItem("moodData"));
        updateChart();
    }
    
    $( "#datepicker" ).datepicker().datepicker('setDate', new Date());

    $( "#clear" ).click(function() {
        var r = confirm("This will remove all of your mood data. Are you sure you want to clear cache?");
        if (r == true) {
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
});

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