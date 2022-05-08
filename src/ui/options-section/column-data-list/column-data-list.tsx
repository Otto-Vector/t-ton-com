import React, {ChangeEvent, useState} from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {Button} from '../../common/button/button';
import {useNavigate} from 'react-router-dom';


type OwnProps = {
    item: {
        label: string,
        placeholder: string
        content: { id: number, title: string }[]
    }
    route: string
}

export const ColumnDataList: React.FC<OwnProps> = ({item, route}) => {
    const navigate = useNavigate();

    const [content, setContent] = useState(item.content)

    const onSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        event.target?.value
            ? setContent(item.content.filter(({title})=>title.includes(event.target?.value)))
            : setContent(item.content)
    }

    return (
        <div className={styles.columnDataList}>
            <header className={styles.columnDataList__header}>
                <span>{item.label}</span>
                <div className={styles.rowItem__label +' '+ styles.rowItem_search}>
                    <input placeholder={item.placeholder} onChange={(e)=>{onSearch(e)}}/>
                </div>
            </header>
            <div className={styles.columnDataList__list}>
                {content.map(({id, title}) =>
                    <div className={styles.columnDataList__item + ' ' + styles.rowItem}
                         onClick={() => {
                             navigate(route + id)
                         }}
                    >
                        <div className={styles.rowItem__label} title={title}>
                            {title || 'null'}
                        </div>

                        {/*<div className={styles.rowItem__expand+' '+(id===0 ? styles.rowItem__expand_plus: '')}></div>*/}
                    </div>)
                }
            </div>
            <div className={styles.columnDataList__addItemButton}>
                <Button onClick={() => {
                    navigate(route + 'new')
                }}
                        title={'Добавить'}
                        rounded colorMode={'lightBlue'}>
                    <MaterialIcon icon_name={'add'}/></Button>
            </div>
            {/*<button className={styles.columnDataList__addItemButton}><MaterialIcon icon_name={'add'}/></button>*/}
        </div>
    )
}
