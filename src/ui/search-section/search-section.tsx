import React, {useEffect} from 'react'
import styles from './search-section.module.scss'
import {Button} from '../common/button/button';
import {TableComponent} from './table-component/table-component';
import {useDispatch, useSelector} from 'react-redux'
import {
    filtersStoreActions,
    initialFiltersState,
} from '../../redux/table/filters-store-reducer'
import {getButtonsFiltersStore} from '../../selectors/table/filters-reselect';


type OwnProps = {}

export const SearchSection: React.FC<OwnProps> = () => {

    const header = 'Поиск'
    const filterButtons = useSelector(getButtonsFiltersStore)
    const dispatch = useDispatch()

    const filtersAction: Record<keyof typeof filterButtons, () => void> = {
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
        nearDriverFilter: () => {
            dispatch(filtersStoreActions.setLongRouteMode(false))
            dispatch(filtersStoreActions.setShortRouteMode(false))
            dispatch(filtersStoreActions.setLongRouteFilter())
            dispatch(filtersStoreActions.setNearDriverMode(!filterButtons.nearDriverFilter.mode))
        },
        cargoFilter: () => {
            console.log('cargo')
        },
        clearFilters: () => {
            dispatch(filtersStoreActions.setClearFilter(initialFiltersState))
        },
    }

    useEffect(() => { // перекрашиваем кнопку "Без фильтра"
        // если любой из фильтров на кнопках активен
        let clearMode = Object.entries(filterButtons)
            // кроме самой clearFilters
            .map(([key, {mode}]) => key === 'clearFilters' ? false : mode)
            // складываем логически все состояния кнопок
            .reduce((a, b) => a || b)
            if (clearMode === filterButtons.clearFilters.mode) dispatch(filtersStoreActions.setClearFilterMode(!clearMode))
    }, [filterButtons])

    return (
        <section className={styles.searchSection}>
            <header className={styles.searchSection__header}>
                <h3>{header}</h3>
                <div className={styles.searchSection__buttonFilters}>
                    {Object.entries(filterButtons).map(([key, value]) =>
                        <div key={key} className={styles.searchSection__buttonItem + ' ' +
                            (!!value.mode ? styles.searchSection__buttonItem_active : '')}>
                            <Button type={'button'}
                                    title={value.title}
                                    colorMode={'whiteBlue'}
                                    rounded
                                    onClick={() => {
                                        // @ts-ignore
                                        filtersAction[key]()
                                    }}
                            />
                        </div>,
                    )
                    }
                </div>
            </header>
            <div className={styles.searchSection__table}>
                <TableComponent/>
            </div>
        </section>
    )
}
