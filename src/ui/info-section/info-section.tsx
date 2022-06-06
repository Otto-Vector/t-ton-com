import React, {useEffect} from 'react'
import styles from './info-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {getContentInfoStore, getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect';
import {NavLink} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {MessageItem} from './message-item/message-item';
import {infoStoreActions} from '../../redux/info-store-reducer';
import {InfoPayContainer} from './info-pay-container/info-pay-container';

type OwnProps = {}

export const InfoSection: React.FC<OwnProps> = () => {
    const messages = useSelector(getContentInfoStore)
    const { requestInfo } = useSelector(getRoutesStore)
    const unreadCount = useSelector(getUnreadMessagesCountInfoStore)
    const dispatch = useDispatch()


    useEffect(() => {
        if (unreadCount !== 0) {
            dispatch(infoStoreActions.setAllMessagesViewed())
        }
    }, [ unreadCount ])

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
                                <MessageItem oneInfoItem={ item }/>
                            </NavLink>
                            : <MessageItem oneInfoItem={ item }/>
                        }
                    </div>)
                }
            </div>

            <div className={ styles.infoSection__infoPayContainer }>
                <InfoPayContainer/>
            </div>
        </div>

    )
}
