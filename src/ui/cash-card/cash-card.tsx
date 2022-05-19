import React from 'react';
import {useSelector} from 'react-redux';
import {getAuthCashAuthStore} from '../../selectors/auth-reselect'
import styles from './auth-cash.module.scss'

type OwnProps = {}

export const CashCard: React.FC<OwnProps> = () => {
    const authCash = useSelector( getAuthCashAuthStore )
    return (
        <section className={styles.authCash}>
            <header className={styles.authCash__title}>{`Ваш баланс ${authCash} рублей`}</header>
        </section>
    )
}
