import React, {useState} from 'react'
import styles from './info-button-to-modal.module.scss'
import {MaterialIcon} from '../material-icon/material-icon';
import {Button} from '../button/button';
import {Modal} from 'antd';

type OwnProps = {
    textToModal?: string
    onCloseModal?: () => void
    mode?: 'out' | 'in'
}


export const InfoButtonToModal: React.FC<OwnProps> = ( { textToModal, onCloseModal, mode = 'out' } ) => {

    const [ visible, setVisible ] = useState(false)

    return ( <div className={ styles.infoButtonToModal + ' ' + styles['infoButtonToModal__' + mode] }>
            <Button onClick={ () => {
                setVisible(true)
            } }
                    title={ 'Информация' }
                    rounded colorMode={ 'lightBlue' }>
                <MaterialIcon icon_name={ 'question_mark' }/></Button>
            <Modal title={ 'Информация' }
                   visible={ visible }
                   onOk={ () => {
                       setVisible(false)
                   } }
                   onCancel={ () => {
                       setVisible(false)
                       onCloseModal && onCloseModal()
                   } }
            >
                <p>{ textToModal }</p>
            </Modal>
        </div>
    )
}