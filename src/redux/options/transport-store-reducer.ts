import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {TransportCardType, ValidateType} from '../../types/form-types'
import {
    composeValidators,
    maxLength,
    maxRangeNumber,
    required
} from '../../utils/validators'


const initialState = {
     label: {
        transportNumber: 'Гос. номер авто',
        transportTrademark: 'Марка авто',
        transportModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        transportImage: 'Фото транспорта',
    } as TransportCardType,

    maskOn: {
        transportNumber: undefined, // просто текст
        transportTrademark: undefined, // просто текст
        transportModel: undefined, // просто текст
        pts: undefined, // просто фото
        dopog: undefined, // просто фото
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        transportImage: undefined, // просто текст
    } as TransportCardType,

    initialValues: {
        transportNumber: undefined,
        transportTrademark: undefined,
        transportModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        transportImage: undefined,
    } as TransportCardType,

    validators: {
        transportNumber: composeValidators(required, maxLength(20)),
        transportTrademark: composeValidators(required, maxLength(20)),
        transportModel: composeValidators(required, maxLength(20)),
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: undefined,
        transportImage: undefined,
    } as TransportCardType<ValidateType>,

}

export type TransportStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof transportStoreActions>

export const transportStoreReducer = ( state = initialState, action: ActionsType ): TransportStoreReducerStateType => {

    switch (action.type) {

        case 'transport-store-reducer/SET-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const transportStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( initialValues: TransportCardType ) => ( {
        type: 'transport-store-reducer/SET-VALUES',
        initialValues,
    } as const ),

}

/* САНКИ */

export type TransportStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): TransportStoreReducerThunkActionType =>
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

