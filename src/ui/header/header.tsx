import React from 'react';
import styles from './header.module.scss';
import {Logo} from './logo/logo';
import {Phone} from './phone/phone';
import {useSelector} from 'react-redux';
import {getHeaderBaseStore} from '../../selectors/base-reselect';
import {InfoGlobalToModal} from '../common/modals/info-global-to-modal/info-global-to-modal';

type OwnProps = {}

export const Header: React.ComponentType<OwnProps> = () => {
    const { directPhoneNumber, companyName, baseHref } = useSelector(getHeaderBaseStore)
    return (
        <header className={ styles.header }>
            <InfoGlobalToModal/>
            <Logo companyName={ companyName } baseHref={ baseHref }/>
            <Phone directPhoneNumber={ directPhoneNumber }/>
        </header>
    )
}
