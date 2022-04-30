import React from 'react'
import styles from './login-section.module.scss'
import {LoginForm} from './login-form/login-form';
import {RegisterForm} from './register-form/register-form';


type OwnProps = {
    mode: 'login' | 'register'
}

export const LoginSection: React.FC<OwnProps> = ({mode}) => {

    return (
        <section className={ styles.authSection }>
            <div className={styles.authForm}>
                {mode === 'login'
                    ? <LoginForm onSubmit={()=>{}}/>
                    : <RegisterForm onSubmit={()=>{}}/>
                }
            </div>
                </section>
                )
            }
