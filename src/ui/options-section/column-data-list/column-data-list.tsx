import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {Button} from '../../common/button/button';
import {useNavigate} from 'react-router-dom';
import {parseCharsAndNumbers} from '../../../utils/parsers';


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
    const [test, setTest] = useState<string>('')

    const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
        setTest(parseCharsAndNumbers(event.target?.value))
    }

    useEffect(()=>{
        if (test !== '') {
            setContent(item.content.filter(({title})=>title.match(new RegExp(test,'ig'))))
        } else {
            setContent(item.content)
        }
    },[test, content])

    return (
        <div className={styles.columnDataList}>
            <header className={styles.columnDataList__header}>
                <span>{item.label}</span>
                <div className={styles.rowItem__label +' '+ styles.rowItem_search}>
                    <div className={styles.rowItem__searchIcon}><MaterialIcon icon_name={'search'}/></div>
                    <input placeholder={item.placeholder}
                           value={test}
                           onChange={onSearch}
                    />
                    <div className={styles.rowItem__clear}>
                        <Button colorMode={'white'}
                                disabled={!test}
                                title={'Очистить строку поиска'}
                                onClick={()=>{setTest('')}
                        }>
                            <MaterialIcon icon_name={'close'}/>
                        </Button>
                    </div>
                </div>
            </header>
            <div className={styles.columnDataList__list}>
                {content.map(({id, title}) =>
                    <div className={styles.columnDataList__item + ' ' + styles.rowItem}
                         onClick={() => {navigate(route + id)}}
                         key={item.label+id+title}
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
