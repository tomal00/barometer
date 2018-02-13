import React from 'react';
import ReactDOM from 'react-dom';
import socketioHandler from './socketioHandler';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

class DateTime extends React.Component {
    constructor(props) {
        super(props);
        this.monthChanged = this.monthChanged.bind(this);
        this.dateTimeChanged = this.dateTimeChanged.bind(this);
        this.state = {maxDay: 31, minutes: null, hours: null, days: null, months: null, years: null};
    }
    async dateTimeChanged(event, type) {
        await this.setState({[type]: event.target.value});
        this.props.onChange(Object.values(this.state).slice(1));
    }
    monthChanged(event) {
        const daysByMonth = { _1: '31', _2: '28', _3: '31', _4: '30', _5: '31', _6: '30', _7: '31', _8: '31', _9: '30', _10: '31', _11: '30', _12: '31' };
        if(daysByMonth[`_${event.target.value}`]) {
            this.setState({maxDay: daysByMonth[`_${event.target.value}`]});
        }
    }
    render() {
        return (
            <div>
                {this.props.title}
                <TimeInput minValue="2000" maxValue={new Date().getFullYear()} type="years" onChange = {this.dateTimeChanged} />
                <TimeInput minValue="1" maxValue="12" type="months" onChange = {this.dateTimeChanged} onMonthChange = {this.monthChanged} />
                <TimeInput minValue="1" maxValue={this.state.maxDay} type="days" onChange = {this.dateTimeChanged} />
                <TimeInput minValue="0" maxValue="23" type="hours" onChange = {this.dateTimeChanged} />
                <TimeInput minValue="0" maxValue="59" type="minutes" onChange = {this.dateTimeChanged} />
            </div>
        )
    }
}
class ControlPanel extends React.Component {
    constructor(props) {
        super(props)
        this.submitForm = this.submitForm.bind(this);
        this.startDateChanged = this.startDateChanged.bind(this);
        this.endDateChanged = this.endDateChanged.bind(this);
        this.state = {from: [5], to: [5]};
    }
    submitForm(event) {
        event.preventDefault();
        const from = this.state.from.map(item => item).reverse().join('-')
        const to = this.state.to.map(item => item).reverse().join('-')
        socketioHandler.requestChartdata(JSON.stringify({from, to}));
    }
    startDateChanged(data) {
        this.setState({from: data});;
    }
    endDateChanged(data) {
        this.setState({to: data});
    }
    render() {
        return (
            <form id = "controlPanel" className = "controlPanel" onSubmit = {this.submitForm}>
                <div>
                    <DateTime title="Počáteční datum a čas " onChange = {this.startDateChanged} />
                    <DateTime title="Konečné datum a čas " onChange = {this.endDateChanged} />
                </div>
                <input type="submit" value="Zobrazit" className="submitBtn" />
            </form>
        )
    }
}
class EntriesTable extends React.Component {
    constructor(props) {
        super(props);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {tableData: []}
    }
    handleUpdate(data) {
        console.log("data logged")
        const dataParsed = [];
        for(const i of JSON.parse(data)) {
            dataParsed.push(<TableEntry {...i} />);
        }
        this.setState({tableData: dataParsed});
    }
    render() {
        return <table className = "entriesTable">{this.state.tableData}</table>
    }
}

class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.onDataReceived = this.onDataReceived.bind(this);
        this.state = {data: []}
    }
    onDataReceived(data) {
        this.setState({data});
    }
    render() {
        if(this.state.data.length){
            <div className = "chartgen">
                <ResponsiveContainer width="100%" height="100%" position="relative">
                    <LineChart data={this.state.data} >
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend />
                        <Line type="monotone" dataKey="hodnota" stroke="#8884d8" activeDot={{r: 8}}/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        }
        return null;
    }
}

const TimeInput = (props) => {
        if(props.onMonthChange)
        {
            return <input type="number" min={props.minValue} max={props.maxValue} placeholder={props.type} onChange={(e)=>{props.onMonthChange(e); props.onChange(e, props.type)}}/>
        }
        return <input type="number" min={props.minValue} max={props.maxValue} placeholder={props.type} onChange = {(e)=>{props.onChange(e, props.type)}}/>
}

const TableEntry = (props) => (
        <tr>
            <th>props.time</th>
            <th>props.value</th>
        </tr>
)

const App = () => (
    <React.Fragment>
        <div className = "lastEntriesWrapper">
            <div>Poslední záznamy</div>
            <EntriesTable />
        </div>
        <div className = "controlPanelWrapper">
            <ControlPanel />
        </div>
        <div className = "chartWrapper">
            <Chart />
        </div>
    </React.Fragment>
)
socketioHandler.setSocket('http://localhost:80', (msg)=>alert(msg), (msg)=>alert(msg), EntriesTable.handleUpdate, Chart.onDataReceived);
ReactDOM.render(<App />, document.getElementById('root'));
