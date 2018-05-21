import FromInput from '../containers/FromInput'
import ToInput from '../containers/ToInput'
import React from 'react'
import {fetchChartData} from '../actions/actions'

const ControlPanel = ({ from, to, dispatch }) => (
    <form
        id = "controlPanel"
        acceptCharset = "UTF-8"
        className = "controlPanel"
        onSubmit = {(e)=>{e.preventDefault(); dispatch(fetchChartData(from, to))}}
    >
        <div>
            <FromInput />
            <ToInput />
        </div>
        <input type="submit" value="Zobrazit" className="submitBtn" />
    </form>
)

export default ControlPanel
