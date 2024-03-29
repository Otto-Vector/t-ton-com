import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/tiny/material-icon/material-icon'
import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {useNavigate} from 'react-router-dom'
import {parseCharsAndNumbers} from '../../../utils/parsers'
import {OptionsLabelType} from '../../../redux/options/options-store-reducer'
import {InfoButtonToModal} from '../../common/buttons/info-button-to-modal/info-button-to-modal'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {useSelector} from 'react-redux'
import {getStoredValuesRequisitesStore} from '../../../selectors/options/requisites-reselect'


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

export const ColumnDataList: React.ComponentType<OwnProps> = React.memo(( { item, route, isPlacemarked } ) => {
    const navigate = useNavigate()

    const { innNumber } = useSelector(getStoredValuesRequisitesStore)
    const [ content, setContent ] = useState(item.content)
    const [ test, setTest ] = useState<string>('')

    const onSearch = ( event: ChangeEvent<HTMLInputElement> ) => {
        setTest(parseCharsAndNumbers(event.target?.value))
    }
    // фильтрация поиска через useEffect
    useEffect(() => {
        if (test !== '') {
            setContent(item.content
                .filter(( { title, subTitle, extendInfo, moreDataForSearch } ) =>
                    [ title, subTitle, extendInfo, moreDataForSearch ].filter(x => x).join(' ')?.match(new RegExp(test, 'ig'))),
            )
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
                        <ProjectButton colorMode={ 'white' }
                                       disabled={ !test }
                                       title={ 'Очистить строку поиска' }
                                       onClick={ () => {
                                    setTest('')
                                }
                                }>
                            <MaterialIcon icon_name={ 'close' }/>
                        </ProjectButton>
                    </div>
                </div>
            </header>
            {/*ГЕНЕРИРУЕМЫЙ СПИСОК*/ }
            <div className={ styles.columnDataList__list }>
                { content.map(( { id, title, subTitle, extendInfo } ) => <div
                        className={ styles.columnDataList__item + ' ' + styles.rowItem }
                        onClick={ () => {
                            navigate(route + id)
                        } }
                        key={ item.label + id + title }
                    >
                        <div
                            className={ styles.rowItem__label + ' ' + (
                                !isPlacemarked ? '' :
                                    [
                                        // extendInfo не содержит ИНН
                                        subTitle && isNaN(+( extendInfo + '' )) && styles.rowItem__label_marked,
                                        // extendInfo совпадает с ИНН организации
                                        extendInfo === innNumber && styles.rowItem__label_markedMainInn,
                                        extendInfo === 'ожидает принятия' && styles.rowItem__label_markedAwait,
                                        extendInfo === 'на заявке' && styles.rowItem__label_markedOnRequest,
                                    ].filter(x => x).join(' ')
                            ) }
                            title={ title + ( subTitle ? ` [${ subTitle }]` : '' ) + ( extendInfo ? ' ' + extendInfo : '' ) }>
                            { title || 'null' }
                        </div>
                    </div>,
                ) }
            </div>
            {/*КНОПКА "+" СОЗДАТЬ */ }
            <div className={ styles.columnDataList__button + ' ' + styles.columnDataList__button_left }>
                <ProjectButton onClick={ () => {
                    navigate(route + 'new')
                } }
                               title={ 'Добавить' }
                               rounded colorMode={ 'lightBlue' }>
                    <MaterialIcon icon_name={ 'add' }/></ProjectButton>
            </div>
            {/*КНОПКА "?" ИНФО */ }
            <InfoButtonToModal textToModal={ item.info } mode={ 'in' }/>
        </div>
    )
}, valuesAreEqual)
