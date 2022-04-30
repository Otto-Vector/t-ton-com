import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'

const initialState = {
    isAuth: true,
    authID: 'sfadsfsadfa',
    isAvailableSMSrequest: false,
    isFetching: false,
}

export type AuthStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof authStoreActions>

export const authStoreReducer = (state = initialState, action: ActionsType): AuthStoreReducerStateType => {

    switch (action.type) {

        case 'auth-store-reducer/SET-IS-AUTH': {
            return {
                ...state,
                isAuth: action.isAuth,
            }
        }
        case 'auth-store-reducer/SET-IS-AVALIABLE-SMS-REQUEST': {
            return {
                ...state,
                isAvailableSMSrequest: action.isAvailableSMSrequest
            }
        }
        case 'auth-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                isFetching: action.isFetching
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const authStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setIsAuth: (isAuth: boolean) => ({
        type: 'auth-store-reducer/SET-IS-AUTH',
        isAuth,
    } as const),
    setIsAvailableSMSRequest: (isAvailableSMSrequest: boolean) => ({
        type: 'auth-store-reducer/SET-IS-AVALIABLE-SMS-REQUEST',
        isAvailableSMSrequest: isAvailableSMSrequest,
    } as const),
    setIsFetching: (isFetching: boolean) => ({
        type: 'auth-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const),

}

/* САНКИ */

export type AuthStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const fakeAuthFetching = (): AuthStoreReducerThunkActionType =>
    async (dispatch, getState) => {
        dispatch(authStoreActions.setIsFetching(true))
        const second = await setTimeout( ()=> {
            dispatch(authStoreActions.setIsFetching(false))}, 1000)
    }
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

