import React from 'react';
import styles from './description-insider.module.scss';

type OwnProps = {
    srcIcon: string
    textArray: string[]
    position: 'left' | 'right' | 'center'
}

export const DescriptionInsider: React.FC<OwnProps> = ({srcIcon, textArray, position}) => {

    const positionIs = (s: OwnProps['position']): string =>
      s === 'left' ? styles.descriptionInsider_left
          : s === 'right' ? styles.descriptionInsider_right
              : ''

    return (
        <div className={styles.descriptionInsider + ' ' + positionIs(position)}>
            <img className={styles.descriptionInsider__icon} src={srcIcon} alt="hidden"/>
            {textArray.map((text) =>
                <span className={styles.descriptionInsider__text}>{text}</span>)}
        </div>
    )
}