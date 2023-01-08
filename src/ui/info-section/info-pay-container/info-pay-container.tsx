import React from 'react'
import styles from './info-pay-container.module.scss'
import barcode from '../../../media/barcode.png'
import ucassa from '../../../media/ukassa.jpg'
import {useDispatch, useSelector} from 'react-redux'
import {TariffItem} from './tariff-item/tariff-item';
import {getTarifsLabelInfoStore} from '../../../selectors/info-reselect';
import {
    getCashRequisitesStore,
    getIsFetchingRequisitesStore,
    getTariffsRequisitesStore,
} from '../../../selectors/options/requisites-reselect';
import {setOrganizationCashRequisites} from '../../../redux/options/requisites-store-reducer';
import {SizedPreloader} from '../../common/preloader/preloader';


type OwnProps = {}

export const InfoPayContainer: React.FC<OwnProps> = () => {

    const dispatch = useDispatch()
    const balance = +( useSelector(getCashRequisitesStore) || 0 )
    const isFetchingBalance = useSelector(getIsFetchingRequisitesStore)
    const tarifsHeader = 'Тарифы оказания услуг на сайте'
    const tarifsPrice = useSelector(getTariffsRequisitesStore)
    const tarifsLabel = useSelector(getTarifsLabelInfoStore)

    const balanceHeader = `Ваш баланс: \n ${ balance } руб.`
    const subTitle = [ 'Укажите номер Пользователя при пополнении Баланса.', 'Рекомендуется пополнять счёт каждого из Пользователей заранее!' ]
    const textInfo = 'Для пополнения Баланса счета Пользователя через сайт Т-Л-К.РФ, отсканируйте QR-код в мобильном приложении своей банковской карты. К оплате принимаются любые виды банковских карт личные и корпоративные. При невозможности оплаты через QR-код, воспользуйтесь оплатой через ЮКасса.'

    const onPay = ( balance: number ) => {
        dispatch<any>(setOrganizationCashRequisites(balance))
    }

    return (
        <div className={ styles.infoPayContainer }>
            <div className={ styles.infoPayContainer__balanceInfo }>
                <h3 className={ styles.infoPayContainer__header + ' ' + styles.balanceInfo__header }>
                    { isFetchingBalance ? <SizedPreloader sizeHW={'28px'}/> : balanceHeader }
                </h3>
                <div className={ styles.balanceInfo__subtitle }>
                    { subTitle[0] }</div>
                <div className={ styles.balanceInfo__subtitle }>
                    { subTitle[1] }</div>

                <div className={ styles.balanceInfo__footer }>
                    <p>{ textInfo }</p>
                </div>
            </div>
            {/*ШТРИХКОД*/ }
            <img className={ styles.infoPayContainer__centerBarcode } src={ barcode } alt="barcode"
                 title={ 'Штрихкод для оплаты' }/>
            {/*КНОПКА КАССЫ*/ }
            <div className={ styles.uPayButton }>
                <button type={ 'button' }
                        onClick={ () => {
                            onPay(100)
                        } }>
                    <img className={ styles.uPayButton }
                         src={ ucassa } alt="Оплата онлайн" title={ 'Оплатить сюда' }/>
                </button>
            </div>
            <div className={ styles.infoPayContainer__leftTariffs }>
                <h3 className={ styles.infoPayContainer__header }>{ tarifsHeader }</h3>
                <TariffItem tarifsLabel={ tarifsLabel.create }
                            tarifsPrice={ tarifsPrice.create + ' руб.' }/>
                <TariffItem tarifsLabel={ tarifsLabel.acceptShortRoute }
                            tarifsPrice={ tarifsPrice.acceptShortRoute + ' руб.' }/>
                <TariffItem tarifsLabel={ tarifsLabel.acceptLongRoute }
                            tarifsPrice={ tarifsPrice.acceptLongRoute + ' руб.' }/>
                <TariffItem tarifsLabel={ tarifsLabel.paySafeTax }
                            tarifsPrice={ tarifsPrice.paySafeTax + '% от суммы' }/>
            </div>
        </div>

    )
}
