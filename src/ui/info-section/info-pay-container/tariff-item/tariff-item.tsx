import React from 'react'
import styles from './tariff-item.module.scss'


type OwnProps = {
    tarifsLabel: string,
    tarifsPrice: string
}

export const TariffItem: React.ComponentType<OwnProps> = (
    {
        tarifsLabel,
        tarifsPrice,
    } ) => {

    return (

        <div className={ styles.tariffItem }>
            <span className={ styles.tariffItem__left }>{ tarifsLabel }</span>
            <span className={ styles.tariffItem__right }>{ tarifsPrice }</span>
        </div>


    )
}
