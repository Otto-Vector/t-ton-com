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
import truckToRightPNG from '../../../media/trackToRight.png'
import truckLoadPNG from '../../../media/trackLoadFuel.png'
import truckToLeftPNG from '../../../media/truckLeft.png'
import noRespTruckPNG from '../../../media/noRespTrack.png'
import haveRespTrackPNG from '../../../media/haveRespTrack.png'
import transparentPNG from '../../../media/transparent32x32.png'
import {toNumber} from '../../../utils/parsers'


type OwnProps = {
    tableModes: TableModesType
}


export const TableComponent: React.FC<OwnProps> = ( { tableModes } ) => {

    const {
        historyTblMode,
        searchTblMode,
        statusTblMode,
    } = tableModes
    const navigate = useNavigate()
    const { info, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = toNumber(useSelector(getCashRequisitesStore))
    const { dayFilter, routeFilter, cargoFilter, statusFilter } = useSelector(getValuesFiltersStore)
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
        searchTblMode ? getContentTableStoreNew
            : historyTblMode ? getContentTableStoreInHistory
                : getContentTableStoreInWork,
    )

    const data = React.useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])

    const columns = React.useMemo(
        () => [
            {
                Header: '',
                accessor: 'localStatus',
                Filter: ( { column }: { column?: UseFiltersColumnProps<{}> } ) => {
                    useEffect(() => {
                        column?.setFilter(statusFilter)
                    }, [ column ])
                    return ( <></> )
                },
                disableFilters: false,
                Cell: ( { localStatus }: OneRequestTableTypeReq ) => statusTblMode ?
                    <img className={ styles.tableComponent__statusImage }
                         alt={ 'status_icon' }
                         title={ localStatus }
                         src={
                             localStatus === 'груз у получателя' ? truckToLeftPNG
                                 : localStatus === 'груз у водителя' ? truckLoadPNG
                                     : localStatus === 'водитель выбран' ? truckToRightPNG
                                         : localStatus === 'нет ответов' ? noRespTruckPNG
                                             : localStatus === 'есть ответы' ? haveRespTrackPNG
                                                 : transparentPNG
                         }
                        // добавим прозрачность на неотвеченные заявки
                         style={ localStatus === 'нет ответов' ? { opacity: .5 }
                             : localStatus === 'есть ответы' ? { // чёрный в Chocolate. Источник https://isotropic.co/tool/hex-color-to-css-filter/
                                 filter: 'invert(42%) sepia(64%) saturate(622%) hue-rotate(343deg) brightness(99%) contrast(95%)',
                             } : undefined
                         }
                    /> : null,
            },
            {
                Header: '№',
                accessor: 'requestNumber',
                Filter: ColumnInputFilter,
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
                Header: statusTblMode ? 'На заявке' : 'Ответы',
                accessor: !searchTblMode ? 'responseEmployee' : 'answers',
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
                                if (searchTblMode) {
                                    ( price > authCash )
                                        ? toGlobalModalQuest(price)
                                        : navigate(requestInfo.accept + requestNumber)
                                }
                                if (statusTblMode) navigate(( ( marked || !answers ) ? requestInfo.status : maps.answers ) + requestNumber)
                                if (historyTblMode) navigate(requestInfo.history + requestNumber)
                            } }
                            colorMode={
                                searchTblMode ?
                                    price > authCash ? 'gray' : 'blue'
                                    : statusTblMode ? ( answers === 0 || marked ) ? 'green' : 'orange'
                                        : historyTblMode ? 'pink'
                                            : 'redAlert'
                            }
                    />,
            },
        ],
        [ searchTblMode, historyTblMode, statusTblMode, authCash, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT,
            maps.answers, navigate, requestInfo.status, requestInfo.history, requestInfo.accept ],
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
