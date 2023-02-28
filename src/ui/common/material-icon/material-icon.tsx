import React from 'react'
import styles from './material-icon.module.scss'

type OwnProps = {
    icon_name: 'search' | 'expand_more' | 'close' | 'expand_less' | 'menu_book' | 'cancel'
        | 'reply' | 'add' | 'attach_file' | 'file_upload' | 'info' | 'highlight_off' | 'question_mark' | 'expand_circle_down'
    style?: React.CSSProperties
}

export const MaterialIcon: React.FC<OwnProps> = ( { icon_name, style } ) => {

    return (
        <span className={ `${ styles.iconsContent} material-symbols-rounded` }
              style={ style }
        >
            { icon_name }
        </span>
    )
}
