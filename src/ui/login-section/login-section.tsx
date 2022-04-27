import React from 'react'
import styles from './login-section.module.scss'
import {LoginForm} from './loginForm/login-form';


type OwnProps = {}

export const LoginSection: React.FC<OwnProps> = () => {

    return (
        <section className={ styles.authSection }>
            <div className={styles.authForm}>
                <LoginForm onSubmit={()=>{}}/>
            </div>
                </section>
                )
            }
