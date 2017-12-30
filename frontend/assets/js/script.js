const socket = io.connect('http://localhost:80');

const fillTable = (data, update) => {
  if(!update) {
    for(let i = 0; i < data.length; i++) {
      $('#entriesTable').append(`<tr><th>${data[i].time}</th><th>${data[i].value}</th></tr>`);
    }
  }
  else {
    $('#entriesTable').append(`<tr><th>${data.time}</th><th>${data.value}</th></tr>`);
  }
}

$('#show').on('click', () => {
  socket.emit('requestChartdata', JSON.stringify({
    from: $('#from').val(),
    to: $('#to').val()
  }));
});

socket.on('update', data => fillTable(JSON.parse(data), data.length < 2));

socket.on('sendChartdata', (data) => {

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
           'baseFont':  'Source Sans Pro, sans-serif',
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
