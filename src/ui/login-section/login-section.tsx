import React from 'react'
import styles from './login-section.module.scss'
import {LoginForm} from './login-form/login-form';


type OwnProps = {
}

export const LoginSection: React.FC<OwnProps> = () => {


    return (
        <section className={ styles.authSection }>
            <div className={styles.authForm}>
                    <LoginForm />
            </div>
                </section>
                )
            }
