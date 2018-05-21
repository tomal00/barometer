import TableEntry from './TableEntry'
import React from 'react'

const EntriesTable = ({ data }) => (
    <table className = "entriesTable">
        <tbody>
            {data.map((itm) => <TableEntry {...itm} key = {itm.datetime}/>)}
        </tbody>
    </table>
)

export default EntriesTable
