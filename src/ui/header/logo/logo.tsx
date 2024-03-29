import React from 'react';
import styles from './logo.module.scss';
import logo from './../../../media/logo192.png'
import {useSelector} from 'react-redux';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {Link} from 'react-router-dom';

type OwnProps = {
    companyName: string,
    baseHref: string
}

export const Logo: React.ComponentType<OwnProps> = ( { companyName, baseHref } ) => {
    const { hello } = useSelector(getRoutesStore)
    return (
        <div className={ styles.logo }>
            <Link to={ hello } role={ 'button' } title={ 'Домой' }>
                <img className={ styles.logo__img } src={ logo } alt="logo"/>
            </Link>
            <h1 className={ styles.logo__title } title={ baseHref }>{ companyName }</h1>
        </div>
    )
}
