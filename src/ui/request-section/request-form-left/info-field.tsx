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
}

// окошко для отображения нередактирумеой инфы с телефоном и другими данными в модалку
export const InfoField: React.FC<InfoProps> = ( { textData, phoneData, placeholder } ) => {
    const dispatch = useDispatch()

    // преобразователь в строку и placeholder при отсутствии данных
    const textDataToString = textData?.join(', ')
    const phoneDataToString = phoneData?.join(', ')
    const textFromStrArrOrPlaceholder = !!textDataToString ? textDataToString : placeholder
    const modalActivator = ( text: string[] ) => {
        dispatch<any>(textAndActionGlobalModal({ text }))
    }
    return <>
        <div className={ styles.requestFormLeft__info + ' ' +
            styles.requestFormLeft__info_horizontalPadding + ' ' +
            ( textFromStrArrOrPlaceholder.length > 100 ? styles.requestFormLeft__info_scrollable : '' ) }
             dangerouslySetInnerHTML={ { __html: `<p>${ textFromStrArrOrPlaceholder }</p>` } }>
            {/*{ removeAllHTMLTags(textFromStrArrOrPlaceholder) }*/ }
        </div>
        { !!textDataToString && textData &&
            <img src={ info_icon } alt={ 'info' }
                 className={ styles.requestFormLeft__icon + ' ' + styles.requestFormLeft__icon_info }
                 title={ 'Показать информацию' }
                 onClick={ () => {
                     modalActivator(textData)
                 } }
            /> }
        { !!phoneDataToString && phoneData &&
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
