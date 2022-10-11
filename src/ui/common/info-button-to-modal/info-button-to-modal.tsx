import React, {useState} from 'react'
import styles from './info-button-to-modal.module.scss'
// import 'antd/lib/style/index.css' // используем core стили antd
// import 'antd/lib/modal/style/index.css' // используем стили antd для модальных инфоокон
// import 'antd/lib/button/style/index.css' // используем стили antd для кнопок
import {MaterialIcon} from '../material-icon/material-icon';
import {Button} from '../button/button';
import {Modal} from 'antd';

type OwnProps = {
    textToModal?: string
    textToGlobalModal?: string
    onCloseModal?: () => void
    mode?: 'out' | 'in' | 'inForm' | 'outClose' | 'invisible'
}


export const InfoButtonToModal: React.FC<OwnProps> = ( { textToGlobalModal, textToModal, onCloseModal, mode = 'out' } ) => {

    const isVisible = mode === 'invisible' ? !!textToModal : false
    const isGlobal = !!textToGlobalModal
    const [ visible, setVisible ] = useState(isVisible || isGlobal)

    const onCloseLocal = () => {
        setVisible(false)
        onCloseModal && onCloseModal()
    }

    return ( <div className={ styles.infoButtonToModal + ' ' + styles['infoButtonToModal__' + mode] }>
            <Button onClick={ () => {
                setVisible(true)
            } }
                    title={ 'Информация' }
                    rounded colorMode={ 'lightBlue' }>
                <MaterialIcon icon_name={ 'question_mark' }/></Button>
            <Modal title={ 'Информация' }
                   visible={ visible }
                   onOk={ onCloseLocal }
                   onCancel={ onCloseLocal }
            >
                <p>{ textToModal || textToGlobalModal}</p>
            </Modal>
        </div>
    )
}