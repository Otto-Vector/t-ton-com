import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {SelectOptionsType} from '../ui/common/form-selector/selector-utils';


const initialState = {
    serverURL: 'https://server.t-ton.com/',
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

    drivingCategorySelector: [
        { key: 'A', value: 'A', label: 'A - Мотоциклы' },
        { key: 'A1', value: 'A1', label: 'A1 - Легкие мотоциклы' },
        { key: 'B', value: 'B', label: 'B - Легковые автомобили, небольшие грузовики' },
        { key: 'BE', value: 'BE', label: 'BE - Легковые автомобили с прицепом' },
        { key: 'B1', value: 'B1', label: 'B1 - Трициклы, Квадрициклы' },
        { key: 'C', value: 'C', label: 'C - Грузовые автомобили' },
        { key: 'CE', value: 'CE', label: 'CE - Грузовые автомобили с прицепом' },
        { key: 'C1', value: 'C1', label: 'C1 - Средние грузовики' },
        { key: 'C1E', value: 'C1E', label: 'C1E - Средние грузовики с прицепом' },
        { key: 'D', value: 'D', label: 'D - Автобусы' },
        { key: 'DE', value: 'DE', label: 'DE - Автобусы с прицепом' },
        { key: 'D1', value: 'D1', label: 'D1 - Небольшие автобусы' },
        { key: 'D1E', value: 'D1E', label: 'D1E - Небольшие автобусы с прицепом' },
        { key: 'M', value: 'M', label: 'M - Мопеды' },
        { key: 'Tm', value: 'Tm', label: 'Tm - Трамваи' },
        { key: 'Tb', value: 'Tb', label: 'Tb - Троллейбусы' },
    ] as SelectOptionsType[],
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
