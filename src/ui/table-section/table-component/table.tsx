import React from 'react'
import {Column, useFilters, useGlobalFilter, useTable} from 'react-table'
import styles from './table-component.module.scss'
import {TableModesType} from '../table-section'
import {useSelector} from 'react-redux'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {OneRequestTableType} from '../../../types/form-types'
import {GlobalFilter} from './filter/global-filter'
import {getGlobalValueFiltersStore} from '../../../selectors/table/filters-reselect'


type OwnProps = {
    columns: readonly Column<OneRequestTableType>[],
    data: readonly OneRequestTableType[],
    tableModes: TableModesType
}

export const Table: React.FC<OwnProps> = ( { columns, data, tableModes } ) => {
    const navRoutes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const globalFilterValue = useSelector(getGlobalValueFiltersStore)
    const onDoubleClick = ( rowData: OneRequestTableType ) => () => {
        tableModes.statusTblMode && navigate(navRoutes.requestInfo.status + rowData.requestNumber)
    }

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        //@ts-ignore-next-line
        setGlobalFilter,
    } = useTable({
            columns,
            data,
        },
        useFilters,
        useGlobalFilter)

    // @ts-ignore-next-line
    const { globalFilter } = state

    return ( <>
            <GlobalFilter filter={ globalFilter } setFilter={ setGlobalFilter } value={ globalFilterValue }/>
            <table { ...getTableProps() }>
                <thead>
                { headerGroups.map(( headerGroup ) => (
                    <tr { ...headerGroup.getHeaderGroupProps() }>
                        { headerGroup.headers.map(( column ) => (
                            <th { ...column.getHeaderProps() }>{ column.render('Header') }
                                { // @ts-ignore-next-line
                                    column?.canFilter
                                        ? column?.render('Filter')
                                        : <></>
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
                        <tr { ...row.getRowProps() }
                            className={ (
                                data[rowId]?.marked ? styles.selected : '' )
                            }
                            onDoubleClick={ onDoubleClick(data[rowId]) }
                            onClick={ () => {
                                // console.log(data[rowId])
                            } }>
                            { row.cells.map(cell => {
                                return <td { ...cell.getCellProps() }
                                >{ cell.render('Cell', {
                                    // выставляем нужные поля для быстрого доступа здесь #CellProps
                                    requestNumber: cell.row.values?.requestNumber,
                                    price: cell.row.values?.price,
                                    answers: cell.row.original?.answers,
                                    marked: cell.row.original?.marked,
                                    globalStatus: cell.row.original?.globalStatus,
                                    localStatus: cell.row.original?.localStatus,
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
