var moodData = {data: []};
var ctx = document.getElementById('moodChart').getContext('2d');
var statsChart = ($(window).width() > 600) ? new Chart(ctx, DESKTOP_BAR_CHART) : new Chart(ctx, MOBILE_BAR_CHART);

$( document ).ready(function() {
    if(localStorage.getItem("moodData") === null) {
        localStorage.setItem("moodData", "{\"data\": []}");
    }
    else {
        moodData = JSON.parse(localStorage.getItem("moodData"));
        console.log(moodData);
        updateChart();
    }
});

function updateChart() {
    chartData = getMonthlyChartData();
    
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