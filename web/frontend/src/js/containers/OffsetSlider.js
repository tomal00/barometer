import { connect } from 'react-redux'
import { changeOffset } from '../actions/actions'
import OffsetSliderComponent from '../components/OffsetSlider'

const mapDispatchToProps = (dispatch) => ({
    onChange: (offset) => {dispatch(changeOffset(offset))}
})
const mapStateToProps = (state) => {
    return { value: state.chart.offset }
}

const OffsetSlider = connect(mapStateToProps, mapDispatchToProps)(OffsetSliderComponent)

export default OffsetSlider
