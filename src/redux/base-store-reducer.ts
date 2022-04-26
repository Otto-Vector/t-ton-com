import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
// import {getIconsFromApi, GetIconsType} from '../api/get-icons'

const initialState = {
    header: {
        companyName: 'Транспортно-Логистическая Компания',
        baseHref: 'http://t-ton.com',
        directPhoneNumber: '+79-500-510-520'
    },
    footer: {
        linkToOfer: '#oferIsHere'
    },
    links: [
        { domain: 'https://yandex.ru', title: 'Поисковик' },
        { domain: 'https://github.com', title: 'Хранение' },
        { domain: 'https://google.ru', title: 'Другой поисковик' }
    ],
    routes: {
        login : '/login',
        create: '/create',
        search: '/search',
        status: '/status',
        history: '/history',
        map: '/maps',
        options: '/options'
    }
}

export type BaseStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof baseStoreActions>

export const baseStoreReducer = ( state = initialState, action: ActionsType ): BaseStoreReducerStateType => {

    switch (action.type) {

        case 'base-store-reducer/CHANGE-URL': {
            return {
                ...state,
                header: { ...state.header, baseHref: action.href },
            }
        }
        // case 'base-store-reducer/CHANGE-ICONS': {
        //     return {
        //         ...state,
        //         links: state.links.map( ( item ) => {
        //             return item.domain === action.domain ? { domain: item.domain, icon: action.icon } : item
        //         } )
        //     }
        // }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const baseStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setBooks: ( href: string ) => ( {
        type: 'base-store-reducer/CHANGE-URL',
        href,
    } as const ),
    setIcons: ( domain: string, icon: string ) => ( {
        type: 'base-store-reducer/CHANGE-ICONS',
        domain, icon
    } as const ),
}

/* САНКИ */

export type BaseStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


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

