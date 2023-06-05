import React, {useMemo} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {columnFilter} from './filter/column-filters'
import {useSelector} from 'react-redux'
import {
    getContentTableStoreInHistory,
    getContentTableStoreInWork,
    getContentTableStoreNew,
    getFilteredRowsCountTableStore,
} from '../../../selectors/table/table-reselect'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {TableModesType} from '../table-section'
import {ddMmYearFormat} from '../../../utils/date-formats'
import {getCashRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {OneRequestTableType} from '../../../types/form-types'
import {toNumber} from '../../../utils/parsers'
import {LocalStatusCell} from './cells/local-status-cell'
import {Column} from 'react-table'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {initialFiltersState} from '../../../redux/table/filters-store-reducer'
import {DeleteCell} from './cells/delete-cell'
import {ButtonCell} from './cells/button-cell'


type OwnProps = {
    tableModes: TableModesType
    filters: typeof initialFiltersState['values']
}


export const TableComponent: React.ComponentType<OwnProps> = ( {
                                                                   tableModes,
                                                                   filters: {
                                                                       dayFilter,
                                                                       routeFilter,
                                                                       cargoFilter,
                                                                       statusFilter,
                                                                   },
                                                               } ) => {

    const {
        historyTblMode,
        searchTblMode,
        statusTblMode,
    } = tableModes

    const navigate = useNavigate()
    const routes = useSelector(getRoutesStore)
    const { maps, requestInfo } = routes
    const authCash = toNumber(useSelector(getCashRequisitesStore))
    const filteredRows = useSelector(getFilteredRowsCountTableStore)


    const TABLE_CONTENT = useSelector(
        searchTblMode ? getContentTableStoreNew
            : historyTblMode ? getContentTableStoreInHistory
                : getContentTableStoreInWork,
    )

    const data = useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])

    // хедер в начале для статусов (показывает количество заявок в списке и кол-во отфильтрованных
    const countHeader = <span style={ { fontSize: '75%' } }>{
        `${ TABLE_CONTENT.length || '' }${ ( filteredRows !== TABLE_CONTENT.length ) ? '/' + filteredRows : '' }`
    }</span>

    // хедер в конце для удялторов
    const deleteHeader = statusTblMode ?
        <MaterialIcon icon_name={ 'delete_forever' } style={ { lineHeight: 'unset' } }/> : ''

    // формирование хедеров и контента таблицы
    const columns: Column<OneRequestTableType>[] = useMemo(
        () => [
            {
                Header: countHeader,
                accessor: 'localStatus',
                Filter: columnFilter(statusFilter),
                disableFilters: false,
                Cell: statusTblMode ? LocalStatusCell : <></>,
            },
            {
                Header: '№',
                accessor: 'requestNumber',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
            },
            {
                Header: 'Тип груза',
                accessor: 'cargoType',
                Filter: columnFilter(cargoFilter),
                disableFilters: false,
            },
            {
                Header: 'Дата',
                accessor: 'shipmentDate',
                Filter: columnFilter(ddMmYearFormat(dayFilter)),
                disableFilters: false,
            },
            {
                Header: 'Расстояние',
                accessor: 'distance',
                Filter: columnFilter(routeFilter),
                disableFilters: false,
                filter: 'between',
                Cell: ( { value }: { value: number } ) => `${ value } км`,
            },
            {
                Header: 'Маршрут',
                accessor: 'route',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
            },
            {
                Header: statusTblMode ? 'На заявке' : 'Ответы',
                accessor: !searchTblMode ? 'responseEmployee' : 'answers',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'price',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                // чтобы добавить быстрый доступ к нужным полям ищи метку #CellProps в table.tsx
                // Cell: buttonCell
                Cell: ButtonCell({ tableModes, authCash }),
            },
            {
                Header: deleteHeader,
                accessor: 'roleStatus',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                Cell: DeleteCell({ isStatusTableMode: statusTblMode }),
            },
        ],
        [
            /* моды таблицы */
            searchTblMode, historyTblMode, statusTblMode,
            /* значение фильтров вне таблицы (должны быть все) */
            statusFilter, dayFilter, routeFilter, cargoFilter,
            /* навигация и т.п. */
            navigate, requestInfo, maps,
            /* допы */
            authCash,
            TABLE_CONTENT, countHeader, deleteHeader,
        ],
    )

    const tableModesStyle = styles['tableComponent__' + (
        searchTblMode ? 'search'
            : historyTblMode
                ? 'history'
                : 'status'
    )
        ]

    return (
        <div className={ styles.tableComponent + ' ' + tableModesStyle }>
            <Table columns={ columns } data={ data } tableModes={ tableModes }/>
        </div>
    )
}
