import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers/reducers'
import App from './components/App'
import cfg from './cfg'
import io from 'socket.io-client'
import reduxThunk from 'redux-thunk'
import {receiveUpdate, fetchLogs} from './actions/actions'

const socket = io(`http://${cfg.host}:${cfg.port}`)
const store = createStore(reducer, applyMiddleware(reduxThunk))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

store.dispatch(fetchLogs())

socket.on('update', (data) => {
    store.dispatch(receiveUpdate(JSON.parse(data)))
})
