import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import OffsetSlider from '../containers/OffsetSlider'


const Chart = ({ data, offset }) => {
    if(data.length) {
        return (
            <React.Fragment>
                <OffsetSlider />
                <div className = "chartgen">
                    <ResponsiveContainer width="100%" height="100%" position="relative" >
                        <LineChart
                            data={data.map((item) => {const obj = new Object();obj.datetime = new Date(item.datetime).toLocaleString(); obj.value = item.value; return obj})}
                            margin = {{top: 40, left: 0, right: 40}}
                        >
                            <XAxis dataKey="datetime" />
                            <YAxis domain = {[parseInt(Math.min(...data.map((item) => item.value))) - parseInt(offset), parseInt(Math.max(...data.map((item) => item.value))) + parseInt(offset)]} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip/>
                            <Legend />
                            <Line
                                dot={false}
                                type="monotone"
                                dataKey="value"
                                unit = " mBar"
                                stroke="#1c3007"
                                activeDot={{r: 4}}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </React.Fragment>
        )
    }
    return null
}

export default Chart
