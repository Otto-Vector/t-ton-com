import React from 'react';
import styles from './header.module.scss';
import {Logo} from './logo/logo';
import {Phone} from './phone/phone';
import {useSelector} from 'react-redux';
import {getHeaderStore} from '../../selectors/base-reselect';
import {InfoGlobalToModal} from '../common/info-global-to-modal/info-global-to-modal';

type OwnProps = {}

export const Header: React.FC<OwnProps> = () => {
    const { directPhoneNumber, companyName, baseHref } = useSelector(getHeaderStore)
    return (
        <header className={ styles.header }>
            <InfoGlobalToModal/>
            <Logo companyName={ companyName } baseHref={ baseHref }/>
            <Phone directPhoneNumber={ directPhoneNumber }/>
        </header>
    )
}