import { InputError } from './Errors';

import express from 'express';
import http from 'http';
import mysql from 'mysql';
import config from './cfg';
import { fetchChartdata, fetchLatestLogs, getRowCountBetween, checkInput } from './database';

const app = express();
const server = http.createServer(app);
const port = config.port;
const io = require('socket.io')(server);

const pool = mysql.createPool(config.dbCfg.setUp);

app.use(express.static(require('path').resolve('./web/frontend/assets')));

app.get('/home', (req, res) => {
    res.set({
        'Content-Type': 'text/html',

    });
    res.status(200).sendFile(require('path').resolve('./web/frontend/assets/index.html'));
});
app.get('/api/fetchLogs', (req, res) => {
    fetchLatestLogs(12, pool, config.dbCfg).then((data) => {
        res.set({
            'Content-type': 'application/json',
        });
        res.status(200).json(data);
    })
    .catch((err) => {
        res.statusMessage = err.message;
        res.status(500).end();
    });
});
app.get('/api/fetchChartdata', async (req, res) => {
    try {
        checkInput(req.query.from);
        checkInput(req.query.to);

        if (req.query.from > req.query.to) {
            throw new InputError('A start date must not be later than an end date!')
        }

        const rowCount = await getRowCountBetween(req.query.from, req.query.to, pool, config.dbCfg);

        const resData = await fetchChartdata(req.query.from, req.query.to, pool, config.dbCfg, Math.ceil(rowCount / 50));

        res.set({
            'Content-type': 'application/json',
        });
        res.status(200).json(resData);
    }
    catch (err) {
        if (err instanceof InputError) {
            res.statusMessage = err.message;
            res.status(400).end();
        }
        else {
            res.statusMessage = err.message;
            res.status(500).end();
        }
    }
});
app.use((req, res) => {
    res.redirect(301, '/home');
});

const updateClients = () => {
    fetchLatestLogs(1, pool, config.dbCfg)
    .then((data) => {
        io.sockets.emit('update', JSON.stringify(data));
    })
    .catch((err) => {
        console.log(err);
    });
};

setInterval(updateClients, 1000 * 60 * 10);
server.listen(port);
