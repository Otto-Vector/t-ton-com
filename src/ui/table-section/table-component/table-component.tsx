import React, {useMemo} from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {columnFilter} from './filter/column-filters'
import {useDispatch, useSelector} from 'react-redux'
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
import {OneRequestTableType, OneRequestTableTypeReq} from '../../../types/form-types'
import {toNumber} from '../../../utils/parsers'
import {LocalStatusCell} from './cells/local-status-cell'
import {Column} from 'react-table'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {ModalFormTextToDeleteResponse} from '../modal-form-text-to-delete-response/modal-form-text-to-delete-response'
import {initialFiltersState} from '../../../redux/table/filters-store-reducer'


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
    const { info, maps, requestInfo } = useSelector(getRoutesStore)
    const authCash = toNumber(useSelector(getCashRequisitesStore))
    const dispatch = useDispatch()

    const toGlobalModalQuest = useMemo(() => ( price: number ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: [
                'Не хватает средств (' + price + 'руб) для возможности просмотра и оставления отклика на заявку',
                '- "OK" для перехода к пополнению личного счёта',
            ],
            navigateOnOk: info,
        }))
    }, [ info, dispatch ])

    const onDeleteRequest = ( requestNumber: number ) => {
        dispatch<any>(textAndActionGlobalModal({
            title: 'Вопрос',
            reactChildren: <ModalFormTextToDeleteResponse requestNumber={ requestNumber }/>,
            isFooterVisible: false,
        }))
    }

    const TABLE_CONTENT = useSelector(
        searchTblMode ? getContentTableStoreNew
            : historyTblMode ? getContentTableStoreInHistory
                : getContentTableStoreInWork,
    )

    const data = useMemo(() => ( TABLE_CONTENT ), [ TABLE_CONTENT ])


    const columns: Column<OneRequestTableType>[] = useMemo(
        () => [
            {
                Header: TABLE_CONTENT.length || '',
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
            {
                Header: statusTblMode ? 'X' : '',
                accessor: 'roleStatus',
                // для корректной работы глобального фильтра
                Filter: columnFilter(),
                disableFilters: true,
                Cell: statusTblMode ? ( {
                                            roleStatus: { isCustomer = false },
                                            localStatus,
                                            requestNumber,
                                        }: OneRequestTableTypeReq ) =>
                        isCustomer && localStatus !== 'груз у получателя' && localStatus !== 'груз у водителя'
                            ? <div style={ { background: 'none' } }>
                                <Button colorMode={ 'redAlert' }
                                        onClick={ () => {
                                            onDeleteRequest(requestNumber)
                                        } }
                                ><MaterialIcon icon_name={ 'close' }/> </Button>
                            </div>
                            : <></>
                    : <></>,
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
            authCash, toGlobalModalQuest,
            TABLE_CONTENT,
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
