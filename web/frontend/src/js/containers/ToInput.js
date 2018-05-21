import { connect } from 'react-redux'
import { changeReqDate } from '../actions/actions'
import TimeInput from '../components/TimeInput'

const mapDispatchToProps = (dispatch) => ({
    onChange: (datetime) => {dispatch(changeReqDate('to', datetime))}
})

const ToInput = connect(null, mapDispatchToProps)(TimeInput)

export default ToInput
