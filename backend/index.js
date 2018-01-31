const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1a2b3c4d5e',
  database : 'temperatures'
});
connection.connect();

const io = require('socket.io')(server);

app.use(express.static('../frontend/assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
  res.sendFile('C:/Users/Tom/Desktop/pss_rocnikovka/frontend/index.html');
});
io.on('connection', (socket) => {
  connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 12',(error, results, fields) => {
    if(error) {
      socket.emit('connection', "false");
      return;
    }
    const returnData = results.map((item) => {
        const splitted = item.Datum.toString().split(' ');
        return {time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: item.Hodnota}
    });
    socket.emit('update', JSON.stringify(returnData));
  });
  socket.on('requestChartdata', (data) => {
    d = JSON.parse(data);
    console.log(d);
    const x = d.from.split('-');
    const y = d.to.split('-');
    connection.query(`SELECT COUNT(ID) as Count FROM log WHERE Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00' AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00'`, (error, results, fields) => {
      if(error) {
        socket.emit('sendChartdata', 'false');
        return;
      }
      let i = 0;
      if(results[0].Count < 50) {

      }
      else if(results[0].Count){
        let j = results[0].Count;
        for(; j > 50; i++){
          j /= 2;
        }
      }
      else{
        let j = results[0].Count - 1;
        for(; j > 50; i++){
          j /= 2;
        }
      }
      let query = `SELECT * FROM (SELECT @row := @row +1 AS rownum, log.* FROM (SELECT @row := 0) r, log) ranked WHERE rownum % ${Math.pow(2,i)} = 0 AND Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00' AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00'`;
      connection.query(query, (error1, results1, fields1) => {
        if(error1) {
          socket.emit('sendChartdata', 'false');
          return;
        }
        console.log(error1);
        const returnData = [];
        for(let i = 0; i<results1.length; i++){
          const splitted = results1[i].Datum.toString().split(' ');
          returnData.push({label: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: results1[i].Hodnota})
        }
        socket.emit('sendChartdata', JSON.stringify(returnData));
      });
    });
  });
});

const updateClients = () => {
  connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 1',(error, results, fields) => {
    if(error) {
      io.socket.emit('update', 'false');
      return;
    }
    let returnData = [];
    for(let i = 0; i < results.length; i++) {
      const splitted = results[i].Datum.toString().split(' ');
      returnData.push({time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: results[i].Hodnota});
    }
    io.sockets.emit('update', JSON.stringify(returnData));
  });
}

server.listen(80);
