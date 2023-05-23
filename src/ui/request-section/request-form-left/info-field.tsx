import React from 'react'
import styles from './request-form-left.module.scss'
import phoneImage from './../../../media/phone-small.svg'
import info_icon from './../../..//media/info_outline.svg'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {useDispatch} from 'react-redux'

type InfoProps = {
    textData?: string[],
    phoneData?: string[],
    // при осутствии другой инфы, используется как основной текст
    placeholder: string
    isMarked?: boolean
}

// окошко для отображения нередактирумеой инфы с телефоном и другими данными в модалку
export const InfoField: React.FC<InfoProps> = ( { textData, phoneData, placeholder, isMarked } ) => {
    const dispatch = useDispatch()
    // проверка на присутствие переменных и непустотность массива
    const isTextData = !!textData?.length
    const isPhoneData = !!phoneData?.length
    // преобразователь в строку и placeholder при отсутствии данных
    const textFromStrArrOrPlaceholder = isTextData ? textData.join(', ') : placeholder

    const modalActivator = ( text: string[] ) => {
        dispatch<any>(textAndActionGlobalModal({ text }))
    }

    return <>
        <div className={ styles.requestFormLeft__info + ' ' +
            ( isMarked ? styles.requestFormLeft__info_marked + ' ' : '' ) +
            styles.requestFormLeft__info_horizontalPadding + ' ' +
            // включаем вертикальную прокрутку, при большом количестве символов
            ( textFromStrArrOrPlaceholder.length > 100 ? styles.requestFormLeft__info_scrollable : '' ) }
            // вставляем напрямую, так как там могут быть теги <b>
             dangerouslySetInnerHTML={ { __html: `<p>${ textFromStrArrOrPlaceholder }</p>` } }
        />

        { isTextData &&
            <img src={ info_icon } alt={ 'info' }
                 className={ styles.requestFormLeft__icon + ' ' + styles.requestFormLeft__icon_info }
                 title={ 'Показать информацию' }
                 onClick={ () => {
                     modalActivator(textData)
                 } }
            /> }
        { isPhoneData &&
            <img
                className={ styles.requestFormLeft__icon + ' ' + styles.requestFormLeft__icon_phone }
                src={ phoneImage } alt={ 'phone' } title={ 'Показать телефон' }
                onClick={ () => {
                    modalActivator(phoneData)
                } }
            />
        }
    </>
}
