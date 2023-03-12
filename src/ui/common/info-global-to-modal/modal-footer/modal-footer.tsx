import React from 'react'
import styles from './modal-footer.module.scss'
import {Button} from '../../button/button'

type OwnProps = {
    onCancelHandle?: () => void,
    onOkHandle?: () => void,
    isCancelButtonEnable?: boolean
}

export const ModalFooter = (
    {
        onOkHandle,
        onCancelHandle,
        isCancelButtonEnable = false,
    }: OwnProps ): React.ReactNode =>
    <footer className={ styles.modalFooter }>
        { isCancelButtonEnable ?
            <div className={ styles.modalFooter__button }>
                <Button title={ 'Отмена' }
                        colorMode={ 'blueAlert' }
                        onClick={ onCancelHandle }
                />
            </div>
            : null }
        <div className={ styles.modalFooter__button }>
            <Button title={ 'Ok' }
                    colorMode={ 'blue' }
                    onClick={ onOkHandle }
            />
        </div>
    </footer>
