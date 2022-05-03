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

    const initial = {
        man: true,
        portfeler: true,
        track: true,
        car: true,
        factory: true,
    }

    const [ view, setView ] = useState( initial )

    const activeView = ( key: keyof typeof initial ) => {
        setView( { ...initial, [key]: false } )
    }

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
        <section className={ styles.helloSection } onClick={ () => {
            setView( initial )
        } }>
            <h1 className={ styles.helloSection__title }>Новые возможности логистики с ТЛК</h1>
            <p className={ styles.helloSection__subtitle }>Сервис транспортировки нефтепродуктов и прочих грузов</p>
            <p className={ styles.helloSection__subtitle }>Полная автоматизация грузоперевозок на одном сайте</p>
            <div className={ styles.helloSection__bottomWrapper }>
                <DescriptionInsider srcIcon={ man } textArray={ description.man } hide={ view.man }/>
                <DescriptionInsider srcIcon={ portfeler } textArray={ description.portfeler } hide={ view.portfeler }/>
                <DescriptionInsider srcIcon={ track } textArray={ description.track } hide={ view.track }/>
                <DescriptionInsider srcIcon={ car } textArray={ description.car } hide={ view.car }/>
                <DescriptionInsider srcIcon={ factory } textArray={ description.factory } hide={ view.factory }/>
                <div className={ styles.helloItem } onMouseEnter={ () => {
                    activeView( 'man' )
                } }>
                    <img className={ styles.helloItem__icon } src={ man } alt="Выгода"/>
                    <span className={ styles.helloItem__title }>{ 'Выгода Заказчикам' }</span>
                </div>
                <div className={ styles.helloItem } onMouseEnter={ () => {
                    activeView( 'portfeler' )
                } }>
                    <img className={ styles.helloItem__icon } src={ portfeler } alt="Преимущество"/>
                    <span className={ styles.helloItem__title }>{ 'Преимущество Поставщикам' }</span>
                </div>
                <div className={ styles.helloItem } onMouseEnter={ () => {
                    activeView( 'track' )
                } }>
                    <img className={ styles.helloItem__icon } src={ track } alt="Возможности"/>
                    <span className={ styles.helloItem__title }>{ 'Возможности Перевозчикам' }</span>
                </div>
                <div className={ styles.helloItem } onMouseEnter={ () => {
                    activeView( 'car' )
                } }>
                    <img className={ styles.helloItem__icon } src={ car } alt="Комфорт"/>
                    <span className={ styles.helloItem__title }>{ 'Комфорт Водителям' }</span>
                </div>
                <div className={ styles.helloItem } onMouseEnter={ () => {
                    activeView( 'factory' )
                } }>
                    <img className={ styles.helloItem__icon } src={ factory } alt="Удобство"/>
                    <span className={ styles.helloItem__title }>{ 'Удобство Контрагентам' }</span>
                </div>
            </div>
        </section>
    )
}
