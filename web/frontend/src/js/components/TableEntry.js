import React from 'react'

const TableEntry = ({ datetime, value }) => {
    const d = new Date(datetime)
    return (
        <tr>
            <td>{`${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}, ${((d.getHours() < 10) ? '0' : '') + d.getHours()}:${((d.getMinutes() < 10) ? '0' : '') + d.getMinutes()}`}</td>
            <td>{`${value} mBar`}</td>
        </tr>
    )
}
export default TableEntry
