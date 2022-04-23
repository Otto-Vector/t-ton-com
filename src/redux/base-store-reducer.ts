import { ThunkAction } from 'redux-thunk'
import { AppStateType, GetActionsTypes } from './redux-store'

const initialState = {
companyName : 'Транспортно-Логистическая Компания',
baseHref : 'http://t-ton.com'
}

export type BaseStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof requestFormActions>

export const baseStoreReducer = ( state = initialState, action: ActionsType ): BaseStoreReducerStateType => {

    switch (action.type) {

        case 'base-store-reducer/CHANGE-URL': {
            return {
                ...state,
                baseHref: action.href,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const requestFormActions = {
    // установка значения в карточки пользователей одной страницы
    setBooks: ( href: string ) => ({
        type: 'base-store-reducer/CHANGE-URL',
        href,
    } as const),

}

/* САНКИ */

export type BaseStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getOneBookFromApi = ( bookId: string ): UsersReducerThunkActionType =>
//     async ( dispatch ) => {
//         dispatch( requestFormActions.setApiError( null ) )
//         try {
//             const response = await getOneBookOverIdFromApi( bookId )
//             dispatch( requestFormActions.setFoundedBook( response as BookInfoType ) )
//         } catch (e) {
//             dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
//         }
//
//     }

