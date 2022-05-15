import React, {useEffect, useState} from 'react'
import styles from './search-section.module.scss'
import {Button} from '../common/button/button';
import {addOneDay, dateFormat} from '../../utils/parsers';
import {TableComponent} from './table-component/table-component';
import {useDispatch} from 'react-redux'
import {filtersStoreActions, initialFiltersState} from '../../redux/table/filters-store-reducer'


type OwnProps = {

}

export const SearchSection: React.FC<OwnProps> = () => {

    const header = 'Поиск'
    const dispatch = useDispatch()

    const date = new Date()

    const filters = {
        changeToday: ( mode: boolean ) => {
            dispatch(
                filtersStoreActions.setTodayFilter(
                    mode ? date.toLocaleDateString() : '' )
            )
        },
        changeTomorrow: ( mode: boolean ) => {
            dispatch(
                filtersStoreActions.setTomorrowFilter(
                    mode ? addOneDay(date).toLocaleDateString() : '' )
            )
        },
        clearFilters: ()=> {
            setFButtons(filterButtons)
            dispatch(filtersStoreActions.setClearFilter(initialFiltersState))
        }

    }

    const filterButtons = {
        cargoFilter: {
            title: 'Тип груза',
            mode: false,
            onClick: ()=>{},
            // type: CargoType,
        },
        todayFilter: {
            date: date,
            title: 'Сегодня ' + dateFormat(date),
            mode: false,
            onClick: filters.changeToday,
        },
        tomorrowFilter: {
            date: addOneDay(date),
            title: 'Завтра ' + dateFormat(addOneDay(date)),
            mode: false,
            onClick:filters.changeTomorrow,
        },
        shortRouteFilter: {
            title: 'Местные < 100',
            mode: false,
            onClick: ()=>{},
        },
        longRouteFilter: {
            title: 'Дальние > 100',
            mode: false,
            onClick: ()=>{},
        },
        nearDriverFilter: {
            title: 'Рядом с авто',
            mode: false,
            onClick: ()=>{},
        },
        clearFilters: {
            title: 'Без Фильтра',
            mode: true,
            onClick: filters.clearFilters,
        },
    }

    const [fButtons, setFButtons]=useState(filterButtons)

    useEffect(()=> {

    })

    return (
        <section className={styles.searchSection}>
            <header className={styles.searchSection__header}>
                <h3>{header}</h3>
                <div className={styles.searchSection__buttonFilters}>
                    {Object.entries(fButtons).map(([key, value]) =>
                        <div key={key} className={styles.searchSection__buttonItem +' '+
                            (!!value.mode ? styles.searchSection__buttonItem_active:'')}>
                            <Button type={'button'}
                                title={value.title}
                                colorMode={'whiteBlue'}
                                rounded
                                onClick={() => {
                                    setFButtons({...fButtons, [key]: {...value, mode: !value.mode} })
                                    value.onClick(!value.mode)
                                }}
                        />
                        </div>
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
