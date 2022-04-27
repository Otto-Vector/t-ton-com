import React from 'react';
import styles from './description-insider.module.scss';

type OwnProps = {
    srcIcon: string
    textArray: string[]
    position: 'left' | 'right' | 'center'
}

export const DescriptionInsider: React.FC<OwnProps> = ({srcIcon, textArray, position}) => {

    const positionIs = (pos: OwnProps['position']): string =>
      pos === 'left' ? styles.descriptionInsider_left
          : pos === 'right' ? styles.descriptionInsider_right
              : ''

    return (
        <div className={styles.descriptionInsider + ' ' + positionIs(position)}>
            <img className={styles.descriptionInsider__icon} src={srcIcon} alt="hidden"/>
            {textArray.map((text) =>
                <p className={styles.descriptionInsider__text} key={text}>{text}</p>)}
        </div>
    )
}