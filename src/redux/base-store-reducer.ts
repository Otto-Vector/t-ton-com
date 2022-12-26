import {ThunkAction} from 'redux-thunk'
import {AppStateType} from './redux-store'
import {SelectOptionsType} from '../ui/common/form-selector/selector-utils';
import {GetActionsTypes} from '../types/ts-utils';
import {
    cargoConstType,
    CargoTypeType,
    PreAuthGlobalDataType,
    propertyRights,
    PropertyRightsType,
} from '../types/form-types';
import {preAuthApi} from '../api/local-api/pre-auth.api';
import {GlobalModalActionsType, globalModalStoreActions} from './utils/global-modal-store-reducer';
import {TtonErrorType} from '../api/local-api/back-instance.api';


const initialState = {
    serverURL: 'https://server.t-ton.com/',

    // процент, на который надо помножить
    distanceCoefficient: 1.05,
    cargoFormats: [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
        'Тягач', 'Фургон, Борт', 'Цементовоз' ] as string[] | typeof cargoConstType,
    propertyRights: [ '' ] as string[] | typeof propertyRights,

    // тарифы на оплату (отображаются в инфо-секции, используются везде, редактируются админом)
    tariffs: {
        // тариф на создание заявки (по умолчанию 100)
        create: 0,
        // тариф на принятие заявки на короткие расстояния (по умолчанию 100)
        acceptShortRoute: 100,
        // тариф на принятие заявки на Дальние расстояния (по умолчанию 100)
        acceptLongRoute: 100,
        // процент на безопасную сделку (по умолчанию 3) (будем прикручивать в будущем)
        paySafeTax: 3,
    },
    maxRequests: 10,

    header: {
        companyName: 'Транспортно-Логистическая Компания',
        baseHref: 'https://t-ton.com',
        directPhoneNumber: '+79-500-510-520',
    },

    footer: {
        linkToOfer: '#oferIsHere',
    },

    links: [
        { domain: 'https://yandex.ru', title: 'Поисковик' },
        { domain: 'https://github.com', title: 'Хранение' },
        { domain: 'https://google.ru', title: 'Другой поисковик' },
    ],


    helloDescription: {
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
        truck: [
            '- Подписание документов на сайте',
            '- Оформление путевых листов и ТТН',
            '- Работа без посредников с Заказчиками',
            '- Поиск рейса для своего водителя на сайте',
            '- Отслеживание местонахождения сотрудников',
            '- Поиск заявок рядом со свободным транспортом',
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
        ],
    },
    drivingCategorySelector: [
        { key: 'A', value: 'A', label: 'A - Мотоциклы' },
        { key: 'A1', value: 'A1', label: 'A1 - Легкие мотоциклы' },
        { key: 'B', value: 'B', label: 'B - Легковые автомобили, небольшие грузовики' },
        { key: 'BE', value: 'BE', label: 'BE - Легковые автомобили с прицепом' },
        { key: 'B1', value: 'B1', label: 'B1 - Трициклы, Квадрициклы' },
        { key: 'C', value: 'C', label: 'C - Грузовые автомобили' },
        { key: 'CE', value: 'CE', label: 'CE - Грузовые автомобили с прицепом' },
        { key: 'C1', value: 'C1', label: 'C1 - Средние грузовики' },
        { key: 'C1E', value: 'C1E', label: 'C1E - Средние грузовики с прицепом' },
        { key: 'D', value: 'D', label: 'D - Автобусы' },
        { key: 'DE', value: 'DE', label: 'DE - Автобусы с прицепом' },
        { key: 'D1', value: 'D1', label: 'D1 - Небольшие автобусы' },
        { key: 'D1E', value: 'D1E', label: 'D1E - Небольшие автобусы с прицепом' },
        { key: 'M', value: 'M', label: 'M - Мопеды' },
        { key: 'Tm', value: 'Tm', label: 'Tm - Трамваи' },
        { key: 'Tb', value: 'Tb', label: 'Tb - Троллейбусы' },
    ] as SelectOptionsType[],
}

export type BaseStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof baseStoreActions>

export const baseStoreReducer = ( state = initialState, action: ActionsType ): BaseStoreReducerStateType => {

    switch (action.type) {

        case 'base-store-reducer/SET-VALUES': {
            return {
                ...state,
                serverURL: action.payload.serverURL,
                header: {
                    ...state.header,
                    baseHref: action.payload.baseURL,
                    directPhoneNumber: action.payload.globalPhone,
                },
                footer: { ...state.footer, linkToOfer: action.payload.linkToOfer },
                cargoFormats: action.payload.cargoFormats.split(', '),
                propertyRights: action.payload.propertyRights.split(', '),
                links: [
                    { title: action.payload.linkTitleOne, domain: action.payload.linkDomainOne },
                    { title: action.payload.linkTitleTwo, domain: action.payload.linkDomainTwo },
                    { title: action.payload.linkTitleThree, domain: action.payload.linkDomainThree },
                    { title: action.payload.linkTitleFour, domain: action.payload.linkDomainFour },
                    { title: action.payload.linkTitleFive, domain: action.payload.linkDomainFive },
                    { title: action.payload.linkTitleSix, domain: action.payload.linkDomainSix },
                    { title: action.payload.linkTitleSeven, domain: action.payload.linkDomainSeven },
                    { title: action.payload.linkTitleEight, domain: action.payload.linkDomainEight },
                    { title: action.payload.linkTitleNine, domain: action.payload.linkDomainNine },
                    { title: action.payload.linkTitleTen, domain: action.payload.linkDomainTen },
                ],
                tariffs: {
                    create: action.payload.tarifCreate,
                    acceptShortRoute: action.payload.tarifAcceptShortRoute,
                    acceptLongRoute: action.payload.tarifAcceptLongRoute,
                    paySafeTax: action.payload.tarifPaySafeTax
                }
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const baseStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( payload: PreAuthGlobalDataType ) => ( {
        type: 'base-store-reducer/SET-VALUES',
        payload,
    } as const ),
}

/* САНКИ */

export type BaseStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>


// запрос и сохранение данных от сервера
export const preAuthDataSet = (): BaseStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            // запрос на данные
            const response = await preAuthApi.getGlobalData()

            // сохранение данных в store
            if (response.length > 0) {
                dispatch(baseStoreActions.setValues(response[0]))
            }
            // здесь любое сообщение будет ошибкой
            if (response.message) {
                dispatch(globalModalStoreActions.setTextMessage(response.message))
            }

        } catch (error: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error)))
        }
    }