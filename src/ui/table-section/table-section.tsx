import React, {useEffect, useLayoutEffect} from 'react'
import styles from './table-section.module.scss'
import {TableComponent} from './table-component/table-component'
import {useDispatch, useSelector} from 'react-redux'
import {filtersStoreActions, initialFiltersState} from '../../redux/table/filters-store-reducer'
import {
    getHistoryFilterValuesFiltersStore,
    getHistoryhButtonsFiltersStore,
    getSearchButtonsFiltersStore,
    getSearchFilterValuesFiltersStore,
    getStatusButtonsFiltersStore,
    getStatusFilterValuesFiltersStore,
} from '../../selectors/table/filters-reselect'
import {getCargoTypeNoTrackBaseStore} from '../../selectors/base-reselect'
import {Preloader} from '../common/preloader/preloader'
import {getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect'
import {getAllRequestsAPI} from '../../redux/forms/request-store-reducer'
import truckToRightPNG from '../../media/trackToRight.png'
import truckLoadPNG from '../../media/trackLoadFuel.png'
import truckToLeftPNG from '../../media/truckLeft.png'
import noRespTruckPNG from '../../media/noRespTrack.png'
import haveRespTrackPNG from '../../media/haveRespTrack.png'
import xIcon from '../../media/x.png'

import {Button} from '../common/button/button'
import {InputTableFilter} from '../common/input-table-filter/input-table-filter'
import {TableFilterSelect} from './table-filter-select/table-filter-select'
import {SelectOptionsType} from '../common/form-selector/selector-utils'
import {TableModesBooleanType, TableModesType} from '../../types/form-types'

// toDo: перенести в отдельный элемент или файл
const icons = [ xIcon, truckToRightPNG, truckLoadPNG, truckToLeftPNG, noRespTruckPNG, haveRespTrackPNG ]
const statusStrValues = [ '', 'водитель выбран', 'груз у водителя', 'груз у получателя', 'нет ответов', 'есть ответы' ]
const statusValues = statusStrValues.map(( value, index ) => ( {
    value,
    label: value || 'без фильтра',
    key: value,
    subLabel: icons[index],
} ))


///////////////////////////////////////////////////////////////////////////////////////////////////////

type OwnProps = {
    mode: TableModesType
}

// секция для работы с фильтрами таблицы и отрисовки её самой
export const TableSection: React.ComponentType<OwnProps> = ( { mode } ) => {

    const tableModes: TableModesBooleanType = {
        isSearchTblMode: mode === 'search',
        isHistoryTblMode: mode === 'history',
        isStatusTblMode: mode === 'status',
    }
    const { isSearchTblMode, isHistoryTblMode, isStatusTblMode } = tableModes

    const header = isSearchTblMode ? 'Поиск ' : isHistoryTblMode ? 'История' : 'Заявки'
    const cargoTypes = useSelector(getCargoTypeNoTrackBaseStore)
    const filterButtons = useSelector(isSearchTblMode ? getSearchButtonsFiltersStore :
        isHistoryTblMode ? getHistoryhButtonsFiltersStore : getStatusButtonsFiltersStore)
    const filtersValue = useSelector(isSearchTblMode ? getSearchFilterValuesFiltersStore :
        isStatusTblMode ? getHistoryFilterValuesFiltersStore : getStatusFilterValuesFiltersStore)
    const isFetchingTable = useSelector(getIsFetchingRequestStore)
    const dispatch = useDispatch()

    const filtersAction: Record<keyof typeof filterButtons, ( value?: string ) => void> = {
        todayFilter: () => {
            dispatch(filtersStoreActions.setTomorrowMode(false, mode))
            dispatch(filtersStoreActions.setTodayMode(!filterButtons.todayFilter.mode, mode))
            dispatch(filtersStoreActions.setTodayFilter(mode))
        },
        tomorrowFilter: () => {
            dispatch(filtersStoreActions.setTodayMode(false, mode))
            dispatch(filtersStoreActions.setTomorrowMode(!filterButtons.tomorrowFilter.mode, mode))
            dispatch(filtersStoreActions.setTomorrowFilter(mode))
        },
        shortRouteFilter: () => {
            dispatch(filtersStoreActions.setLongRouteMode(false, mode))
            dispatch(filtersStoreActions.setShortRouteMode(!filterButtons.shortRouteFilter.mode, mode))
            dispatch(filtersStoreActions.setShortRouteFilter(mode))
        },
        longRouteFilter: () => {
            dispatch(filtersStoreActions.setShortRouteMode(false, mode))
            dispatch(filtersStoreActions.setLongRouteMode(!filterButtons.longRouteFilter.mode, mode))
            dispatch(filtersStoreActions.setLongRouteFilter(mode))
        },
        globalFilter: ( value ) => {
            dispatch(filtersStoreActions.setGlobalFilter(value || '', mode))
            dispatch(filtersStoreActions.setGlobalFilterMode(!!value, mode))
        },
        statusFilter: ( value ) => {
            dispatch(filtersStoreActions.setStatusFilterValue(value || '', mode))
            dispatch(filtersStoreActions.setStatusFilterMode(!!value, mode))
        },
        cargoFilter: ( value ) => {
            dispatch(filtersStoreActions.setCargoFilterValue(value || '', mode))
            dispatch(filtersStoreActions.setCargoFilterMode(!!value, mode))
        },
        clearFilters: () => {
            dispatch(filtersStoreActions.setClearFilter(initialFiltersState, mode))
        },
    }

    // подгружаем список заявок при переходе
    useLayoutEffect(() => {
        dispatch<any>(getAllRequestsAPI())
    }, [])

    // сброс фильтров при смене типа отображения и при первоначальной загрузке
    // useEffect(() => {
    // dispatch(filtersStoreActions.setClearFilter(initialFiltersState, mode))
    // }, [ mode ])

    useEffect(() => { // перекрашиваем кнопку "Без фильтра"
        // если любой из фильтров на кнопках активен
        const clearMode = !Object.entries(filterButtons)
            // кроме самой clearFilters
            .map(( [ key, { mode } ] ) => key === 'clearFilters' ? false : mode)
            // складываем логически все состояния кнопок
            .reduce(( a, b ) => a || b)
        // если состояния отличаются, то перекрашиваем кнопку "Без фильтра"
        if (clearMode !== filterButtons.clearFilters.mode) dispatch(filtersStoreActions.setClearFilterMode(clearMode, mode))
    }, [ filterButtons, mode ])

    // оптимизация данных 'Тип груза' под селектор
    const cargoValues: SelectOptionsType[] = [ {
        value: '',
        label: 'без фильтра',
        key: '',
        subLabel: xIcon,
    }, ...cargoTypes.map(value => ( { value, label: value, key: value } )) ]

    return (
        <section className={ styles.searchSection }>
            <header className={ styles.searchSection__header }>
                { isFetchingTable ? <Preloader/> : <h3>{ header }</h3> }
                <form className={ styles.searchSection__buttonFilters }>
                    { Object.entries(filterButtons).map(( [ key, value ] ) =>
                        <div key={ key } className={ styles.searchSection__buttonItem + ' ' +
                            // перекраска текста в красный
                            ( value.mode ? styles.searchSection__buttonItem_active : '' ) }>
                            { key === 'cargoFilter'
                                ?
                                <TableFilterSelect
                                    placeholder={ value.title }
                                    selectedValue={ filtersValue.cargoFilter }
                                    onChange={ filtersAction[key] }
                                    options={ cargoValues }
                                />
                                : key === 'statusFilter'
                                    ? isStatusTblMode
                                        ?
                                        <TableFilterSelect
                                            placeholder={ value.title }
                                            selectedValue={ filtersValue.statusFilter }
                                            onChange={ filtersAction[key] }
                                            options={ statusValues }
                                        />
                                        : null
                                    : key === 'globalFilter'
                                        ? <InputTableFilter value={ filtersValue.globalFilterValue }
                                                            onChange={ filtersAction[key] }
                                        />
                                        : ( // убираем кнопки на разных типах
                                            ( key === 'todayFilter' || key === 'tomorrowFilter' ) && !isSearchTblMode )
                                            ? null
                                            : <Button title={ value.title }
                                                      colorMode={ 'whiteBlue' }
                                                      rounded
                                                      onClick={ () => {
                                                          // @ts-ignore-next-line
                                                          filtersAction[key]()
                                                      } }
                                            /> }
                        </div>) }
                </form>
            </header>
            <div className={ styles.searchSection__table }>
                <TableComponent tableModes={ tableModes }
                                filters={ filtersValue }
                                mode={ mode }
                />
            </div>
        </section>
    )
}
