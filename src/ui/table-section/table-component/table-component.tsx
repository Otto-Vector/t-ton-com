import React from 'react'
import styles from './table-component.module.scss'

import {Table} from './table'
import {columnFilter} from './filter/column-filters'
import {getValuesFiltersStore} from '../../../selectors/table/filters-reselect'
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
import {OneRequestTableTypeReq} from '../../../types/form-types'
import {toNumber} from '../../../utils/parsers'
import {LocalStatusCell} from './cells/local-status-cell'


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
                Filter: columnFilter(statusFilter),
                disableFilters: false,
                Cell: statusTblMode ? LocalStatusCell : <></>,
            },
            {
                Header: '№',
                accessor: 'requestNumber',
                // для корректной работ
                // // для корректной работы глобального фильтраы глобального фильтра
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
        ],
        [ , searchTblMode, historyTblMode, statusTblMode, authCash, statusFilter, dayFilter, routeFilter, cargoFilter, TABLE_CONTENT,
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
