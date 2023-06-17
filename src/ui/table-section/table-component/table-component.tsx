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
import {ddMmYearFormat} from '../../../utils/date-formats'
import {getCashRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {OneRequestTableType, TableModesBooleanType, TableModesType} from '../../../types/form-types'
import {toNumber} from '../../../utils/parsers'
import {LocalStatusCell} from './cells/local-status-cell'
import {Column} from 'react-table'
import {MaterialIcon} from '../../common/tiny/material-icon/material-icon'
import {initialFiltersState} from '../../../redux/table/filters-store-reducer'
import {DeleteCell} from './cells/delete-cell'
import {ButtonCell} from './cells/button-cell'
import {CountHeader} from './headers/count-header'


type OwnProps = {
    mode: TableModesType
    tableModes: TableModesBooleanType
    filters: typeof initialFiltersState['values']
}

// промежуточный компонент с генератором колонок
export const TableComponent: React.ComponentType<OwnProps> = ( {
                                                                   tableModes,
                                                                   filters: {
                                                                       dayFilter,
                                                                       routeFilter,
                                                                       cargoFilter,
                                                                       statusFilter,
                                                                   },
                                                                   mode,
                                                               } ) => {

    const {
        isHistoryTblMode,
        isSearchTblMode,
        isStatusTblMode,
    } = tableModes

    const authCash = toNumber(useSelector(getCashRequisitesStore))
    const filteredRows = useSelector(getFilteredRowsCountTableStore)

    // Загружаем таблицы в соответвтвии с теми, которые нам нужны
    const TABLE_CONTENT = useSelector(
        isSearchTblMode ? getContentTableStoreNew
            : isHistoryTblMode ? getContentTableStoreInHistory
                : getContentTableStoreInWork,
    )

    const data = useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])

    // формирование хедеров и контента таблицы
    const columns: Column<OneRequestTableType>[] = useMemo(
        () => [
            {
                Header: <CountHeader filteredRows={ filteredRows } unfilteredRows={ TABLE_CONTENT.length }/>,
                accessor: 'localStatus',
                Filter: columnFilter(statusFilter),
                disableFilters: false,
                Cell: isStatusTblMode ? LocalStatusCell : <></>,
                disableSortBy: !isStatusTblMode,
            },
            {
                Header: '№',
                accessor: 'requestNumber',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                disableSortBy: false,
            },
            {
                Header: 'Тип груза',
                accessor: 'cargoType',
                Filter: columnFilter(cargoFilter),
                disableFilters: false,
                disableSortBy: false,
            },
            {
                Header: 'Дата',
                accessor: 'shipmentDate',
                Filter: columnFilter(),
                disableFilters: true,
                disableSortBy: false,
                sortType: 'datetime',
                Cell: ( { value }: { value: Date } ) => ddMmYearFormat(value),
            },
            {
                Header: 'Расстояние',
                accessor: 'distance',
                Filter: columnFilter(routeFilter),
                disableFilters: false,
                filter: 'between',
                Cell: ( { value }: { value: number } ) => `${ value } км`,
                disableSortBy: false,
            },
            {
                Header: 'Маршрут',
                accessor: 'route',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                disableSortBy: false,
            },
            {
                Header: isStatusTblMode ? 'На заявке' : 'Ответы',
                accessor: !isSearchTblMode ? 'responseEmployee' : 'answers',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                disableSortBy: false,
            },
            {
                Header: '',
                accessor: 'price',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                // чтобы добавить быстрый доступ к нужным полям ищи метку #CellProps в table.tsx
                Cell: ButtonCell({ tableModes, authCash }),
                disableSortBy: true,
            },
            {
                Header: isStatusTblMode
                    ? <MaterialIcon icon_name={ 'delete_forever' } style={ { lineHeight: 'unset' } }/>
                    : <></>,
                accessor: 'roleStatus',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                Cell: DeleteCell({ isStatusTblMode }),
                disableSortBy: true,
            },
            {
                Header: '',
                accessor: 'shipmentDateToFilter',
                Filter: columnFilter(ddMmYearFormat(dayFilter)),
                disableFilters: false,
                Cell: '',
                disableSortBy: true,
                sortType: 'datetime',
            },
        ],
        [
            /* моды таблицы */
            tableModes, isSearchTblMode, isHistoryTblMode, isStatusTblMode,
            /* значение фильтров вне таблицы (должны быть все) */
            statusFilter, dayFilter, routeFilter, cargoFilter,
            /* допы */
            filteredRows, authCash, TABLE_CONTENT,
        ],
    )


    return (
        <div className={ styles.tableComponent + ' ' + styles['tableComponent__' + mode] }>
            <Table columns={ columns } data={ data } tableModes={ tableModes }/>
        </div>
    )
}
