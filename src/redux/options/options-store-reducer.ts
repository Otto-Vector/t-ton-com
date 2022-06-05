import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ShippersCardType} from '../../types/form-types';

export type OptionsLabelType = { id: number, title?: string }

const initialState = {
    shippers: {
        label: 'Грузоотправители',
        placeholder: 'Поиск по названию',
        content: [] as OptionsLabelType[],
    },
    employees: {
        label: 'Сотрудники',
        placeholder: 'Поиск по Ф.И.О.',
        content: [
            { id: 2, title: 'Дзюба Иван Иванович' },
            { id: 44, title: 'Мальденштамм Изя Харизмович' },
            { id: 4, title: 'Петров Анвар Васильевич' },
            { id: 21, title: 'Беспалов Артем Юрьевич' },
            { id: 22, title: 'Владимиров Аким Платонович' },
            { id: 23, title: 'Кондратьев Виссарион Даниилович' },
            { id: 24, title: 'Белоусов Людвиг Эльдарович' },
            { id: 25, title: 'Горшков Вольдемар Миронович' },
            { id: 62, title: 'Зиновьев Вилен Лукьевич' },
            { id: 72, title: 'Симонов Тарас Станиславович' },
            { id: 82, title: 'Поляков Руслан Рудольфович' },
            { id: 92, title: 'Ершов Флор Леонидович' },
            { id: 20, title: 'Сазонов Эрнест Сергеевич' },
        ],
    },
    transport: {
        label: 'Транспорт',
        placeholder: 'Поиск по гос.номеру',
        content: [] as OptionsLabelType[],
    },
    trailer: {
        label: 'Прицеп',
        placeholder: 'Поиск по гос.номеру',
        content: [
            { id: 15, title: 'Прицеп такой-то' },
            { id: 1, title: 'Прицеп такой-то 2' },
            { id: 2, title: 'Прицеп такой-то 3' },
            { id: 3, title: 'Прицеп такой-то 44' },
            { id: 105, title: '777 05' },
            { id: 10, title: '3358 5522' },
            { id: 20, title: 'Прицеп такой-то 305' },
            { id: 33, title: 'Прицеп такой-то 404' },
        ],
    },
    consignees: {
        label: 'Грузополучатели',
        placeholder: 'Поиск по названию',
        content: [] as OptionsLabelType[],
    },
}

export type OptionsStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof optionsStoreActions>

export const optionsStoreReducer = ( state = initialState, action: ActionsType ): OptionsStoreReducerStateType => {

    switch (action.type) {

        case 'options-store-reducer/SET-SHIPPERS': {
            return {
                ...state,
                shippers: {
                    ...state.shippers,
                    content: [
                        ...action.shippers.map(( { id, title } ) => ( { id, title } )),
                    ],
                },
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const optionsStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setShippers: ( shippers: ShippersCardType[] ) => ( {
        type: 'options-store-reducer/SET-SHIPPERS',
        shippers,
    } as const ),
}

/* САНКИ */

export type OptionsStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


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

