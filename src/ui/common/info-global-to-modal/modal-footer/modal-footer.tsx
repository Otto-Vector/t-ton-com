import React from 'react'
import styles from './modal-footer.module.scss'
import {Button} from '../../button/button'

type OwnProps = {
    onCancelHandle?: () => void,
    onOkHandle?: () => void,
    isCancelButtonEnable?: boolean
    isOkButtonEnable?: boolean
}

export const ModalFooter: React.FC<OwnProps> = (
    {
        onOkHandle,
        onCancelHandle,
        isOkButtonEnable = true,
        isCancelButtonEnable = false,
    } ) =>
    <footer className={ styles.modalFooter }>
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
                        onClick={ onOkHandle }
                />
            </div>
            : null
        }
    </footer>
