import React from 'react';
import styles from './cancel-button.module.scss';
import {Button} from '../../../common/button/button';
import {MaterialIcon} from '../../../common/material-icon/material-icon';

type OwnProps = {
    onCancelClick: () => void
    noAbsolute?: boolean
}

export const CancelButton: React.FC<OwnProps> = ({onCancelClick, noAbsolute}) => {
    return (
        <div className={styles.cancelButtonn + ' '
            + (noAbsolute ? styles.cancelButtonn_noAbsolute : '')}
             onClick={onCancelClick}
        >
            <Button type={'submit'}
                    colorMode={'white'}
                    title={'Отменить/вернуться'}
                    rounded
            ><MaterialIcon icon_name={'close'}/></Button>
        </div>
    )
}