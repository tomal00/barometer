import ControlPanel from '../components/ControlPanel'
import {connect} from 'react-redux'

const mapStateToProps = (state) => ({
    from: state.timeInputs.from,
    to: state.timeInputs.to
})
const Controls = connect(mapStateToProps, null)(ControlPanel)

export default Controls
