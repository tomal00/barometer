/*eslint brace-style: ["error", "1tbs", { "allowSingleLine": true }]*/
/*eslint brace-style: ["error", "stroustrup"]*/

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server);

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1a2b3c4d5e',
    database: 'temperatures',
});

app.use(express.static('../frontend/assets'));
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.get('*', (req, res) => {
    res.sendFile('C:/Users/Tom/Desktop/pss_rocnikovka/frontend/index.html');
});
io.on('connection', (socket) => {
    pool.getConnection((error, connection) => {
        if (error) {
            socket.emit('DB_error', 'Chyba při snaze se spojit s databází.');

            return;
        }
        connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 12', (error, results) => {
            connection.release();
            if (error) {
                socket.emit('DB_error', 'Chyba při komunikaci s databází.');

                return;
            }
            const returnData = [];

            for (let i = 0; i < results.length; i += 1) {
                const splitted = results[i].Datum.toString().split(' ');

                returnData.push({
                    time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`,
                    value: results[i].Hodnota,
                });
            }
            socket.emit('update', JSON.stringify(returnData));
        });
    });
    socket.on('requestChartdata', (data) => {
        const d = JSON.parse(data);

        const x = d.from.split('-');
        const y = d.to.split('-');

        try {
            checkInput(...x);
            checkInput(...y);

            pool.getConnection((error, connection) => {
                if (error) {
                    socket.emit('DB_error', 'Chyba při snaze se spojit s databází.');

                    return;
                }
                connection.query(`SELECT COUNT(ID) as Count FROM log
                WHERE Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00'
                AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00'`, (error, results) => {
                    if (error) {
                        socket.emit('DB_error', 'Chyba při komunikaci s databází.');
                        socket.emit('sendChartdata', 'false');

                        return;
                    }
                    let i = 0;

                    if (results[0].Count < 50) {
                        console.log('stfulintr');
                    }
                    else if (results[0].Count) {
                        let j = results[0].Count;

                        for (; j > 50; i += 1) {
                            j /= 2;
                        }
                    }
                    else {
                        let j = results[0].Count - 1;

                        for (; j > 50; i += 1) {
                            j /= 2;
                        }
                    }
                    const query = `SELECT * FROM
                    (SELECT @row := @row +1 AS rownum, log.* FROM
                        (SELECT @row := 0) r, log) ranked
                        WHERE rownum % ${2 ** i} = 0
                        AND Datum >= '${x[0]}-${x[1]}-${x[2]} ${x[3]}:${x[4]}:00'
                        AND Datum < '${y[0]}-${y[1]}-${y[2]} ${y[3]}:${y[4]}:00')`;

                    connection.query(query, (error1, results1) => {
                        connection.release();
                        if (error1) {
                            socket.emit('sendChartdata', 'false');

                            return;
                        }
                        const returnData = [];

                        for (let i = 0; i < results1.length; i += 1) {
                            const splitted = results1[i].Datum.toString().split(' ');

                            returnData.push({
                                label: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`,
                                value: results1[i].Hodnota,
                            });
                        }
                        socket.emit('sendChartdata', JSON.stringify(returnData));
                    });
                });
            });
        }
        catch (err) {
            socket.emit('input_error', err.message);
        }
    });
});

const updateClients = () => {
    pool.getConnection((error, connection) => {
        if (error) {
            return;
        }
        connection.query('SELECT * FROM log ORDER BY ID DESC,ID desc LIMIT 1', (error, results) => {
            connection.release();
            if (error) {
                return;
            }
            const returnData = [];

            for (let i = 0; i < results.length; i += 1) {
                const splitted = results[i].Datum.toString().split(' ');

                returnData.push({
                    time: `${splitted[1]} ${splitted[2]} ${splitted[3]}, ${splitted[4]}`,
                    value: results[i].Hodnota,
                });
            }
            io.sockets.emit('update', JSON.stringify(returnData));
        });
    });
};
const checkInput = (y, m, d, h, mn) => {
    if ([y, m, d, h, mn].includes(undefined) || [y, m, d, h, mn].includes('')) {
        throw new Error('Některá z políček nejsou vyplněná!');
    }
    else if (m < 1 || m > 12) {
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
    else if (new Date(y, m, d, h, mn) > new Date()) {
        throw new Error('Záznamy z budoucnosti nemohou existovat!');
    }
};

server.listen(80);
