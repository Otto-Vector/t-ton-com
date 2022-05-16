import React, {useEffect} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table';
import {getContentTableStore} from '../../../selectors/table/table-reselect';


export const TableComponent: React.FC = () => {

    const {dayFilter, routeFilter, cargoFilter} = useSelector(getValuesFiltersStore)

    const columns = React.useMemo(
        () => [
            {
                Header: '№',
                accessor: 'requestNumber',
                disableFilters: true,
            },
            {
                Header: 'Тип груза',
                accessor: 'cargoType',
                Filter: ({column}: { column: UseFiltersColumnProps<{}> }) => {
                    useEffect(() => {
                        column.setFilter(cargoFilter)
                    }, [])
                },
            },
            {
                Header: 'Дата',
                accessor: 'requestDate',
                Filter: ({column}: { column: UseFiltersColumnProps<{}> }) => {
                    useEffect(() => {
                        column.setFilter(dayFilter)
                    }, [])
                },
            },
            {
                Header: 'Расстояние (км)',
                accessor: 'distance',
                Filter: ({column}: { column: UseFiltersColumnProps<{}> }) => {
                    useEffect(() => {
                        column.setFilter(routeFilter)
                    }, [])
                },
                filter: 'between',
            },
            {
                Header: 'Маршрут',
                accessor: 'route',
                Filter: ColumnInputFilter,
                disableFilters: true,
            },
            {
                Header: 'Ответы',
                accessor: 'answers',
                Filter: ColumnInputFilter,
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'open',
                Filter: () => {
                },
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'close',
                Filter: () => {
                },
                disableFilters: true,
            },
        ],
        [dayFilter, routeFilter, cargoFilter],
    )

    const TABLE_CONTENT = useSelector(getContentTableStore)
    const data = React.useMemo(() => (TABLE_CONTENT), [TABLE_CONTENT])

    return (
        <div className={styles.tableComponent}>
            <Table columns={columns} data={data}/>
            {/*<AppTable/>*/}
        </div>
    )
}
