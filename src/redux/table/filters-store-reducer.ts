import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'


export const initialFiltersState = {
    todayFilter: '',
    tomorrowFilter: '',
}

export type FiltersStoreReducerStateType = typeof initialFiltersState

type ActionsType = GetActionsTypes<typeof filtersStoreActions>

export const filtersStoreReducer = ( state = initialFiltersState, action: ActionsType ): FiltersStoreReducerStateType => {

    switch (action.type) {

        case 'filters-store-reducer/SET-TODAY-FILTER': {
            return {
                ...state,
                todayFilter: action.todayFilter
            }
        }
        case 'filters-store-reducer/SET-TOMORROW-FILTER': {
            return {
                ...state,
                tomorrowFilter: action.tomorrowFilter
            }
        }
        case 'filters-store-reducer/SET-CLEAR-FILTER': {
            return {
                ...action.initial
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const filtersStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setTodayFilter: ( todayFilter: string ) => ( {
        type: 'filters-store-reducer/SET-TODAY-FILTER',
        todayFilter,
    } as const ),
    setTomorrowFilter: ( tomorrowFilter: string ) => ( {
        type: 'filters-store-reducer/SET-TOMORROW-FILTER',
        tomorrowFilter,
    } as const ),
    setClearFilter: ( initial: FiltersStoreReducerStateType ) => ( {
        type: 'filters-store-reducer/SET-CLEAR-FILTER',
        initial,
    } as const ),


}

/* САНКИ */

export type FiltersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): FiltersStoreReducerThunkActionType =>
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

