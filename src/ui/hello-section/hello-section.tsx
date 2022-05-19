import React, {useState} from 'react'
import styles from './hello-section.module.scss'

// иконки
import man from './helloSectionSVG/man.svg'
import portfeler from './helloSectionSVG/briefcase.svg'
import track from './helloSectionSVG/track.svg'
import car from './helloSectionSVG/car.svg'
import factory from './helloSectionSVG/factory.svg'
import {DescriptionInsider} from './description-insider/description-insider'

type OwnProps = {}

export const HelloSection: React.FC<OwnProps> = () => {


    const description = {
        man: [
            '- Подписание документации через ЭДО',
            '- Выбор транспорта по своим условиям',
            '- Оформление документации без ошибок',
            '- Работа без посредников с контрагентами',
            '- Конфиденциальность при создании заявок',
            '- Отслеживание автотранспорта до и после погрузки',
            '- Без постоянного обзвона перевозчикам и водителям',
        ],
        portfeler: [
            '- Отслеживание отгрузок и заявок на сайте',
            '- Возможность реализации в любом регионе',
            '- Удобная работа с покупателями продукции',
            '- Отгрузки своим транспортом к контрагентам',
            '- Использование брендированного транспорта',
            '- Ведение учета собственных отгрузок и рейсов',
            '- Полный документооборот по перевозкам с ЭДО',
        ],
        track: [
            '- Подписание документов на сайте',
            '- Оформление путевых листов и ТТН',
            '- Работа без посредников с Заказчиками',
            '- Поиск рейса для своего водителя на сайте',
            '- Отслеживание местонахождения сотрудников',
            '- Поиск заявок радом со свободным транспортом',
            '- Выбор различных конфигураций сцепок и водителей',
        ],
        car: [
            '- Местоположение для Грузополучателей',
            '- Участие в разных заявках одновременно',
            '- Информация о авто и рейсах поблизости',
            '- Уведомление о принятом в работу рейсе',
            '- Местоположение мест Погрузки и Разгрузки',
            '- Поиск водителей и местоположение на карте',
            '- Удобный выбор транспорта или прицепа с фото',
        ],
        factory: [
            '- Поиск заявок и история работы',
            '- Подписание документов по ЭЦП',
            '- Связь со всеми сторонами заявки',
            '- Отслеживание своих сотрудников',
            '- Отслеживание передвижения груза',
            '- Отслеживание и рейсы своему транспорту',
            '- Местоположение авто до и после разгрузки',
        ]
    }

    // ToDo: helloItem в отдельный блок

    return (
        <section className={ styles.helloSection }>
            <h1 className={ styles.helloSection__title }>Новые возможности логистики с ТЛК</h1>
            <p className={ styles.helloSection__subtitle }>Сервис транспортировки нефтепродуктов и прочих грузов</p>
            <p className={ styles.helloSection__subtitle }>Полная автоматизация грузоперевозок на одном сайте</p>
            <div className={ styles.helloSection__bottomWrapper }>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ man } alt="Выгода"/>
                    <span className={ styles.helloItem__title }>{ 'Выгода Заказчикам' }</span>
                    <DescriptionInsider srcIcon={ man } textArray={ description.man } position={'left'}/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ portfeler } alt="Преимущество"/>
                    <span className={ styles.helloItem__title }>{ 'Преимущество Поставщикам' }</span>
                    <DescriptionInsider srcIcon={ portfeler } textArray={ description.portfeler } position={'left'}/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ track } alt="Возможности"/>
                    <span className={ styles.helloItem__title }>{ 'Возможности Перевозчикам' }</span>
                    <DescriptionInsider srcIcon={ track } textArray={ description.track } position={'center'}/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ car } alt="Комфорт"/>
                    <span className={ styles.helloItem__title }>{ 'Комфорт Водителям' }</span>
                    <DescriptionInsider srcIcon={ car } textArray={ description.car } position={'right'}/>
                </div>
                <div className={ styles.helloItem }>
                    <img className={ styles.helloItem__icon } src={ factory } alt="Удобство"/>
                    <span className={ styles.helloItem__title }>{ 'Удобство Контрагентам' }</span>
                    <DescriptionInsider srcIcon={ factory } textArray={ description.factory } position={'right'}/>
                </div>
            </div>
        </section>
    )
}
