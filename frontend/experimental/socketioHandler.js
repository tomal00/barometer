import io from 'socket.io-client';

let socket;

const setSocket = (url, onInputError, onDBerror, onUpdate, onReceivedChartData) => {
    socket = io.connect(url);
    console.log(onReceivedChartData);
    METODY PASSNUTÝ Z REACTU JSOU UNDEFINED
    socket.on('input_error', onInputError);
    socket.on('DB_error', onDBerror);
    socket.on('update', (msg)=>console.log(msg));
    socket.on('sendChartdata', onReceivedChartData);
    socket.on('test', (msg)=>console.log(msg));
    socket.on('connect', ()=>console.log("AJO CONNECTED??"))

    socket.emit('testtest', 'hahahaha')
}
const requestChartdata = (data) => {
    console.log("NANI?")
    console.log(data)
    console.log(socket)
    socket.emit('requestChartdata', data);
}

export default {
    setSocket,
    requestChartdata
}
