import React, {useEffect, useLayoutEffect} from 'react'
import styles from './table-section.module.scss'
import {Button} from '../common/button/button'
import {TableComponent} from './table-component/table-component'
import {useDispatch, useSelector} from 'react-redux'
import {filtersStoreActions, initialFiltersState} from '../../redux/table/filters-store-reducer'
import {
    getButtonsFiltersStore,
    getGlobalValueFiltersStore,
    getValuesFiltersStore,
} from '../../selectors/table/filters-reselect'
import {SelectTableFilter} from '../common/select-table-filter/select-table-filter'
import {getCargoTypeBaseStore} from '../../selectors/base-reselect'
import {cargoConstType} from '../../types/form-types'
import {InputTableFilter} from '../common/input-table-filter/input-table-filter'
import {Preloader} from '../common/preloader/preloader'
import {getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect'
import {getAllRequestsAPI} from '../../redux/forms/request-store-reducer'
import truckToRightPNG from '../../media/trackToRight.png'
import truckLoadPNG from '../../media/trackLoadFuel.png'
import truckToLeftPNG from '../../media/truckLeft.png'
import noRespTruckPNG from '../../media/noRespTrack.png'
import haveRespTrackPNG from '../../media/haveRespTrack.png'
import transparentPNG from '../../media/transparent32x32.png'

type OwnProps = {
    mode: 'search' | 'history' | 'status'
}
const icons = [ transparentPNG, truckToRightPNG, truckLoadPNG, truckToLeftPNG, noRespTruckPNG, haveRespTrackPNG ]
const statusValues = [ 'Газовоз', 'груз у водителя', 'груз у получателя', 'нет ответов', 'есть ответы' ]

export type TableModesType = { searchTblMode: boolean, historyTblMode: boolean, statusTblMode: boolean }

export const TableSection: React.FC<OwnProps> = ( { mode } ) => {

    const tableModes: TableModesType = {
        searchTblMode: mode === 'search',
        historyTblMode: mode === 'history',
        statusTblMode: mode === 'status',
    }

    const header = tableModes.searchTblMode ? 'Поиск ' : tableModes.historyTblMode ? 'История' : 'Заявки'
    const cargoTypes = useSelector(getCargoTypeBaseStore) as typeof cargoConstType
    const filterButtons = useSelector(getButtonsFiltersStore)
    const { cargoFilter, statusFilter } = useSelector(getValuesFiltersStore)
    const globalFilterValue = useSelector(getGlobalValueFiltersStore)
    const isFetchingTable = useSelector(getIsFetchingRequestStore)
    const dispatch = useDispatch()

    const filtersAction: Record<keyof typeof filterButtons, ( value?: string ) => void> = {
        todayFilter: () => {
            dispatch(filtersStoreActions.setTomorrowMode(false))
            dispatch(filtersStoreActions.setTodayMode(!filterButtons.todayFilter.mode))
            dispatch(filtersStoreActions.setTodayFilter())
        },
        tomorrowFilter: () => {
            dispatch(filtersStoreActions.setTodayMode(false))
            dispatch(filtersStoreActions.setTomorrowMode(!filterButtons.tomorrowFilter.mode))
            dispatch(filtersStoreActions.setTomorrowFilter())
        },
        shortRouteFilter: () => {
            dispatch(filtersStoreActions.setLongRouteMode(false))
            dispatch(filtersStoreActions.setShortRouteMode(!filterButtons.shortRouteFilter.mode))
            dispatch(filtersStoreActions.setShortRouteFilter())
        },
        longRouteFilter: () => {
            dispatch(filtersStoreActions.setShortRouteMode(false))
            dispatch(filtersStoreActions.setLongRouteMode(!filterButtons.longRouteFilter.mode))
            dispatch(filtersStoreActions.setLongRouteFilter())
        },
        globalFilter: ( value ) => {
            dispatch(filtersStoreActions.setGlobalFilter(value || ''))
        },
        statusFilter: ( value ) => {
            dispatch(filtersStoreActions.setStatusFilterValue(value || ''))
            dispatch(filtersStoreActions.setStatusFilterMode(value !== ''))
        },
        cargoFilter: ( value ) => {
            dispatch(filtersStoreActions.setCargoFilterValue(value || ''))
            dispatch(filtersStoreActions.setCargoFilterMode(value !== ''))
        },
        clearFilters: () => {
            dispatch(filtersStoreActions.setClearFilter(initialFiltersState))
        },
    }

    // подгружаем список заявок при переходе
    useLayoutEffect(() => {
        dispatch<any>(getAllRequestsAPI())
    }, [])

    useEffect(() => {
        dispatch(filtersStoreActions.setClearFilter(initialFiltersState))
    }, [ mode, dispatch ])

    useEffect(() => { // перекрашиваем кнопку "Без фильтра"
        // если любой из фильтров на кнопках активен
        let clearMode = !Object.entries(filterButtons)
            // кроме самой clearFilters
            .map(( [ key, { mode } ] ) => key === 'clearFilters' ? false : mode)
            // складываем логически все состояния кнопок
            .reduce(( a, b ) => a || b)
        // если состояния отличаются, то присваиваем
        if (clearMode !== filterButtons.clearFilters.mode) dispatch(filtersStoreActions.setClearFilterMode(clearMode))
    }, [ filterButtons, dispatch ])

    return (
        <section className={ styles.searchSection }>
            <header className={ styles.searchSection__header }>
                { isFetchingTable ? <Preloader/> : <h3>{ header }</h3> }
                <form className={ styles.searchSection__buttonFilters }>
                    { Object.entries(filterButtons).map(( [ key, value ] ) =>
                        <div key={ key } className={ styles.searchSection__buttonItem + ' ' +
                            ( value.mode ? styles.searchSection__buttonItem_active : '' ) }>
                            { key === 'cargoFilter'
                                ? <SelectTableFilter
                                    optionItems={ [ ...cargoTypes.filter(v => v !== 'Тягач') ] }
                                    selectedValue={ cargoFilter }
                                    titleValue={ value.title }
                                    onChange={ filtersAction[key] }
                                />
                                : key === 'statusFilter'
                                    ? tableModes.statusTblMode
                                        ? <SelectTableFilter
                                            optionItems={ statusValues }
                                            selectedValue={ statusFilter }
                                            titleValue={ value.title }
                                            onChange={ filtersAction[key] }
                                            iconsBgValue={ icons }
                                        /> : null
                                    : key === 'globalFilter'
                                        ? <InputTableFilter value={ globalFilterValue }
                                                     onChange={ filtersAction[key] }
                                        />
                                        : ( // убираем кнопки на разных типах
                                            ( key === 'todayFilter' || key === 'tomorrowFilter' ) && !tableModes.searchTblMode )
                                            ? null
                                            : <Button type={ ( key === 'clearFilters' ) ? 'reset' : 'button' }
                                                      title={ value.title }
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
                <TableComponent tableModes={ tableModes }/>
            </div>
        </section>
    )
}
