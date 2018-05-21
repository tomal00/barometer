import cfg from '../cfg'


export const REQUEST_CHART_DATA = 'FETCH_CHART_DATA'
export const RECEIVED_CHART_DATA = 'RECEIVED_CHART_DATA'
export const REQFAILED_CHART_DATA = 'REQFAILED_CHART_DATA'
export const CHANGE_OFFSET = 'CHANGE_OFFSET'

export const requestChartdata = (from, to) => ({ type: REQUEST_CHART_DATA, from, to })
export const receiveChartdata = (data) => ({ type: RECEIVED_CHART_DATA, data })
export const reqChardataFail = (err) => ({ type: REQFAILED_CHART_DATA, err })
export const changeOffset = (offset) => ({ type: CHANGE_OFFSET, offset })
export const fetchChartData = (from, to) => (dispatch) => {
    dispatch(requestChartdata(from,to))
    try {
        return (
            fetch(new Request(`http://${cfg.host}:${cfg.port}/api/fetchChartdata?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`))
            .then((res) => {
                if(res.status === 200) {
                    res.json().then(data => dispatch(receiveChartdata(data)))
                }
                else {
                    dispatch(reqChardataFail(res.statusText))
                }
            })
        )
    }
    catch (err) {
        dispatch(reqChardataFail('Invalid input!'))
    }
}

export const REQUEST_LOGS = 'REQUEST_LOGS'
export const RECEIVED_LOGS = 'RECEIVED_LOGS'
export const REQFAILED_LOGS = 'REQFAILED_LOGS'

export const requestLogs = () => ({ type: REQUEST_LOGS })
export const receiveLogs = (data) => ({ type: RECEIVED_LOGS, data })
export const reqLogsFail = (err) => ({ type: REQFAILED_LOGS, err})
export const fetchLogs = () => (dispatch) => {
    dispatch(requestLogs())
    return (
        fetch(new Request(`http://${cfg.host}:${cfg.port}/api/fetchLogs`))
        .then((res) => {
            if(res.status === 200) {
                res.json().then(data => dispatch(receiveLogs(data)))
            }
            else {
                dispatch(reqLogsFail(res.statusText))
            }
        })
    )
}


export const CHANGE_REQ_DATE = 'CHANGE_REQ_DATE'
export const changeReqDate = (dateType, datetime) => ({ type: CHANGE_REQ_DATE, dateType, datetime })


export const RECEIVED_UPDATE = 'RECEIVED_UPDATE'
export const receiveUpdate = (update) => ({ type: RECEIVED_UPDATE, update })
