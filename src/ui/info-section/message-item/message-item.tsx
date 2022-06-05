import React from 'react';
import styles from './message-item.module.scss'
import {OneInfoItem} from '../../../redux/info-store-reducer';
import {ddDotMmFormat, hhMmFormat, isToday} from '../../../utils/date-formats';


type OwnProps = {
    oneInfoItem: OneInfoItem
}

export const MessageItem: React.FC<OwnProps> = (
    {
        oneInfoItem: { requestNumber, mode, infoText, timeDate },
    },
) =>
    <div className={ styles.messageItem + ' ' + ( requestNumber ?? styles.messageItem_gray ) }>
        <div className={ styles.messageItem__number }>{ ( requestNumber || '---' ) }</div>
        <div className={ styles.messageItem__text + ' ' + styles['messageItem__text_' + mode] }>
            { infoText }
        </div>
        <div className={ styles.messageItem__date }>
            { isToday(timeDate) ? hhMmFormat(timeDate) : ddDotMmFormat(timeDate) }
        </div>
    </div>
