import React from 'react'
import styles from './request-form-left.module.scss'
import phoneImage from './../../../media/phone-small.svg'
import info_icon from './../../..//media/info_outline.svg'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
import {useDispatch} from 'react-redux';

type InfoProps = {
    textData: string[],
    phoneData: string[],
    placeholder: string
}

export const InfoField: React.FC<InfoProps> = ( { textData, phoneData, placeholder } ) => {
    const dispatch = useDispatch()
    // преобразователь в строку и placeholder при отсутствии данных
    const textFromStrArrOrPlaceholder = ( str: string[] ) => str.join(', ') || 'Нет данных'
    const modalActivator = ( text: string[] ) => {
        dispatch(globalModalStoreActions.setTextMessage(text))
    }
    return <>
        <div className={ styles.requestFormLeft__info + ' ' +
            styles.requestFormLeft__info_horizontalPadding }>
            { placeholder || textFromStrArrOrPlaceholder(textData) }
        </div>
        { !placeholder ? <>
            <img
                className={ styles.requestFormLeft__icon + ' ' + styles.requestFormLeft__icon_phone }
                src={ phoneImage } alt={ 'phone' } title={ 'Показать телефон' }
                onClick={ () => {
                    modalActivator(phoneData)
                } }
            />
            <img src={ info_icon } alt={ 'info' }
                 className={ styles.requestFormLeft__icon + ' ' + styles.requestFormLeft__icon_info }
                 title={ 'Показать информацию' }
                 onClick={ () => {
                     modalActivator(textData)
                 } }
            />
        </> : null}
    </>
}