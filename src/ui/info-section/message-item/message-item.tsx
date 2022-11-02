import React from 'react';
import styles from './message-item.module.scss'
import {OneInfoItem} from '../../../redux/info-store-reducer';
import {ddDotMmFormat, hhMmFormat, isToday} from '../../../utils/date-formats';


type OwnProps = {
    oneInfoItem: OneInfoItem
}

export const MessageItem: React.FC<OwnProps> = (
    {
        oneInfoItem: { idLog, mode, Message, Time },
    },
) => {

    const date = new Date(Time)

    return (
        <div className={ styles.messageItem + ' ' + styles['messageItem_' + mode] }>
            <div className={ styles.messageItem__number }>{ ( idLog || '---' ) }</div>
            <div className={ styles.messageItem__text + ' ' + styles['messageItem__text_' + mode] }>
                { Message }
            </div>
            <div className={ styles.messageItem__date }>
                { isToday(date) ? hhMmFormat(date) : ddDotMmFormat(date) }
            </div>
        </div>
    )
}
