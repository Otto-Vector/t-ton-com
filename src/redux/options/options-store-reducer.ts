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
        content: [] as OptionsLabelType[],
    },
    transport: {
        label: 'Транспорт',
        placeholder: 'Поиск по гос.номеру',
        content: [] as OptionsLabelType[],
    },
    trailer: {
        label: 'Прицеп',
        placeholder: 'Поиск по гос.номеру',
        content: [] as OptionsLabelType[],
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

