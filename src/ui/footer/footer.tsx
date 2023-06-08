import React from 'react';
import styles from './footer.module.scss';
import alert from '../../media/alert.svg'
import {Ofer} from './ofer/ofer';

type OwnProps = {}

export const Footer: React.ComponentType<OwnProps> = () => {
    return (
        <footer className={ styles.footer }>
            <Ofer/>
            <div className={ styles.footer__info }>
                <p className={ styles.footer__text }>Используя данный сайт <b>т-л-к.рф</b>, вы даете согласие на работу
                    с <b>Сookie</b>, <b>Google
                        Analytics</b>, <b>Яндекс.Метрикой</b> и прочих сервисов для сбора технических данных.
                </p>
                <img className={ styles.footer__alertImg } src={ alert } alt="alert"/>
            </div>
        </footer>
    )
}
