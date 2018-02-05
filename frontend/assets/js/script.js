'use strict';

const socket = io.connect('http://localhost:80');
const tableData = [];

const fillTable = (data, update) => {
    if (!update) {
        for (let i = 0; i < data.length; i++) {
            if (!(tableData.map((item) => item.time).includes(data[i].time))) {
                $('#entriesTable').append(`<tr><th>${data[i].time}</th><th>${data[i].value}</th></tr>`);
                tableData.push(data[i]);
            }
        }
    } else {
        $('#entriesTable').append(`<tr><th>${data.time}</th><th>${data.value}</th></tr>`);
    }
}

$('#showForm').submit((event) => {
    //PODMÍNKY IMPLEMENTOVAT I NA SERVER
    event.preventDefault();
    const fromD = [$('input[name=fY]').val(), $('input[name=fM]').val(), $('input[name=fD]').val(), $('input[name=fH]').val(), $('input[name=fMM]').val()];
    const toD = [$('input[name=tY]').val(), $('input[name=tM]').val(), $('input[name=tD]').val(), $('input[name=tH]').val(), $('input[name=tMM]').val()];

    try {
        checkInput(...fromD);
        checkInput(...toD);
        socket.emit('requestChartdata', JSON.stringify({
            from: fromD.join('-'),
            to: toD.join('-'),
        }));
    }
    catch (err) {
        alert(err.message);
    }
});



const checkInput = (y, m, d, h, mn) => {
    if ([y, m, d, h, mn].includes(undefined) || [y, m, d, h, mn].includes('')) {
        throw new Error('Některá z políček nejsou vyplněná!');
    }
    for (const i of [y, m, d, h, mn]) {
        if (isNaN(i)) {
            throw new Error('Jeden z inputů není číslo!');
        }
    }
    if (m < 1 || m > 12) {
        throw new Error(`Tento měsíc neexistuje! (${m})`);
    }
    const maxdays = { _1: '31', _2: '28', _3: '31', _4: '30', _5: '31', _6: '30', _7: '31', _8: '31', _9: '30', _10: '31', _11: '30', _12: '31' };

    if (d < '1' || d > maxdays[`_${m}`]) {
        throw new Error(`Tento den neexistuje! ${d}`);
    }
    else if (h < '0' || h > '23') {
        throw new Error(`Tato hodina neexistuje! ${h}`);
    }
    else if (mn < '0' || mn > '59') {
        throw new Error(`Tato minuta neexistuje! ${mn}`);
    }
    else if (new Date(y, m - 1, d, h, mn) > new Date()) {
        throw new Error('Záznamy z budoucnosti nemohou existovat!');
    }
};


const throwError = (message) => {
    alert(message);
}
socket.on('input_error', msg => alert(msg));

socket.on('DB_error', msg => alert(msg));

socket.on('update', data => fillTable(JSON.parse(data), data.length < 2));

socket.on('sendChartdata', (data) => {
    if (!JSON.parse(data)) {
        return;
    }
    $('#chartgen').insertFusionCharts({
        type: 'line',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
            'chart': {
                'caption': `Teplota v intervalu od ${JSON.parse(data)[0].label} do ${JSON.parse(data)[JSON.parse(data).length-1].label}`,
                'xAxisName': 'Čas',
                'yAxisName': 'Teplota v °C',
                'baseFontSize': '15',

                //Cosmetics
                'animation': '1',
                'animationDuration': '1.25',
                'lineThickness': '2',
                'paletteColors': '#62a861',
                'baseFontColor': '#000',
                'baseFont': 'Source Sans Pro, sans-serif',
                'captionFontSize': '30',
                'showBorder': '0',
                'bgColor': '#ffffff',
                'showShadow': '0',
                'canvasBgColor': '#ffffff',
                'canvasBorderAlpha': '0',

                'divlineAlpha': '100',
                'divlineColor': '#000',
                'divlineThickness': '1',
                'divLineIsDashed': '1',
                'divLineDashLen': '5',

                'anchorRadius': '5',
                'anchorBorderThickness': '2',

                'showXAxisLine': '1',
                'showYAxisLine': '1',
                'xAxisLineThickness': '3',
                'yAxisLineThickness': '3',
                'xAxisLineColor': '#999999',
                'yAxisLineColor': '#999999',
                'yAxisNameFontSize': '20',
                'xAxisNameFontSize': '20',
                'showAlternateHGridColor': '0',

            },
            'data': JSON.parse(data)
        }
    });
});
