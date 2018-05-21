import React from 'react'
import LastEntries from '../containers/LastEntries'
import Controls from '../containers/Controls'
import Chart from '../containers/Chart'

const App = () => (
    <React.Fragment>
        <div className = "lastEntriesWrapper">
            <div>{'Poslední záznamy'}</div>
            <LastEntries />
        </div>
        <div className = "controlPanelWrapper">
            <Controls />
        </div>
        <div className = "chartWrapper">
            <Chart />
        </div>
    </React.Fragment>
)

export default App
