import React, {useEffect} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table'
import {getContentTableStore} from '../../../selectors/table/table-reselect'
import {Button} from '../../common/button/button'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {TableModesType} from '../search-section'
import {ddMmYearFormat} from '../../../utils/date-formats';
import {getCashRequisitesStore} from '../../../selectors/options/requisites-reselect';

type OwnProps = {
    tableModes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ( { tableModes } ) => {

    const navigate = useNavigate()
    const { balance, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = +( useSelector(getCashRequisitesStore) || 0 )
    const { dayFilter, routeFilter, cargoFilter } = useSelector(getValuesFiltersStore)

    const TABLE_CONTENT = useSelector(getContentTableStore)

    const data = React.useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])

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
                Filter: ( { column }: { column?: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column?.setFilter(cargoFilter)
                    }, [ column ])
                    return ( <></> )
                },
                disableFilters: false,
            },
            {
                Header: 'Дата',
                accessor: 'shipmentDate',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column.setFilter(ddMmYearFormat(dayFilter))
                    }, [ column ])
                    return ( <></> )
                },
                disableFilters: false,
            },
            {
                Header: 'Расстояние',
                accessor: 'distance',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column.setFilter(routeFilter)
                    }, [ column ])
                    return ( <></> )
                },
                disableFilters: false,
                filter: 'between',
                Cell: ( { value }: { value: number } ) => `${ value } км`,
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
                accessor: 'price',
                disableFilters: true,
                Cell: ( { requestNumber, price }: { requestNumber: number, price: number } ) =>
                    <Button title={ 'Открыть' }
                            onClick={ () => {
                                if (tableModes.searchTblMode) navigate(price > authCash ? balance : requestInfo.accept + requestNumber)
                                if (tableModes.statusTblMode) navigate(maps.answers + requestNumber)
                                if (tableModes.historyTblMode) navigate(requestInfo.history + requestNumber)
                            } }
                            colorMode={
                                tableModes.searchTblMode ?
                                    price > authCash ? 'gray' : 'blue'
                                    : tableModes.statusTblMode ? 'green'
                                        : tableModes.historyTblMode ? 'pink'
                                            : 'redAlert'
                            }
                    />,
            },
        ],
        [ tableModes, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT,
            balance, maps.answers, navigate, requestInfo.driver, requestInfo.history ],
    )
    const tableModesStyle = styles['tableComponent__' + (
        tableModes.searchTblMode ? 'search'
            : tableModes.historyTblMode
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
