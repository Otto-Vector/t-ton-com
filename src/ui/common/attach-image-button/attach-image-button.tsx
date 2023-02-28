import React, {ChangeEventHandler} from 'react'
import styles from './attach-image-button.module.scss'
import {MaterialIcon} from '../material-icon/material-icon'

type OwnProps = {
    onChange: Function
}

export const AttachImageButton: React.FC<OwnProps> = ( { onChange } ) => {

    return (
        <div className={ styles.attachImageButton }>
            <div className={ styles.attachImageButton_before }>
                <MaterialIcon icon_name={ 'file_upload' }/>
            </div>
            <input type={ 'file' }
                   className={ styles.attachImageButton__hiddenInput }
                   accept={ '.png, .jpeg, .jpg, .bmp' }
                   onChange={ ( e ) => {
                       onChange(e)
                   } }
            />
        </div>
    )
}
