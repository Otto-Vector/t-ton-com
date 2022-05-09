import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'

type contentType = { id: number, title: string }[]

const initialState = {
    shippers: {
        label: 'Грузоотправители',
        placeholder: 'Поиск по названию',
        content: [
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазвание ЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 19, title: 'Пауки'},
            {id: 28, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 57, title: 'Бегемоты'},
            {id: 106, title: 'Название'},
            {id: 15, title: 'Черепахи'},
            {id: 24, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 53, title: 'Бегемоты'},
            {id: 102, title: 'Название'},
            {id: 11, title: 'Черепахи'},
            {id: 20, title: 'крокодилы НазваниеЧерепахиБегемоты'},
            {id: 54, title: 'Бегемоты'},
            {id: 130, title: 'Название'},
            {id: 17, title: 'Черепахи'},
            {id: 27, title: 'крокодилыНазваниеЧерепахи Бегемоты'},
            {id: 55, title: 'Бегемоты'},
            {id: 150, title: 'Название'},
            {id: 91, title: 'Холодильник'},
            {id: 92, title: 'крокодилыНазвание ЧерепахиБегемоты'},
            {id: 95, title: 'Кит'},
        ],
    },
    employees: {
        label: 'Сотрудники',
        placeholder: 'Поиск по Ф.И.О.',
        content: [
            {id: 2, title: 'Дзюба Иван Иванович'},
            {id: 44, title: 'Мальденштамм Изя Харизмович'},
            {id: 4, title: 'Петров Анвар Васильевич'},
        ],
    },
    transport: {
        label: 'Транспорт',
        placeholder: 'Поиск по гос.номеру',
        content: [
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНаз ваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 11, title: 'Черепахи'},
            {id: 22, title: 'крокодилыНазваниеЧерепахиБеге моты'},
            {id: 54, title: 'Бегемоты'},
            {id: 140, title: 'Название'},
            {id: 12, title: 'Черепахи'},
            {id: 27, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 56, title: 'Бегемоты'},
            {id: 180, title: 'Название'},
            {id: 15, title: 'Черепахи'},
            {id: 23, title: 'крок одилыНазваниеЧерепахиБегемоты'},
            {id: 45, title: 'Бегемоты'}],
    },
    trailer: {
        label: 'Прицеп',
        placeholder: 'Поиск по гос.номеру',
        content: [
            {id: 0, title: 'Прицеп такой-то'},
            {id: 1, title: 'Прицеп такой-то 2'},
            {id: 2, title: 'Прицеп такой-то 3'},
            {id: 3, title: 'Прицеп такой-то 44'},
        ],
    },
    consignees: {
        label: 'Грузополучатели',
        placeholder: 'Поиск по названию',
        content: [
            {id: 1, title: 'Один из'}
        ],
    },
}

export type OptionsStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof optionsStoreActions>

export const optionsStoreReducer = (state = initialState, action: ActionsType): OptionsStoreReducerStateType => {

    switch (action.type) {

        case 'options-store-reducer/SET-SHIPPERS': {
            return {
                ...state,
                shippers: {
                    ...state.shippers,
                    content: [
                        state.shippers.content[0], // оставляем нулевую запись
                        ...action.shippers,
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
    setShippers: (shippers: contentType) => ({
        type: 'options-store-reducer/SET-SHIPPERS',
        shippers,
    } as const),

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

