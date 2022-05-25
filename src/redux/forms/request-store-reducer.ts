import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {CargoType} from '../../types/form-types';
import {addOneDay} from '../../utils/parsers';


export type OneRequestType = {
    id: number | undefined,
    requestNumber: number | undefined, // номер заявки
    requestDate: undefined | Date, // дата создания заявки
    cargoComposition: undefined | string, // вид груза
    shipmentDate: undefined | Date, // дата погрузки
    cargoType: undefined | CargoType, // тип груза
    customer: undefined | number, // заказчик
    distance: undefined | number, // расстояние
    shipper: undefined | string, // грузоотправитель
    consignee: undefined | string, // грузополучатель
    carrier: undefined | string, // перевозчик
    driver: undefined | string, // водитель
    note: undefined | string, // примечание
}


const initialState = {

    cargoСomposition: [
        'Мазут топочный М-100 ТУ2012-110712',
        'Битум нефтяной дорожный вязкий БНД 90/130',
        'Битум нефтяной дорожный вязкий БНД 100/130',
        'Битум нефтяной дорожный БНД 100/130',
        'Битум БНД 90/130 дорожный вязкий, в танк-контейнере',
        'Битум 90/130, фасованный в кловертейнеры',
        'Мазут топочный марки М-100 малозольный 0,5% серности',
        'Битум 90/130, фасованный в кловертейнеры',
    ],
    label: {
        id: undefined,
        requestNumber: 'Номер заявки',
        requestDate: 'Дата создания заявки',
        cargoComposition: 'Вид груза',
        shipmentDate: 'Дата погрузки',
        distance: 'Расстояние',
        cargoType: 'Тип груза',
        customer: 'Заказчик',
        shipper: 'Грузоотправитель',
        consignee: 'Грузополучатель',
        carrier: 'Перевозчик',
        driver: 'Водитель',
        note: 'Примечание',
    } as Record<keyof OneRequestType, string | undefined>,
    placeholder: {
        id: undefined,
        requestNumber: '№',
        requestDate: 'ДД-ММ-ГГГГ',
        cargoComposition: 'Полное наименование груза',
        shipmentDate: 'ДД-ММ-ГГГГ',
        distance: 'авто-расчет',
        cargoType: 'Тип груза',
        customer: 'Наименование организации заказчика',
        shipper: 'Наименование организации Владельца груза',
        consignee: 'Наименование организации Грузополучателя',
        carrier: 'Наименование организации Перевозчика',
        driver: 'ФИО, Марка авто, Марка прицепа, тн',
        note: 'дополнительные данные',
    } as Record<keyof OneRequestType, string | undefined>,
    initialValues: {
        id: 0,
        requestNumber: undefined,
        requestDate: undefined,
        cargoComposition: undefined,
        shipmentDate: undefined,
        cargoType: undefined,
        customer: undefined,
        distance: undefined,
        shipper: undefined,
        consignee: undefined,
        carrier: undefined,
        driver: undefined,
        note: undefined,
    } as OneRequestType,

    content: [
        {
            id: 999,
            requestNumber: 999,
            requestDate: new Date(),
            cargoComposition: '',
            shipmentDate: addOneDay(new Date()),
            cargoType: 'Битумовоз',
            customer: 1,
            shipper: 3,
            consignee: 2,
            carrier: 4,
            driver: 1,
            distance: 1120,
            driverPrice: undefined,
            note: 'что-то там',
            answers: Math.floor(Math.random() * 99),
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date(),
            distance: 120,
            route: 'Пенза в Самара',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Контейнеровоз',
            requestDate: new Date(),
            distance: 80,
            route: 'Иркутск в Усолье-Сибирское',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date(),
            distance: 3760,
            route: 'Пенза в Ростов-на-Дону',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Бензовоз',
            requestDate: new Date(),
            distance: 4790,
            route: 'Красноярск в Пенза',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Цементовоз',
            requestDate: new Date(),
            distance: 1680,
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Газовоз',
            requestDate: new Date(),
            distance: Math.floor(Math.random() * 9999),
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: addOneDay(new Date()),
            distance: 1120,
            route: 'Ангарск в Чита',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: addOneDay(new Date()),
            distance: 120,
            route: 'Пенза в Самара',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Контейнеровоз',
            requestDate: new Date(),
            distance: 80,
            route: 'Иркутск в Усолье-Сибирское',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date(),
            distance: 3760,
            route: 'Пенза в Ростов-на-Дону',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Бензовоз',
            requestDate: new Date(),
            distance: 4790,
            route: 'Красноярск в Пенза',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Цементовоз',
            requestDate: addOneDay(new Date()),
            distance: 100,
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Газовоз',
            requestDate: new Date(),
            distance: Math.floor(Math.random() * 9999),
            route: 'Пенза в Яндекс',
            answers: Math.floor(Math.random() * 99),
            driverPrice: 0,
        },
    ],
}

export type RequestStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof requestStoreActions>

export const requestStoreReducer = ( state = initialState, action: ActionsType ): RequestStoreReducerStateType => {

    switch (action.type) {

        case 'request-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const requestStoreActions = {
    setValues: ( initialValues: RequestStoreReducerStateType['initialValues'] ) => ( {
        type: 'request-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),

}

/* САНКИ */

export type RequestStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): BaseStoreReducerThunkActionType =>
//     async ( dispatch ) => {
//         // dispatch( requestFormActions.setIcons( null ) )
//         try {
//             const response = await getIconsFromApi( { domain } )
//             dispatch( baseStoreActions.setIcons( domain, response ) )
//         } catch (e) {
//             alert( e )
//             // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
//         }
//
//     }

