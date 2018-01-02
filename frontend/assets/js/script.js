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

$('#showForm').submit((event)=>{
  //PODMÍNKY IMPLEMENTOVAT I NA SERVER
  event.preventDefault();
  let fromD = [$('input[name=fY]').val(),$('input[name=fM]').val(),$('input[name=fD]').val(),$('input[name=fH]').val(),$('input[name=fMM]').val()];
  let toD = [$('input[name=tY]').val(),$('input[name=tM]').val(),$('input[name=tD]').val(),$('input[name=tH]').val(),$('input[name=tMM]').val()];

  if(checkDatetimeFormat(fromD))
    return;
  if(checkDatetimeFormat(toD))
    return;
  console.log(":DDD")
  socket.emit('requestChartdata', JSON.stringify({
    from: fromD.join('-'),
    to: toD.join('-')
  }));
});



const checkDatetimeFormat = (datetime) => {
  if(datetime.includes(undefined) || datetime.includes('')){
    throwError('Některé z políček není vyplněné!');
    return true;
  }
  else if(datetime[0] < '2000'){
    throwError('Záznamy z tohoto roku nemůžou existovat!');
    return true;
  }
  /*
  else if(datetime[1] < 1 || datetime[1] > 12){
    throwError("Tento měsíc neexistuje!");
    return true;
  }
  else{
    let maxdays;
    switch(datetime[1]){
      case 1:
        maxdays = '31';
        break;
      case 2:
        maxdays = '28';
        break;
      case 3:
        maxdays = '31';
        break;
      case 4:
        maxdays = '30';
        break;
      case 5:
        maxdays = '31';
       break;
      case 6:
        maxdays = '30';
        break;
      case 7:
        maxdays = '31';
        break;
      case 8:
        maxdays = '31';
        break;
      case 9:
        maxdays = '30';
        break;
      case 10:
        maxdays = '31';
        break;
      case 11:
        maxdays = '30';
        break;
      case 12:
        maxdays = '31';
        break;
    }
    if(datetime[2] < '1' || datetime[2] > maxdays) {
      throwError('Tento den neexistuje!');
      return true;
    }
    else if(datetime[3] < '0' || datetime[3] > '23') {
      throwError('Tato hodina neexistuje!');
      return true;
    }
    else if(datetime[4] < '0' || datetime[4] > '59') {
      throwError('Tato Minuta neexistuje!');
      return true;
    }
    else {
      return false;
    }
  }*/
}

const throwError = (message) => {
  alert(message);
}

socket.on('update', data => fillTable(JSON.parse(data), data.length < 2));

socket.on('sendChartdata', (data) => {
  if(!JSON.parse(data)) {
    console.log('kkt')
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
