import React, {useEffect} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table'
import {geInitialValuesTableStore, getContentTableStore} from '../../../selectors/table/table-reselect'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {Button} from '../../common/button/button'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {tableStoreActions} from '../../../redux/table/table-store-reducer'
import {getAuthCashAuthStore} from '../../../selectors/auth-reselect'
import {TableModesType} from '../search-section'
import {ddMmYearFormat} from '../../../utils/parsers';
import {requestStoreActions} from '../../../redux/forms/request-store-reducer'

type OwnProps = {
    tableModes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ( { tableModes } ) => {

    const navigate = useNavigate()
    const { balance, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = useSelector(getAuthCashAuthStore)
    const { dayFilter, routeFilter, cargoFilter } = useSelector(getValuesFiltersStore)
    const initialValues = useSelector(geInitialValuesTableStore)
    const TABLE_CONTENT = useSelector(getContentTableStore)
    const dispatch = useDispatch()

    const deleteRow = ( requestNumber: number ) => {
        // dispatch(tableStoreActions.deleteRow(requestNumber))
        dispatch(requestStoreActions.setToggleRequestVisible(requestNumber))

    }

    const data = React.useMemo(() => ( TABLE_CONTENT || initialValues ), [ TABLE_CONTENT ])

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
                    }, [])
                    return ( <></> )
                },

                // disableFilters: true,
            },
            {
                Header: 'Дата',
                accessor: 'shipmentDate',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column.setFilter(dayFilter)
                    }, [])
                    return ( <></> )
                },
                disableFilters: false,
                Cell: ( { value }: { value: Date } ) => ddMmYearFormat(value),
            },
            {
                Header: 'Расстояние',
                accessor: 'distance',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column.setFilter(routeFilter)
                    }, [])
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
                // id: 'open',
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
            {
                Header: '',
                id: 'close',
                accessor: 'close',

                disableFilters: true,
                Cell: ( { requestNumber }: { requestNumber: number } ) => (
                    tableModes.historyTblMode ? null :
                        <CancelButton onCancelClick={ () => deleteRow(requestNumber) } mode={ 'redAlert' } noAbsolute/>
                ),
            },
        ],
        [ tableModes, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT ],
    )

    return (
        <div className={ styles.tableComponent }>
            <Table columns={ columns } data={ data }/>
        </div>
    )
}
