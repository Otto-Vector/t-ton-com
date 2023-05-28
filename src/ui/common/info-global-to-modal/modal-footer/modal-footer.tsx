import React from 'react'
import styles from './modal-footer.module.scss'
import {Button} from '../../button/button'

type OwnProps = {
    onCancelHandle?: () => void,
    onOkHandle?: () => void,
    isCancelButtonEnable?: boolean
    isOkButtonEnable?: boolean
    // добавляем, когда пририсовываем футер через свой компонент
    isFooterPadding?: boolean
}

export const ModalFooter: React.FC<OwnProps> = (
    {
        onOkHandle,
        onCancelHandle,
        isOkButtonEnable = true,
        isCancelButtonEnable = false,
        isFooterPadding = false,
    } ) =>
    <footer className={ styles.modalFooter + ( isFooterPadding ? ' ' + styles.modalFooter_padding : '' ) }>
        { isCancelButtonEnable ?
            <div className={ styles.modalFooter__button }>
                <Button title={ 'Отмена' }
                        colorMode={ 'blueAlert' }
                        onClick={ onCancelHandle }
                />
            </div>
            : null }
        { isOkButtonEnable ?
            <div className={ styles.modalFooter__button }>
                <Button title={ 'Ok' }
                        colorMode={ 'blue' }
                        type={ 'submit' }
                        onClick={ onOkHandle }
                />
            </div>
            : null
        }
    </footer>
