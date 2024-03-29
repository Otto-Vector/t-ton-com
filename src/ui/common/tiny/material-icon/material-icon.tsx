import React from 'react'
import styles from './material-icon.module.scss'

type OwnProps = {
    icon_name: 'search' | 'expand_more' | 'close' | 'expand_less' | 'menu_book' | 'cancel' | 'attach_file_add' | 'download'
        | 'reply' | 'add' | 'attach_file' | 'file_upload' | 'info' | 'highlight_off' | 'question_mark' | 'expand_circle_down'
        | 'not_listed_location' | 'location_on' | 'wrong_location' | 'delete_forever'
    style?: React.CSSProperties
}

export const MaterialIcon: React.ComponentType<OwnProps> = ( { icon_name, style } ) => {

    return (
        <span className={ `${ styles.iconsContent} material-symbols-rounded` }
              style={ style }
        >
            { icon_name }
        </span>
    )
}
