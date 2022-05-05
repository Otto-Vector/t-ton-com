import React from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {Button} from '../../common/button/button';
import {useNavigate, } from 'react-router-dom';


type OwnProps = {
    label: string,
    content: {id: number, title: string}[],
    route: string
}

export const ColumnDataList: React.FC<OwnProps> = ({label, content, route}) => {
    const navigate = useNavigate();

    return (
        <div className={styles.columnDataList}>
            <header className={styles.columnDataList__header}>{label}</header>
            {content.map(({id,title})=>
                <div className={styles.columnDataList__item + ' ' + styles.rowItem}
                     onClick={()=>{navigate(route+(id || 'new'))}}
                >
                    <div className={styles.rowItem__label+' '+ (id===0 ? styles.rowItem_gray: '')} title={title}>
                        {title || 'null'}
                    </div>

                <div className={styles.rowItem__expand+' '+(id===0 ? styles.rowItem__expand_plus: '')}></div>
                </div>)
            }

            <div className={styles.columnDataList__addItemButton}>
                <Button onClick={()=>{navigate(route+'new')}}
                        title={'Добавить'}
                        rounded colorMode={'white'}>
                    <MaterialIcon icon_name={'add'}/></Button>
            </div>
            {/*<button className={styles.columnDataList__addItemButton}><MaterialIcon icon_name={'add'}/></button>*/}
        </div>
    )
}
