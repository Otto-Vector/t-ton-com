import React, {useEffect} from 'react'
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
import {JustSelect} from '../common/just-select/just-select'
import {getCargoTypeBaseStore} from '../../selectors/base-reselect'
import {cargoConstType} from '../../types/form-types'
import {JustInput} from '../common/just-input/just-input'


type OwnProps = {
    mode: 'search' | 'history' | 'status'
}

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
    const { cargoFilter } = useSelector(getValuesFiltersStore)
    const globalFilterValue = useSelector(getGlobalValueFiltersStore)
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
        cargoFilter: ( value ) => {
            dispatch(filtersStoreActions.setCargoFilterValue(value || ''))
            dispatch(filtersStoreActions.setCargoFilterMode(value !== ''))
        },
        clearFilters: () => {
            dispatch(filtersStoreActions.setClearFilter(initialFiltersState))
        },
    }

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
                <h3>{ header }</h3>
                <form className={ styles.searchSection__buttonFilters }>
                    { Object.entries(filterButtons).map(( [ key, value ] ) =>
                        <div key={ key } className={ styles.searchSection__buttonItem + ' ' +
                            ( value.mode ? styles.searchSection__buttonItem_active : '' ) }>
                            {
                                key === 'cargoFilter'
                                    ? <JustSelect
                                        optionItems={ [ ...cargoTypes.filter(v => v !== 'Тягач') ] }
                                        selectedValue={ cargoFilter }
                                        titleValue={ value.title }
                                        onChange={ filtersAction[key] }
                                    />
                                    : key === 'globalFilter'
                                        ? <JustInput value={globalFilterValue} onChange={
                                            filtersAction[key]
                                        }/>
                                    :( // убираем кнопки на разных типах
                                        ( key === 'todayFilter' || key === 'tomorrowFilter' ) && tableModes.historyTblMode )
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
                        </div>,
                    )
                    }
                </form>
            </header>
            <div className={ styles.searchSection__table }>
                <TableComponent tableModes={ tableModes }/>
            </div>
        </section>
    )
}
