import React, {useEffect} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table'
import {getContentTableStore} from '../../../selectors/table/table-reselect'
import {CancelButton} from '../../options-section/common-forms/cancel-button/cancel-button'
import {Button} from '../../common/button/button'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {tableStoreActions} from '../../../redux/table/table-store-reducer'
import {getAuthCashAuthStore} from '../../../selectors/auth-reselect'
import {TableModesType} from '../search-section'

type OwnProps = {
    modes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ({modes}) => {
    const navigate = useNavigate()
    const { search, balance } = useSelector( getRoutesStore )
    const authCash = useSelector( getAuthCashAuthStore )
    const { dayFilter, routeFilter, cargoFilter } = useSelector( getValuesFiltersStore )
    const TABLE_CONTENT = useSelector( getContentTableStore )
    const dispatch = useDispatch()

    const deleteRow = ( requestNumber: number ) => {
        dispatch( tableStoreActions.deleteRow( requestNumber ) )
    }

    const data = React.useMemo( () => ( TABLE_CONTENT ), [ TABLE_CONTENT ] )

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
                    useEffect( () => {
                        column?.setFilter( cargoFilter )
                    }, [] )
                    return ( <></> )
                },

                // disableFilters: true,
            },
            {
                Header: 'Дата',
                accessor: 'requestDate',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect( () => {
                        column.setFilter( dayFilter )
                    }, [] )
                    return ( <></> )
                },
                disableFilters: false,
            },
            {
                Header: 'Расстояние',
                accessor: 'distance',
                Filter: ( { column }: { column: UseFiltersColumnProps<{}> } ) => {
                    useEffect( () => {
                        column.setFilter( routeFilter )
                    }, [] )
                    return ( <></> )
                },
                disableFilters: false,
                filter: 'between',
                Cell: ({value}:{value: number})=>`${value} км`
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
                Cell: ( { requestNumber, price }: { requestNumber: number, price: number } ) => (
                    <Button title={ 'Открыть' }
                            onClick={ () => {
                                price > authCash
                                ? navigate( balance  )
                                : navigate( search + '/' + requestNumber )
                            }}
                            colorMode={ price > authCash ? 'gray' : 'blue' }
                    />
                )
            },
            {
                Header: '',
                id: 'close',
                accessor: 'close',

                disableFilters: true,
                Cell: ( { requestNumber }: { requestNumber: number } ) => (
                    modes.history ? null :
                    <CancelButton onCancelClick={ () => deleteRow( requestNumber ) } mode={ 'redAlert' } noAbsolute/>
                )
            },
        ],
        [ modes, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT ],
    )


    return (
        <div className={ styles.tableComponent }>
            <Table columns={ columns } data={ data }/>
        </div>
    )
}
