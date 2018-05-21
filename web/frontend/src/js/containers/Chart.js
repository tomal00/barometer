import ChartComponent from '../components/Chart'
import {connect} from 'react-redux'

const mapStateToProps = (state) => {
    if(state.chart.err) {
        alert(state.chart.err)
    }
    return { data: state.chart.data, offset: state.chart.offset}
}

const Chart = connect(mapStateToProps, null)(ChartComponent)

export default Chart
