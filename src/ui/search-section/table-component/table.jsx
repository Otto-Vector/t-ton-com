import React from 'react';
import {useFilters, useGlobalFilter, useTable} from 'react-table';
// import {GlobalFilter} from './filter/global-filter';

export const Table = ( { columns, data }) => {
// export const Table( { columns, data }: { columns: readonly Column[], data: readonly {}[] } ) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        // state,
        // setGlobalFilter,
    } = useTable( {
        columns,
        data,
    },
      useFilters,
      useGlobalFilter )

    // const {globalFilter} = state

    // Render the UI for your table
    return ( <>
        {/*<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />*/}
        <table { ...getTableProps() }>
            <thead>
            { headerGroups.map( headerGroup => (
                <tr { ...headerGroup.getHeaderGroupProps() }>
                    { headerGroup.headers.map( column => (
                        <th { ...column.getHeaderProps() }>{ column.render( 'Header' ) }
                          {column.canFilter ? column.render('Filter') : null}
                        </th>
                    ) ) }
                </tr>
            ) ) }
            </thead>
            <tbody { ...getTableBodyProps() }>
            { rows.map( ( row, i ) => {
                prepareRow( row )
                return (
                    <tr { ...row.getRowProps() } onClick={ () => { }}>
                        { row.cells.map( cell => {
                            return <td { ...cell.getCellProps() }
                            >{ cell.render( 'Cell', {requestNumber: cell.row.values.requestNumber, price: cell.row.values.price } ) }</td>
                        } ) }
                    </tr>
                )
            } ) }
            </tbody>
        </table>
      </>
    )
}
