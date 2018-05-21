import { connect } from 'react-redux'
import EntriesTable from '../components/EntriesTable'

const mapStateToProps = (state) => {
    if(state.logs.err) {
        alert(state.logs.err)
    }
    return { data: state.logs.data }
}

const LastEntries = connect(mapStateToProps, null)(EntriesTable)

export default LastEntries
