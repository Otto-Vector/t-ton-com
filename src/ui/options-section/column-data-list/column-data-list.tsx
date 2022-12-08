import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {Button} from '../../common/button/button';
import {useNavigate} from 'react-router-dom';
import {parseCharsAndNumbers} from '../../../utils/parsers';
import {OptionsLabelType} from '../../../redux/options/options-store-reducer';
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';


type OwnProps = {
    item: {
        label: string,
        placeholder: string
        content: OptionsLabelType[]
        info?: string
    }
    route: string
    isPlacemarked?: boolean
}

export const ColumnDataList: React.FC<OwnProps> = React.memo(( { item, route, isPlacemarked } ) => {
    const navigate = useNavigate();

    const [ content, setContent ] = useState(item.content)
    const [ test, setTest ] = useState<string>('')


    const onSearch = ( event: ChangeEvent<HTMLInputElement> ) => {
        setTest(parseCharsAndNumbers(event.target?.value))
    }

    useEffect(() => {
        if (test !== '') {
            setContent(item.content.filter(( { title } ) => title?.match(new RegExp(test, 'ig'))))
        }
        if (test === '') setContent(item.content)

    }, [ test ])

    return (
        <div className={ styles.columnDataList }>
            <header className={ styles.columnDataList__header }>
                <span>{ item.label }</span>
                {/*БЛОК ВВОДА ПОИСКА*/ }
                <div className={ styles.rowItem__label + ' ' + styles.rowItem_search }>
                    <div className={ styles.rowItem__searchIcon }><MaterialIcon icon_name={ 'search' }/></div>
                    <input className={ styles.rowItem__input }
                           placeholder={ item.placeholder }
                           value={ test }
                           onChange={ onSearch }
                    />
                    {/*КНОПКА СБРОСА*/ }
                    <div className={ styles.rowItem__clear }>
                        <Button colorMode={ 'white' }
                                disabled={ !test }
                                title={ 'Очистить строку поиска' }
                                onClick={ () => {
                                    setTest('')
                                }
                                }>
                            <MaterialIcon icon_name={ 'close' }/>
                        </Button>
                    </div>
                </div>
            </header>
            {/*ГЕНЕРИРУЕМЫЙ СПИСОК*/ }
            <div className={ styles.columnDataList__list }>
                { content.map(( { id, title, subTitle, extendInfo } ) =>
                    <div className={ styles.columnDataList__item + ' ' + styles.rowItem }
                         onClick={ () => {
                             navigate(route + id)
                         } }
                         key={ item.label + id + title }
                    >
                        <div
                            className={ styles.rowItem__label +
                                ( ( isPlacemarked && subTitle ) ? ' ' + styles.rowItem__label_marked : '' )+
                                (( isPlacemarked && extendInfo==="ожидает принятия" ) ? ' ' + styles.rowItem__label_markedAwait : '' )+
                                (( isPlacemarked && extendInfo==="на заявке" ) ? ' ' + styles.rowItem__label_markedOnRequest : '' )
                        }
                            title={ title + ( subTitle ? ` [${ subTitle }]` : '' )+' '+extendInfo }>
                            { title || 'null' }
                        </div>
                    </div>)
                }
            </div>
            {/*КНОПКА "+" СОЗДАТЬ */ }
            <div className={ styles.columnDataList__button + ' ' + styles.columnDataList__button_left }>
                <Button onClick={ () => {
                    navigate(route + 'new')
                } }
                        title={ 'Добавить' }
                        rounded colorMode={ 'lightBlue' }>
                    <MaterialIcon icon_name={ 'add' }/></Button>
            </div>
            {/*КНОПКА "?" ИНФО */ }
            <InfoButtonToModal textToModal={ item.info } mode={ 'in' }/>
        </div>
    )
}, valuesAreEqual)
