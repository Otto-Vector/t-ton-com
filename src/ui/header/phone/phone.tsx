import React from 'react';
import styles from './phone.module.scss';
import phone from './../../../media/phone.png';

type OwnProps = { directPhoneNumber: string}

export const Phone: React.FC<OwnProps> = ({directPhoneNumber}) => {

    return (
        <div className={styles.phone}>
            <a href={`tel:${directPhoneNumber}`} role={'img'}>
                <img className={styles.phone__img} src={phone} alt="phone" title={directPhoneNumber}/>
            </a>
        </div>
    )
}