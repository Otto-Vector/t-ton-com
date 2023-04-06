import React from 'react'
import styles from './message-item.module.scss'
import {OneInfoItem} from '../../../redux/info-store-reducer'
import {ddDotMmFormat, hhMmFormat, isToday} from '../../../utils/date-formats'
import {NavLink} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useSelector} from 'react-redux'


type OwnProps = {
    oneInfoItem: OneInfoItem
}

export const MessageItem: React.FC<OwnProps> = (
    {
        oneInfoItem: { idLog, mode, Message, Time, idObject },
    },
) => {
    const { requestInfo } = useSelector(getRoutesStore)
    const date = new Date(Time)

    return (
        <NavLink to={ requestInfo.status + idObject }
                 // отключаем линк
                 className={ mode === 'gray' ? styles.messageItem__inactiveLink : '' }>
            <div className={ styles.messageItem + ' ' + styles['messageItem_' + mode] }
                 title={ Message }>
                <span className={ styles.messageItem__number }>{ mode === 'gray' ? '---' : idObject }</span>
                <span className={ styles.messageItem__text + ' ' + styles['messageItem__text_' + mode] }>
                    { Message }
                </span>
                <span className={ styles.messageItem__date }>
                    { isToday(date) ? hhMmFormat(date) : ddDotMmFormat(date) }
                </span>
            </div>
        </NavLink>
    )
}
