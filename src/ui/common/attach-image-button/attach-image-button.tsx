import React from 'react'
import styles from './attach-image-button.module.scss'
import {MaterialIcon} from '../material-icon/material-icon'

type OwnProps = {
    onChange: Function
}

export const AttachImageButton: React.FC<OwnProps> = ( { onChange } ) => {

    return (
        <div className={ styles.attachImageButton }>
            <input type={ 'file' }
                   className={ styles.attachImageButton__hiddenInput }
                   accept={ '.png, .jpeg, .jpg, .bmp' }
                   onChange={ ( e ) => {
                       onChange(e)
                   } }
            />
            <div className={ styles.attachImageButton__beforeIconDiv }>
                <MaterialIcon icon_name={ 'file_upload' }/>
            </div>
        </div>
    )
}
