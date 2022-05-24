import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {CargoType} from '../../types/form-types';


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
        requestNumber: 'номер заявки',
        requestDate: 'дата создания заявки',
        cargoComposition: 'вид груза',
        shipmentDate: 'дата погрузки',
        distance: 'расстояние',
        cargoType: 'тип груза',
        customer: 'заказчик',
        shipper: 'грузоотправитель',
        consignee: 'грузополучатель',
        carrier: 'перевозчик',
        driver: 'водитель',
        note: 'примечание',
    } as Record<keyof OneRequestType, string | undefined>,
    placeholder: {
        id: undefined,
        requestNumber: '№',
        requestDate: 'ДД-ММ-ГГГГ',
        cargoComposition: 'Полное наименование груза',
        shipmentDate: 'ДД-ММ-ГГГГ',
        distance: 'Авто расчет',
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

