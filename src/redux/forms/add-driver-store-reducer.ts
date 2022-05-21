import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {AddDriverCardType} from '../../types/form-types';


const initialState = {
    label: {
        driverFIO: 'Сотрудник',
        driverTransport: 'Транспорт',
        driverTrailer: 'Прицеп',
        driverStavka: 'Ставка, тн.км.',
        driverSumm: 'Сумма, руб.',
        driverRating: 'Рейсы, шт.',
        driverTax: 'Налог',
        driverPhoto: undefined,
        driverTransportPhoto: undefined,
        driverTrailerPhoto: undefined,
    } as AddDriverCardType,

    initialValues: {
        driverFIO: undefined,
        driverTransport: undefined,
        driverTrailer: undefined,
        driverStavka: undefined,
        driverSumm: undefined,
        driverRating: undefined,
        driverTax: undefined,
        driverPhoto: undefined,
        driverTransportPhoto: undefined,
        driverTrailerPhoto: undefined,
    } as AddDriverCardType,

}

export type AddDriverStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof addDriverStoreActions>

export const addDriverStoreReducer = ( state = initialState, action: ActionsType ): AddDriverStoreReducerStateType => {

    switch (action.type) {

        case 'add-driver-store-reducer/SET-VALUES': {
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
export const addDriverStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: ( initialValues: AddDriverCardType ) => ( {
        type: 'add-driver-store-reducer/SET-VALUES',
        initialValues,
    } as const ),

}

/* САНКИ */

export type AddDriverStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


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
