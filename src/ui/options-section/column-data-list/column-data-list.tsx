import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './column-data-list.module.scss'
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {Button} from '../../common/button/button';
import {useNavigate} from 'react-router-dom';
import {parseCharsAndNumbers} from '../../../utils/parsers';
import {OptionsLabelType} from '../../../redux/options/options-store-reducer';
import {Modal} from 'antd';


type OwnProps = {
    item: {
        label: string,
        placeholder: string
        content: OptionsLabelType[]
        info?: string
    }
    route: string
}

export const ColumnDataList: React.FC<OwnProps> = ( { item, route } ) => {
    const navigate = useNavigate();

    const [ content, setContent ] = useState(item.content)
    const [ showModal, setShowModal ] = useState(false)

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
                { content.map(( { id, title } ) =>
                    <div className={ styles.columnDataList__item + ' ' + styles.rowItem }
                         onClick={ () => {
                             navigate(route + id)
                         } }
                         key={ item.label + id + title }
                    >
                        <div className={ styles.rowItem__label } title={ title }>
                            { title || 'null' }
                        </div>

                    </div>)
                }
            </div>
            <div className={ styles.columnDataList__button + ' ' + styles.columnDataList__button_left }>
                <Button onClick={ () => {
                    navigate(route + 'new')
                } }
                        title={ 'Добавить' }
                        rounded colorMode={ 'lightBlue' }>
                    <MaterialIcon icon_name={ 'add' }/></Button>
            </div>
            <div className={ styles.columnDataList__button + ' ' + styles.columnDataList__button_right }>
                <Button onClick={ () => {
                    setShowModal(true)
                } }
                        title={ 'Информация' }
                        rounded colorMode={ 'lightBlue' }>
                    <MaterialIcon icon_name={ 'question_mark' }/></Button>
                <Modal title={ 'Информация' }
                       visible={ showModal }
                       onOk={ () => {
                           setShowModal(false)
                       } }
                       onCancel={ () => {
                           setShowModal(false)
                       } }
                >
                    <p>{ item.info }</p>
                </Modal>
            </div>
        </div>
    )
}
