import React, {useEffect} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {ColumnInputFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {UseFiltersColumnProps} from 'react-table'
import {
    getContentTableStoreInHistory,
    getContentTableStoreInWork,
    getContentTableStoreNew,
} from '../../../selectors/table/table-reselect'
import {Button} from '../../common/button/button'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {TableModesType} from '../table-section'
import {ddMmYearFormat} from '../../../utils/date-formats'
import {getCashRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {OneRequestTableTypeReq} from '../../../types/form-types'
import truckPNG from '../../../media/trackToRight.png'
import truckLoadPNG from '../../../media/trackLoadFuel.png'
import truckLeftPNG from '../../../media/truckLeft.png'

type OwnProps = {
    tableModes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ( { tableModes } ) => {

    const navigate = useNavigate()
    const { info, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = +( useSelector(getCashRequisitesStore) || 0 )
    const { dayFilter, routeFilter, cargoFilter } = useSelector(getValuesFiltersStore)
    const dispatch = useDispatch()

    const toGlobalModalQuest = ( price: number ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: [
                'Не хватает средств (' + price + 'руб) для возможности просмотра и оставления отклика на заявку',
                '- "OK" для перехода к пополнению личного счёта',
            ],
            navigateOnOk: info,
        }))
    }

    const TABLE_CONTENT = useSelector(
        tableModes.searchTblMode ? getContentTableStoreNew
            : tableModes.historyTblMode ? getContentTableStoreInHistory
                : getContentTableStoreInWork,
    )

    const data = React.useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])

    const columns = React.useMemo(
        () => [
            {
                Header: '№',
                accessor: 'requestNumber',
                Filter: ColumnInputFilter,
                disableFilters: true,
                Cell: ( {
                            requestNumber,
                            localStatus: { cargoHasBeenReceived, cargoHasBeenTransferred },
                            globalStatus,
                        }: OneRequestTableTypeReq ) =>
                    <div className={styles.tableComponent__numberColumn}
                        style={ globalStatus === 'в работе' ? {
                        backgroundImage: `url(${
                            cargoHasBeenReceived ? truckLeftPNG
                                : cargoHasBeenTransferred ? truckLoadPNG : truckPNG
                        })`,
                        // backgroundRepeat: 'no-repeat',
                        // backgroundSize: '22px',
                        // backgroundPosition: 'left center',
                    } : undefined }
                         title={ globalStatus }
                    >{ requestNumber }</div>,
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
                Header: tableModes.statusTblMode ? 'На заявке' : 'Ответы',
                accessor: tableModes.statusTblMode ? 'responseEmployee' : 'answers',
                Filter: ColumnInputFilter,
                disableFilters: true,
            },
            {
                Header: '',
                accessor: 'price',
                Filter: ColumnInputFilter,
                disableFilters: true,
                // чтобы добавить быстрый доступ к нужным полям ищи метку #CellProps в table.tsx
                Cell: ( {
                            requestNumber,
                            price,
                            marked,
                            answers,
                        }: OneRequestTableTypeReq ) =>
                    <Button title={ 'Открыть' }
                            label={ 'Открыть ' + ( ( marked || !answers ) ? 'заявку' : 'карту с ответами перевозчиков' ) }
                            onClick={ () => {
                                if (tableModes.searchTblMode) {
                                    ( price > authCash )
                                        ? toGlobalModalQuest(price)
                                        : navigate(requestInfo.accept + requestNumber)
                                }
                                if (tableModes.statusTblMode) navigate(( ( marked || !answers ) ? requestInfo.status : maps.answers ) + requestNumber)
                                if (tableModes.historyTblMode) navigate(requestInfo.history + requestNumber)
                            } }
                            colorMode={
                                tableModes.searchTblMode ?
                                    price > authCash ? 'gray' : 'blue'
                                    : tableModes.statusTblMode ? ( answers === 0 || marked ) ? 'green' : 'orange'
                                        : tableModes.historyTblMode ? 'pink'
                                            : 'redAlert'
                            }
                    />,
            },
        ],
        [ tableModes, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT,
            maps.answers, navigate, requestInfo.status, requestInfo.history, requestInfo.accept ],
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
