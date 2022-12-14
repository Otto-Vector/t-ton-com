import React from 'react'
import styles from './info-button-to-modal.module.scss'

import {MaterialIcon} from '../material-icon/material-icon';
import {Button} from '../button/button';
import {useDispatch} from 'react-redux';
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';


type OwnProps = {
    textToModal?: string | string[]
    mode?: 'out' | 'in' | 'inForm' | 'outClose' | 'invisible'
}


export const InfoButtonToModal: React.FC<OwnProps> = ( { textToModal = '', mode = 'out' } ) => {

    const dispatch = useDispatch()

    const onClickButton = () => {
        dispatch(globalModalStoreActions.setTextMessage(textToModal))
    }

    return (
        <div className={ styles.infoButtonToModal + ' ' + styles['infoButtonToModal__' + mode] }>
            <Button onClick={ onClickButton }
                    title={ 'Информация' }
                    isSelectOnTab={ false }
                    rounded
                    colorMode={ 'lightBlue' }>
                <MaterialIcon icon_name={ 'question_mark' }/>
            </Button>
        </div>
    )
}