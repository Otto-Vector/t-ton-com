import React from 'react';
import styles from './check-box-tick.module.scss';

type OwnProps = {
    input: any
    mode?: 'pink'
    checkBoxText?: string
    checked?: boolean
}

export const CheckBoxTick: React.ComponentType<OwnProps> = ( { input, mode = 'pink', checkBoxText , checked} ) => {
    return (
        <div className={styles.checkbox}>
            <label className={styles.checkbox__label}>
                <input className={styles.checkbox__input}
                       {...input}
                       type="checkbox"
                />
                <span className={styles.checkbox__box}></span>
                {/*то что будет писаться справа от него*/ }
                {checkBoxText&&<span className={styles.checkbox__text}>{checkBoxText}</span>}
            </label>
        </div>
    )
}
