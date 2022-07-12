import React, {useMemo, useState} from 'react';
import {Column, useFilters, useGlobalFilter, useTable} from 'react-table';
import styles from './table-component.module.scss'
import {TableModesType} from '../search-section';
// import {GlobalFilter} from './filter/global-filter';


type OwnProps = {
    columns: readonly Column[],
    data: readonly {}[],
    tableModes: TableModesType
}

export const Table: React.FC<OwnProps> = ( { columns, data, tableModes } ) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        // state,
        // setGlobalFilter,
    } = useTable({
            columns,
            data,
        },
        useFilters,
        useGlobalFilter)
    // const {globalFilter} = state

    // отмечаем цветом выбранную строку
    const [ selectedRow, setSelectedRow ] = useState(rows.map(() => false))
    // сбрасывается только при смене вкладки
    useMemo(() => {
        setSelectedRow(selectedRow.map(() => false))
    }, [ tableModes.searchTblMode, tableModes.historyTblMode, tableModes.statusTblMode ])

    // Render the UI for your table

    return ( <>
            {/*<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />*/ }
            <table { ...getTableProps() }>
                <thead>
                { headerGroups.map(( headerGroup ) => (
                    <tr { ...headerGroup.getHeaderGroupProps() }>
                        { headerGroup.headers.map(( column ) => (
                            <th { ...column.getHeaderProps() }>{ column.render('Header') }
                                { // @ts-ignore-next-line
                                    column.canFilter
                                        ? column.render('Filter') : null
                                }
                            </th>
                        )) }
                    </tr>
                )) }
                </thead>
                <tbody { ...getTableBodyProps() }>
                { rows.map(( row, rowId ) => {
                    prepareRow(row)
                    return (
                        <tr { ...row.getRowProps() } className={
                            ( selectedRow[rowId] ? styles.selected : '' ) }
                            onClick={ () => {
                                setSelectedRow(selectedRow.map(
                                    ( val, id ) => id === rowId ? !val : val,
                                ))
                            } }>
                            { row.cells.map(cell => {
                                return <td { ...cell.getCellProps() }
                                >{ cell.render('Cell', {
                                    requestNumber: cell.row.values.requestNumber,
                                    price: cell.row.values.price,
                                }) }</td>
                            }) }
                        </tr>
                    )
                }) }
                </tbody>
            </table>
        </>
    )
}
