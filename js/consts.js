Chart.defaults.global.defaultFontSize = 16;
Chart.defaults.global.defaultFontColor = "#999";

var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var CHART_OPTIONS = {
    scales: {
        yAxes: [{
            labelFontSize: 36,
            display: true,
            ticks: {
                min: 0,
                max: 6,
                stepSize: 1,
                fontSize: 36,
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

var MOBILE_CHART_OPTIONS = {
    legend: {
        labels: {
            fontSize: 12
        }
    },
    scales: {
        xAxes: [{
            ticks: {
                fontSize: 12,
            }
        }],
        yAxes: [{
            labelFontSize: 36,
            display: true,
            ticks: {
                min: 0,
                max: 6,
                stepSize: 1,
                fontSize: 12,
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

var DESKTOP_LINE_CHART = {
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
}

var MOBILE_LINE_CHART = {
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

    options: MOBILE_CHART_OPTIONS
}

var DESKTOP_BAR_CHART = {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: 'Avg. Mood',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 255, 255)',
            lineTension: 0,
            fill: false,
            data: []
        }]
    },

    options: CHART_OPTIONS
}

var MOBILE_BAR_CHART = {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: 'Avg. Mood',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 255, 255)',
            lineTension: 0,
            fill: false,
            data: []
        }]
    },

    options: MOBILE_CHART_OPTIONS
}

var CHART_PLUGINS = [{
    beforeDraw: function(c) {
        var chartHeight = c.chart.height;
        c.scales['y-axis-0'].options.ticks.fontSize = chartHeight * 10 / 100;
        c.scales['x-axis-0'].options.ticks.fontSize = chartHeight * 6 / 100;
    }
}]