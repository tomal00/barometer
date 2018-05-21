import React from 'react'

const OffsetSlider = ({ value, onChange }) => (
    <input type="range" min="1" max="200" value={value} onChange = {(e)=>{onChange(e.target.value)}} className = 'offsetSlider' />
)

export default OffsetSlider
