import React, {useState} from 'react'
import styles from './search-section.module.scss'
import {Button} from '../common/button/button';
import {CargoType} from '../types/form-types';
import {addOneDay, dateFormat} from '../../utils/parsers';


type OwnProps = {

}

export const SearchSection: React.FC<OwnProps> = () => {

    const header = 'Поиск'

    const date = new Date()

    const filterButtons = {
        cargoFilter: {
            title: 'Тип груза',
            mode: false,
            // type: CargoType,
        },
        todayFilter: {
            date: date,
            title: 'Сегодня ' + dateFormat(date),
            mode: false,
        },
        tomorrowFilter: {
            date: addOneDay(date),
            title: 'Завтра ' + dateFormat(addOneDay(date)),
            mode: false,
        },
        shortRouteFilter: {
            title: 'Местные < 100',
            mode: false,
        },
        longRouteFilter: {
            title: 'Дальние > 100',
            mode: false,
        },
        nearDriverFilter: {
            title: 'Рядом с авто',
            mode: false,
        },
        clearFilters: {
            title: 'Без Фильтра',
            mode: true,
        },
    }

    const [fButtons, setFButtons]=useState(filterButtons)

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
                                }}
                        />
                        </div>
                    )
                    }
                </div>
            </header>
            <div className={styles.searchSection__table}>

            </div>
        </section>
    )
}
