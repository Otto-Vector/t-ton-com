import React from 'react'
import styles from './hello-section.module.scss'
// иконки
import man from './hello-section-png/man.png'
import briefcase from './hello-section-png/briefcase.png'
import truck from './hello-section-png/truck.png'
import car from './hello-section-png/car.png'
import factory from './hello-section-png/factory.png'
// модули
import {DescriptionInsider} from './description-insider/description-insider'
import {useSelector} from 'react-redux';
import {getHelloDescriptionBaseStore} from '../../selectors/base-reselect';


type OwnProps = {}

export const HelloSection: React.ComponentType<OwnProps> = React.memo(() => {

    const description = useSelector(getHelloDescriptionBaseStore)

    return (
        <section className={ styles.helloSection }>
            <h1 className={ styles.helloSection__title }>Новые возможности логистики с ТЛК</h1>
            <p className={ styles.helloSection__subtitle }>Сервис транспортировки нефтепродуктов и прочих грузов</p>
            <p className={ styles.helloSection__subtitle }>Полная автоматизация грузоперевозок на одном сайте</p>
            <div className={ styles.helloSection__bottomWrapper }>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ man } alt="Выгода"/>
                    <span className={ styles.helloItem__title }>{ 'Выгода Заказчикам' }</span>
                    <DescriptionInsider srcIcon={ man } textArray={ description.man } position={ 'left' }/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ briefcase } alt="Преимущество"/>
                    <span className={ styles.helloItem__title }>{ 'Преимущество Поставщикам' }</span>
                    <DescriptionInsider srcIcon={ briefcase } textArray={ description.portfeler } position={ 'left' }/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ truck } alt="Возможности"/>
                    <span className={ styles.helloItem__title }>{ 'Возможности Перевозчикам' }</span>
                    <DescriptionInsider srcIcon={ truck } textArray={ description.truck } position={ 'center' }/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ car } alt="Комфорт"/>
                    <span className={ styles.helloItem__title }>{ 'Комфорт Водителям' }</span>
                    <DescriptionInsider srcIcon={ car } textArray={ description.car } position={ 'right' }/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ factory } alt="Удобство"/>
                    <span className={ styles.helloItem__title }>{ 'Удобство Контрагентам' }</span>
                    <DescriptionInsider srcIcon={ factory } textArray={ description.factory } position={ 'right' }/>
                </div>
            </div>
        </section>
    )
})
