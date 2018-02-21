import startApp from './App';
import io from 'socket.io-client';
import events from 'events';

const inputEmitter = new events.EventEmitter();

const { logEntry, renderChart } = startApp(inputEmitter);

const socket = io.connect('http://localhost:80');

socket.on('input_error', (msg)=>alert(msg));
socket.on('DB_error', (msg)=>alert(msg));
socket.on('update', logEntry);
socket.on('sendChartdata', renderChart);

inputEmitter.on('requestChartdata', (data) => socket.emit('requestChartdata', data));
