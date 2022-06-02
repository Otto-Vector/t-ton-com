import React from 'react'
import styles from './info-section.module.scss'
import {useSelector} from 'react-redux'
import {getContentInfoStore} from '../../selectors/info-reselect';
import {getAuthCashAuthStore} from '../../selectors/auth-reselect';
import {OneInfoItem} from '../../redux/info-store-reducer';
import {ddDotMmFormat, hhMmFormat, isToday} from '../../utils/parsers';
import {NavLink} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';

type OwnProps = {}

const Message = ( { requestNumber, mode, infoText, timeDate }: OneInfoItem ) =>
    <div className={ styles.messageItem + ' ' + ( requestNumber ?? styles.messageItem_gray ) }>
        <div className={ styles.messageItem__number }>{ ( requestNumber || '---' ) }</div>
        <div className={ styles.messageItem__text + ' ' + styles['messageItem__text_' + mode] }>
            { infoText }
        </div>
        <div className={ styles.messageItem__date }>
            { isToday(timeDate) ? hhMmFormat(timeDate) : ddDotMmFormat(timeDate) }
        </div>
    </div>

export const InfoSection: React.FC<OwnProps> = () => {
    const messages = useSelector(getContentInfoStore)
    const balance = useSelector(getAuthCashAuthStore)
    const { requestInfo } = useSelector(getRoutesStore)

    return (
        <div className={ styles.infoSection }>
            <div className={ styles.infoSection__messagesContainer + ' ' + styles.messagesContainer }>
                <header className={ styles.messagesContainer__header }>{ 'Уведомления' }
                </header>
                <span className={ styles.messagesContainer__label }>{ 'Заявка' }</span>
                { [ ...messages ].reverse().map(( item ) =>
                    <div className={ styles.messagesContainer__item }
                         key={ item.requestNumber + item.infoText }>
                        { item.requestNumber ?
                            <NavLink to={ requestInfo.driver + item.requestNumber }>
                                <Message { ...item }/>
                            </NavLink>
                            : <Message { ...item }/>
                        }
                    </div>)
                }
            </div>
            <div className={ styles.infoSection__infoPayContainer + ' ' + styles.infoPayContainer }>
                <header className={ styles.infoPayContainer__header }>
                    { 'Тарифы оказания услуг на сайте ' }
                </header>
                <div className={ styles.infoPayContainer__header }>
                    { 'Ваш баланс:' + balance + ' рублей' }
                </div>
            </div>
        </div>
    )
}
