import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {TrailerCardType, ValidateType} from '../../types/form-types'
import {
    composeValidators,
    maxLength,
    maxRangeNumber,
    required
} from '../../utils/validators'


const initialState = {
        label: {
        trailerNumber: 'Гос. номер авто',
        trailerTrademark: 'Марка авто',
        trailerModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        trailerImage: 'Фото транспорта',
    } as TrailerCardType,

    maskOn: {
        trailerNumber: undefined, // просто текст
        trailerTrademark: undefined, // просто текст
        trailerModel: undefined, // просто текст
        pts: undefined, // просто фото
        dopog: undefined, // просто фото
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        trailerImage: undefined, // просто текст
    } as TrailerCardType,

    initialValues: {
        trailerNumber: undefined,
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        trailerImage: undefined,
    } as TrailerCardType,

    validators: {
        trailerNumber: composeValidators(required, maxLength(20)),
        trailerTrademark: composeValidators(required, maxLength(20)),
        trailerModel: composeValidators(required, maxLength(20)),
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: undefined,
        trailerImage: undefined,
    } as TrailerCardType<ValidateType>,

}

export type TrailerStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof trailerStoreActions>

export const trailerStoreReducer = ( state = initialState, action: ActionsType ): TrailerStoreReducerStateType => {

    switch (action.type) {

        case 'trailer-store-reducer/SET-VALUES': {
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
export const trailerStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( initialValues: TrailerCardType ) => ( {
        type: 'trailer-store-reducer/SET-VALUES',
        initialValues,
    } as const ),

}

/* САНКИ */

export type TrailerStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): TrailerStoreReducerThunkActionType =>
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

