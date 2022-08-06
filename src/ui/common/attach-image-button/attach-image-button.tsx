import React from 'react'
import styles from './attach-image-button.module.scss'

type OwnProps = {
    onChange: Function
}

export const AttachImageButton: React.FC<OwnProps> = ( { onChange } ) => {

    return (
        <div className={ styles.attachImageButton }>
            <input type={ 'file' }
                   className={ styles.attachImageButton__hiddenInput }
                   accept={ '.png, .jpeg, .jpg' }
                   onChange={ ( e ) => {
                       onChange(e)
                   } }
            />
        </div>
    )
}
