import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'

type contentType = { id: number, title: string }[]

const initialState = {
    shippers: {
        label: 'Грузоотправители',
        placeholder: 'Название',
        content: [
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазвание ЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
        ],
    },
    employees: {
        label: 'Сотрудники',
        placeholder: 'Ф.И.О.',
        content: [
            {id: 0, title: 'Ф.И.О.'},
            {id: 2, title: 'Дзюба Иван Иванович'},
            {id: 44, title: 'Мальденштамм Изя Харизмович'},
            {id: 4, title: 'Петров Анвар Васильевич'},
        ],
    },
    transport: {
        label: 'Транспорт',
        placeholder: 'Гос. номер',
        content: [{id: 0, title: 'Гос. номер'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНаз ваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБеге моты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крокодилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'},
            {id: 10, title: 'Название'},
            {id: 1, title: 'Черепахи'},
            {id: 2, title: 'крок одилыНазваниеЧерепахиБегемоты'},
            {id: 5, title: 'Бегемоты'}],
    },
    trailer: {
        label: 'Прицеп',
        placeholder: 'Гос. номер',
        content: [
            {id: 0, title: 'Прицеп такой-то'},
            {id: 1, title: 'Прицеп такой-то 2'},
            {id: 2, title: 'Прицеп такой-то 3'},
            {id: 3, title: 'Прицеп такой-то 44'},
        ],
    },
    consignees: {
        label: 'Грузополучатели',
        placeholder: 'Название',
        content: [{id: 1, title: 'Один из'}],
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

