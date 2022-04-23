import React from 'react';
import styles from './phone.module.scss';
import phone from './../../../media/phone.png';
import {useSelector} from 'react-redux';
import {getDirectPhoneNumber} from '../../../selectors/base-reselect';

type OwnProps = {}

export const Phone: React.FC<OwnProps> = () => {
    const directPhoneNumber = useSelector(getDirectPhoneNumber)
    return (
        <div className={styles.phone}>
            <a href={`tel:${directPhoneNumber}`} role={'img'}>
                <img className={styles.phone__img} src={phone} alt="phone" title={directPhoneNumber}/>
            </a>
        </div>
    )
}