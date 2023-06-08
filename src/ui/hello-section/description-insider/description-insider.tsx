import React from 'react'
import styles from './description-insider.module.scss'

type OwnProps = {
    srcIcon: string
    textArray: string[]
    position?: 'left' | 'right' | 'center'
    hide?: boolean
}

export const DescriptionInsider: React.ComponentType<OwnProps> = ( { srcIcon, textArray, position = 'center', hide = true } ) => {

    const positionIs = ( pos: OwnProps['position'] ): string =>
        pos === 'left' ? styles.descriptionInsider_left
            : pos === 'right' ? styles.descriptionInsider_right
                : ''

    const viewedIs = ( trigger: boolean ): string => trigger ? '' : styles.descriptionInsider_viewed

    return (
        <div className={ styles.descriptionInsider + ' ' + positionIs(position) + ' ' + viewedIs(hide) }>
            <img className={ styles.descriptionInsider__icon } src={ srcIcon } alt="hidden"/>
            { textArray.map(( text ) =>
                <p className={ styles.descriptionInsider__text } key={ text }>{ text }</p>) }
        </div>
    )
}
