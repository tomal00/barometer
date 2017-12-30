const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const assert = require('assert');
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
  res.sendFile('C:/Users/tom/Desktop/pssbs/frontend/index.html');
});
//
io.on('connection', (socket) => {
  connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 30',(error, results, fields) => {
    const returnData = [];
    for(let i = 0; i < results.length; i++) {
      const splitted = results[i].Datum.toString().split(' ');
      returnData.push({time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: results[i].Hodnota});
    }
    socket.emit('update', JSON.stringify(returnData));
  });
  socket.on('requestChartdata', (data) => {
    d = JSON.parse(data);
    console.log(d);
    let x = d.from.split('-');
    let y = d.to.split('-');
    //Udělej potom přesnější selekce (né jenom ID % n == 0) a ať, když je selekce větší, než je možno získat dat,
    //tak ať se to jakoby scalene dolu
    connection.query(`SELECT COUNT(ID) as Count FROM log WHERE Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00' AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00'`, (error1, results1, fields1) => {
      let query = `SELECT * FROM LOG WHERE Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00' AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00'`;
      if(results1[0].Count > 30) {
        query += ' AND ID mod 6 = 0';
      }
      /*connection.query(query,(error2, result2, fields2) => {
        console.log(results2);
        console.log("-------------------------------------------------");
        console.log(error2);
        const returnData = [];
        for(let i = 0; i<results2.length; i++){
          const splitted = results2[i].Datum.toString().split(' ');
          returnData.push({label: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: results2[i].Hodnota})
        }
        socket.emit('sendChartdata', JSON.stringify(returnData));
      });*/
    });
  });
});

const updateClients = () => {
  connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 1',(error, results, fields) => {
    let returnData = [];
    for(let i = 0; i < results.length; i++) {
      const splitted = results[i].Datum.toString().split(' ');
      returnData.push({time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`, value: results[i].Hodnota});
    }
    io.sockets.emit('update', JSON.stringify(returnData));
  });
}

server.listen(80);
