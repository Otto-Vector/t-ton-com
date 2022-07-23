import React from 'react'
import styles from './login-section.module.scss'
import {AuthLoginForm} from './auth-login-form/auth-login-form';


type OwnProps = {}

export const LoginSection: React.FC<OwnProps> = () => {

    return (
        <section className={ styles.authSection }>
            <div className={ styles.authForm }>
                <AuthLoginForm/>
            </div>
        </section>
    )
}
