import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'


const initialState = {

    header: {
        companyName: 'Транспортно-Логистическая Компания',
        baseHref: 'http://t-ton.com',
        directPhoneNumber: '+79-500-510-520',
    },

    footer: {
        linkToOfer: '#oferIsHere',
    },

    links: [
        { domain: 'https://yandex.ru', title: 'Поисковик' },
        { domain: 'https://github.com', title: 'Хранение' },
        { domain: 'https://google.ru', title: 'Другой поисковик' },
    ],

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
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const baseStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setHref: ( href: string ) => ( {
        type: 'base-store-reducer/CHANGE-URL',
        href,
    } as const ),
}

/* САНКИ */

export type BaseStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>
