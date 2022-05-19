import React from 'react';
import styles from './cancel-button.module.scss';
import {Button} from '../button/button';
import {MaterialIcon} from '../material-icon/material-icon';

type OwnProps = {
    onCancelClick: () => void
    noAbsolute?: boolean
    mode?: 'redAlert' | 'white'
}

export const CancelButton: React.FC<OwnProps> = ({onCancelClick, noAbsolute, mode='white'}) => {
    return (
        <div className={styles.cancelButtonn + ' '
            + (noAbsolute ? styles.cancelButtonn_noAbsolute : '')}
             onClick={onCancelClick}
        >
            <Button type={'submit'}
                    colorMode={mode}
                    title={'Отменить/вернуться'}
                    rounded
            ><MaterialIcon icon_name={'close'}/></Button>
        </div>
    )
}