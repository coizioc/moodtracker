Chart.defaults.global.defaultFontSize = 18;
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
