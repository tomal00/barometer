import React from 'react'

const TimeInput = ({ onChange, title }) => (
        <div>
            {title}
            <input
                type="datetime-local" 
                onChange = {(e)=>{onChange(e.target.value)}}
                required
            />
        </div>
)

export default TimeInput
