import io from 'socket.io-client';

let socket;

const setSocket = (url, onInputError, onDBerror, onUpdate, onReceivedChartData) => {
    socket = io.connect(url);

    socket.on('input_error', onInputError);
    socket.on('DB_error', onDBerror);
    socket.on('update', onUpdate);
    socket.on('sendChartdata', onReceivedChartData);

}
const requestChartdata = (data) => {
    socket.emit('requestChartdata', data);
}

export default {
    setSocket,
    requestChartdata
}
