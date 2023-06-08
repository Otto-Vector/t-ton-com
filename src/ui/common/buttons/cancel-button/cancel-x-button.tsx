import React from 'react'
import styles from './cancel-button.module.scss'
import {ProjectButton} from '../project-button/project-button'
import {MaterialIcon} from '../../tiny/material-icon/material-icon'

type OwnProps = {
    onCancelClick: () => void
    noAbsolute?: boolean
    mode?: 'redAlert' | 'white' | 'blueAlert' | 'noFill'
    isNotButtonButSpan?: boolean
}

export const CancelXButton: React.ComponentType<OwnProps> = (
    {
        onCancelClick, noAbsolute, mode = 'blueAlert', isNotButtonButSpan,
    } ) => {
    return (
        <div className={ styles.cancelButtonn + ' '
            + ( noAbsolute ? styles.cancelButtonn_noAbsolute : '' ) }
             onClick={ onCancelClick }
        >
            <ProjectButton type={ 'button' }
                           colorMode={ mode }
                           title={ 'Отменить/вернуться' }
                           style={ { border: 'none' } }
                           isNotButtonButSpan={ isNotButtonButSpan }
                           rounded
            >
                <MaterialIcon style={ { lineHeight: 1, fontSize: '29px' } } icon_name={ 'cancel' }/>
            </ProjectButton>
        </div>
    )
}
