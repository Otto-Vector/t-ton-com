import React, {useEffect} from 'react'
import styles from './info-section.module.scss'
import barcode from '../../media/barcode.png'
import ucassa from '../../media/ukassa.jpg'
import {useDispatch, useSelector} from 'react-redux'
import {getContentInfoStore, getUnreadMessagesCountInfoStore} from '../../selectors/info-reselect';
import {getAuthCashAuthStore, getTarifsAuthStore} from '../../selectors/auth-reselect';
import {NavLink} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {MessageItem} from './message-item/message-item';
import {infoStoreActions} from '../../redux/info-store-reducer';

type OwnProps = {}

export const InfoSection: React.FC<OwnProps> = () => {
    const messages = useSelector(getContentInfoStore)
    const balance = useSelector(getAuthCashAuthStore)
    const { requestInfo } = useSelector(getRoutesStore)
    const tarifsPrice = useSelector(getTarifsAuthStore)
    const unreadCount = useSelector(getUnreadMessagesCountInfoStore)
    const dispatch = useDispatch()

    const tarifsHeader = 'Тарифы оказания услуг на сайте'
    const tarifsLabel: Record<keyof typeof tarifsPrice, string> = {
        create: 'Создание Заявки Заказчиком:',
        acceptLongRoute: 'Принятие Местной Заявки Перевозчиком:',
        acceptShortRoute: 'Принятие Дальней Заявки Перевозчиком:',
        paySafeTax: 'Комиссия с оплат по Безопастным сделкам:',
    }

    const balanceHeader = 'Ваш баланс: ' + balance + ' рублей'
    const subTitle = [ 'Укажите номер Пользователя при пополнении Баланса.', 'Рекомендуется пополнять счёт каждого из Пользователей заранее!' ]
    const textInfo = 'Для пополнения Баланса счета Пользователя через сайт Т-Л-К.РФ, отсканируйте QR-код в мобильном приложении своей банковской карты. К оплате принимаются любые виды банковских карт личные и корпоративные. При невозможности оплаты через QR-код, воспользуйтесь оплатой через ЮКасса.'

    useEffect(() => {
        if (unreadCount !== 0) {
            dispatch(infoStoreActions.setAllMessagesViewed())
        }
    }, [unreadCount])

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

            <div className={ styles.infoSection__infoPayContainer + ' ' + styles.infoPayContainer }>
                <div className={ styles.infoPayContainer__leftTariffs }>
                    <h3 className={ styles.infoPayContainer__header }>
                        { tarifsHeader }
                    </h3>
                    <div className={ styles.tariffItem }>
                        <span className={ styles.tariffItem__left }>{ tarifsLabel.create }</span>
                        <span className={ styles.tariffItem__right }>{ tarifsPrice.create + ' руб.' }</span>
                    </div>
                    <div className={ styles.tariffItem }>
                        <span className={ styles.tariffItem__left }>{ tarifsLabel.acceptShortRoute }</span>
                        <span className={ styles.tariffItem__right }>{ tarifsPrice.acceptShortRoute + ' руб.' }</span>
                    </div>
                    <div className={ styles.tariffItem }>
                        <span className={ styles.tariffItem__left }>{ tarifsLabel.acceptLongRoute }</span>
                        <span className={ styles.tariffItem__right }>{ tarifsPrice.acceptLongRoute + ' руб.' }</span>
                    </div>
                    <div className={ styles.tariffItem }>
                        <span className={ styles.tariffItem__left }>{ tarifsLabel.paySafeTax }</span>
                        <span className={ styles.tariffItem__right }>{ tarifsPrice.paySafeTax + '% от суммы' }</span>
                    </div>

                </div>
                <img className={ styles.infoPayContainer__centerBarcode } src={ barcode } alt="barcode"
                     title={ 'Штрихкод для оплаты' }/>

                <div className={ styles.infoPayContainer__rightBalance }>

                    <div className={ styles.rightBalance__upper }>
                        <div className={ styles.rightBalance__upperLeft }>
                            <h3 className={ styles.infoPayContainer__header }>
                                { balanceHeader }
                            </h3>
                            <div className={ styles.rightBalance__upperLeftSubtitle }>
                                { subTitle[0] }</div>
                            <div className={ styles.rightBalance__upperLeftSubtitle }>
                                { subTitle[1] }</div>
                        </div>
                        <div className={ styles.rightBalance__upperRight }>
                            <button type={ 'button' }
                                    onClick={ () => {
                                        alert('Оплата!')
                                    } }>
                                <img className={ styles.rightBalance__upperRight }
                                     src={ ucassa } alt="Оплата онлайн" title={ 'Оплатить сюда' }/>
                            </button>
                        </div>
                    </div>
                    <div className={ styles.rightBalance__footer }>
                        <p>{ textInfo }</p>
                    </div>
                </div>
            </div>
        </div>

    )
}
