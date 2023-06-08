import React from 'react'
import styles from './info-button-to-modal.module.scss'

import {MaterialIcon} from '../../tiny/material-icon/material-icon'
import {ProjectButton} from '../../buttons/project-button/project-button'
import {useDispatch} from 'react-redux'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'


type OwnProps = {
    textToModal?: string | string[]
    mode?: 'out' | 'in' | 'inForm' | 'outClose' | 'invisible'
}


export const InfoButtonToModal: React.ComponentType<OwnProps> = ( { textToModal = '', mode = 'out' } ) => {

    const dispatch = useDispatch()

    const onClickButton = () => {
        dispatch<any>(textAndActionGlobalModal({
            text: textToModal,
        }))
    }

    return (
        <div className={ styles.infoButtonToModal + ' ' + styles['infoButtonToModal__' + mode] }>
            <ProjectButton onClick={ onClickButton }
                           title={ 'Информация' }
                           isSelectOnTab={ false }
                           rounded
                           colorMode={ 'lightBlue' }>
                <MaterialIcon icon_name={ 'question_mark' }/>
            </ProjectButton>
        </div>
    )
}
