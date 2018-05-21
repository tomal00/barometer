import * as actions from '../actions/actions'
import { combineReducers } from 'redux'

const chart = (state = {data: [], inProgress: false, offset: 1}, action) => {
    switch(action.type) {
        case actions.REQUEST_CHART_DATA:
            return {
                ...state,
                err: false,
                from: action.from,
                to: action.to,
                inProgress: true,
            }
        case actions.RECEIVED_CHART_DATA:
            return {
                ...state,
                err: false,
                inProgress: false,
                data: action.data
            }
        case actions.REQFAILED_CHART_DATA:
            return {
                ...state,
                inProgress: false,
                err: action.err
            }
        case actions.CHANGE_OFFSET:
            return {
                ...state,
                offset: action.offset
            }
        default:
            return {
                ...state,
                err: false
            }
    }
}

const logs = (state = {data: [], inProgress : false}, action) => {
    switch(action.type) {
        case actions.REQUEST_LOGS:
            return {
                ...state,
                err: false,
                inProgress: true,
                count: action.count
            }
        case actions.RECEIVED_LOGS:
            return {
                ...state,
                err: false,
                inProgress: false,
                data: action.data
            }
        case actions.REQFAILED_LOGS:
            return {
                ...state,
                inProgress: false,
                err: action.err
            }
        case actions.RECEIVED_UPDATE:
            return {
                ...state,
                err: false,
                data: action.update.concat(state.data.filter((itm) => itm.datetime !== action.update[0].datetime)).slice(0,19)
            }
        default:
            return {
                ...state,
                err: false
            }
    }
}

const timeInputs = (state = {}, action) => {
    switch(action.type) {
        case actions.CHANGE_REQ_DATE:
            return {
                ...state,
                [action.dateType] : action.datetime
            }
        default:
            return {
                ...state
            }
    }
}

const reducer = combineReducers({ chart, logs, timeInputs })

export default reducer
