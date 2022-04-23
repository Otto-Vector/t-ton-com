import React from 'react';
import styles from './logo.module.scss';
import logo from './../../../media/logo.png'

type OwnProps = {
    companyName: string,
    baseHref: string
}

export const Logo: React.FC<OwnProps> = ({companyName, baseHref}) => {

    return (
        <div className={styles.logo}>
            <a href={baseHref}
               target="_blank"
               rel="noopener noreferrer"
               role={'button'}><img className={styles.logo__img} src={logo} alt="logo"/></a>
            <h1 className={styles.logo__title}>{companyName}</h1>
        </div>
    )
}