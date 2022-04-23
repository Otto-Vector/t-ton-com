import React from 'react';
import styles from './header.module.scss';
import {Logo} from './logo/logo';
import {Phone} from './phone/phone';

type OwnProps = {}

export const Header: React.FC<OwnProps> = () => {
    return (
        <header className={styles.header}>
            <Logo/>
            <Phone/>
        </header>
    )
}