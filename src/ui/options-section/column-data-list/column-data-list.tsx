import React from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';


type OwnProps = {}

export const ColumnDataList: React.FC<OwnProps> = () => {
    // const links = useSelector( getLinksStore )

    return (
        <div className={styles.columnDataList}>
            <header className={styles.columnDataList__header}>Грузоотправители:</header>
            <div className={styles.columnDataList__item + ' ' + styles.rowItem}>
                <div className={styles.rowItem__label}>Ромашка Бурятия</div>
                <div className={styles.rowItem__expand}></div>
            </div>
            <div className={styles.columnDataList__item + ' ' + styles.rowItem}>
                <div className={styles.rowItem__label}>Роза Америка</div>
                <div className={styles.rowItem__expand}></div>
            </div>
            <button className={styles.columnDataList__addItemButton}><MaterialIcon icon_name={'add'}/></button>
        </div>
    )
}
