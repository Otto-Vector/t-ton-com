import React from 'react'
import styles from './material-icon.module.scss'

type OwnProps = {
    icon_name: 'search' | 'expand_more' | 'close' | 'expand_less' | 'menu_book'
        | 'reply' | 'add' | 'attach_file' | 'file_upload' | 'info' | 'highlight_off' | 'question_mark'
}

export const MaterialIcon: React.FC<OwnProps> = ( { icon_name } ) => {

    return (
        <span className={ styles.iconsContent }>{ icon_name }</span>
    )
}
