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
import {getAuthCashAuthStore} from '../../../selectors/auth-reselect'
import {TableModesType} from '../search-section'
import {ddMmYearFormat} from '../../../utils/date-formats';

type OwnProps = {
    tableModes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ( { tableModes } ) => {

    const navigate = useNavigate()
    const { balance, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = useSelector(getAuthCashAuthStore)
    const { dayFilter, routeFilter, cargoFilter } = useSelector(getValuesFiltersStore)
    // const initialValues = useSelector(geInitialValuesTableStore)
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

                Cell: ( { requestNumber, price }: { requestNumber: number, price: number } ) => {
                    if (tableModes.searchTblMode)
                        return <Button title={ 'Открыть' }
                                       onClick={ () => {
                                           price > authCash
                                               ? navigate(balance)
                                               : navigate(requestInfo.driver + requestNumber)
                                       } }
                                       colorMode={ price > authCash ? 'gray' : 'blue' }
                        />
                    if (tableModes.statusTblMode)
                        return <Button title={ 'Открыть' }
                                       onClick={ () => {
                                           navigate(maps.answers + requestNumber)
                                       } }
                                       colorMode={ 'green' }
                        />
                    if (tableModes.historyTblMode)
                        return <Button title={ 'Открыть' }
                                       onClick={ () => {
                                           navigate(requestInfo.history + requestNumber)
                                       } }
                                       colorMode={ 'pink' }/>
                },
            },
        ],
        [ tableModes, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT ],
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
