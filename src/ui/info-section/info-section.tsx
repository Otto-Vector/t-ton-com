import React, {useEffect} from 'react'
import styles from './info-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {getContentInfoStore, getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect'
import {MessageItem} from './message-item/message-item'
import {getInfoMessages, infoStoreActions} from '../../redux/info-store-reducer'
import {InfoPayContainer} from './info-pay-container/info-pay-container'

type OwnProps = {}

export const InfoSection: React.FC<OwnProps> = () => {
    const messages = useSelector(getContentInfoStore)
    const unreadCount = useSelector(getUnreadMessagesCountInfoStore)
    const dispatch = useDispatch()

    useEffect(() => {
        if (unreadCount !== 0) {
            dispatch(infoStoreActions.setAllMessagesViewed())
        }
    }, [ unreadCount ])

    useEffect(() => { //при первом рендере подгружает все уведомления
        dispatch<any>(getInfoMessages())
    }, [])

    return (
        <div className={ styles.infoSection }>
            <div className={ styles.infoSection__messagesContainer + ' ' + styles.messagesContainer }>
                <header className={ styles.messagesContainer__header }>{ 'Уведомления' }
                </header>
                <span className={ styles.messagesContainer__label }>{ 'Заявка' }</span>
                { [ ...messages ].reverse().map(( item ) =>
                    <div className={ styles.messagesContainer__item }
                         key={ item.idLog }>
                        <MessageItem oneInfoItem={ item }/>
                    </div>)
                }
            </div>

            <div className={ styles.infoSection__infoPayContainer }>
                <InfoPayContainer/>
            </div>
        </div>

    )
}
