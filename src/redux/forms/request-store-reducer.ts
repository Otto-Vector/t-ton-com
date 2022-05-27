import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {cargoType, CargoType} from '../../types/form-types'
import {randArrayValue, ranFloorMax, randMinMax, randomDifferentIntegersArrayCreator} from '../../utils/random-utils'


export type OneRequestType = {
    id: number | undefined,
    requestNumber: number | undefined, // номер заявки
    requestDate: undefined | Date, // дата создания заявки
    cargoComposition: undefined | string, // вид груза
    shipmentDate: undefined | Date, // дата погрузки
    cargoType: undefined | CargoType, // тип груза
    customer: undefined | number, // заказчик
    shipper: undefined | number, // грузоотправитель
    consignee: undefined | number, // грузополучатель
    carrier: undefined | number, // перевозчик
    driver: undefined | number, // водитель
    distance: undefined | number, // расстояние
    note: undefined | string, // примечание
    answers: number[] | undefined // количество ответов от водителей // что-то вроде массива с айдишками
    driverPrice: number | undefined // стоимость перевозки
}

const cargoСomposition = [
    'Мазут топочный М-100 ТУ2012-110712',
    'Битум нефтяной дорожный вязкий БНД 90/130',
    'Битум нефтяной дорожный вязкий БНД 100/130',
    'Битум нефтяной дорожный БНД 100/130',
    'Битум БНД 90/130 дорожный вязкий, в танк-контейнере',
    'Битум 90/130, фасованный в кловертейнеры',
    'Мазут топочный марки М-100 малозольный 0,5% серности',
    'Битум 90/130, фасованный в кловертейнеры',
]

const initialState = {

    cargoСomposition: cargoСomposition,

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
            requestDate: new Date( 2022, 5 , ranFloorMax( 29 ) ),
            cargoComposition: randArrayValue( cargoСomposition ),
            shipmentDate: new Date( 2022, 6, ranFloorMax( 29 ) ),
            cargoType: randArrayValue(cargoType as string[]),
            customer: ranFloorMax(9),
            shipper: ranFloorMax(9),
            consignee: ranFloorMax(9),
            carrier: ranFloorMax(9),
            driver: ranFloorMax(9),
            distance: ranFloorMax(1200),
            note: 'что-то там',
            answers: randomDifferentIntegersArrayCreator(ranFloorMax(9))(),
            driverPrice: undefined,
        },

    ] as OneRequestType[],
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
        case 'request-store-reducer/SET-CONTENT': {
            return {
                ...state,
                content: action.content
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
    setContent: ( content: OneRequestType[] ) => ( {
        type: 'request-store-reducer/SET-CONTENT',
        content,
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

