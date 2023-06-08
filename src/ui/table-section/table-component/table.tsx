import React, {useEffect} from 'react'
import {Column, HeaderGroup, useFilters, useGlobalFilter, useSortBy, useTable} from 'react-table'
import styles from './table-component.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {OneRequestTableType, TableModesBooleanType} from '../../../types/form-types'
import {GlobalFilter} from './filter/global-filter'
import {
    getHistoryGlobalValueFiltersStore,
    getSearchGlobalValueFiltersStore,
    getStatusGlobalValueFiltersStore,
} from '../../../selectors/table/filters-reselect'
import {tableStoreActions} from '../../../redux/table/table-store-reducer'


type OwnProps = {
    columns: readonly Column<OneRequestTableType>[],
    data: readonly OneRequestTableType[],
    tableModes: TableModesBooleanType
}

export const Table: React.ComponentType<OwnProps> = ( { columns, data, tableModes } ) => {
    const navRoutes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const globalFilterValue = useSelector(tableModes.isSearchTblMode ? getSearchGlobalValueFiltersStore :
        tableModes.isHistoryTblMode ? getHistoryGlobalValueFiltersStore : getStatusGlobalValueFiltersStore)
    const onDoubleClick = ( rowData: OneRequestTableType ) => () => {
        tableModes.isStatusTblMode && navigate(navRoutes.requestInfo.status + rowData.requestNumber)
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
        useGlobalFilter,
        useSortBy,
    )

    // @ts-ignore-next-line
    const { globalFilter } = state
    const filteredRowsCount = rows.length

    useEffect(() => {
        dispatch(tableStoreActions.setFilteredRows(filteredRowsCount))
    }, [ filteredRowsCount ])

    // отображение статуса сортировки через стили
    const bySortHeaderStyle = ( header: HeaderGroup<OneRequestTableType> ): string =>
        //@ts-ignore-next-line
        ( header.canSort ? styles.headerCanSorted : '' ) + ' ' + (
            //@ts-ignore-next-line
            header.isSorted ? ( header.isSortedDesc
                    ? styles.headerCanSortedUp
                    : styles.headerCanSortedDown )
                : ''
        )

    // подпись под мышкой при наведении на хэдер
    const bySortHeaderTitle = ( header: HeaderGroup<OneRequestTableType> ): string =>
        //@ts-ignore-next-line
        header.canSort ? ( header.isSorted ? ( header.isSortedDesc
                ? 'Отсортировано по убыванию' : 'Отсортировано по возрастанию' ) :
            'На этом столбце доступна сортировка' ) : ''

    return ( <>
            <GlobalFilter filter={ globalFilter } setFilter={ setGlobalFilter } value={ globalFilterValue }/>
            <table { ...getTableProps() }>
                <thead>
                { headerGroups.map(( headerGroup ) => (
                    <tr { ...headerGroup.getHeaderGroupProps() }>
                        { headerGroup.headers.map(( headerItem ) => (
                            <th { ...headerItem.getHeaderProps(
                                //@ts-ignore-next-line // сортировочка
                                headerItem?.getSortByToggleProps(),
                            ) }
                                title={ bySortHeaderTitle(headerItem) }
                                className={ bySortHeaderStyle(headerItem) }
                            >{ headerItem.render('Header') }
                                { // @ts-ignore-next-line
                                    headerItem?.canFilter
                                        ? headerItem?.render('Filter')
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
                                    requestNumber: cell.row.original?.requestNumber,
                                    price: cell.row.original?.price,
                                    answers: cell.row.original?.answers,
                                    marked: cell.row.original?.marked,
                                    globalStatus: cell.row.original?.globalStatus,
                                    localStatus: cell.row.original?.localStatus,
                                    roleStatus: cell.row.original?.roleStatus,
                                    shipmentDateToSortBy: cell.row.original?.shipmentDateToFilter,
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
