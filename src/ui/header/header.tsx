import React from 'react';
import styles from './header.module.scss';
import {Logo} from './logo/logo';
import {Phone} from './phone/phone';
import {useSelector} from 'react-redux';
import {getHeaderStore} from '../../selectors/base-reselect';

type OwnProps = {}

export const Header: React.FC<OwnProps> = () => {
    const { directPhoneNumber, companyName, baseHref } = useSelector(getHeaderStore)
    return (
        <header className={ styles.header }>
            <Logo companyName={ companyName } baseHref={ baseHref }/>
            <Phone directPhoneNumber={ directPhoneNumber }/>
        </header>
    )
}