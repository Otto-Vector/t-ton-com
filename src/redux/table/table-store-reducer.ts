import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {addOneDay} from '../../utils/parsers';
import React from 'react';


type OneTableRow = {
    requestNumber: number
    cargoType: string
    requestDate: string
    distance: number
    route: string
    answers: number
    open: React.ReactElement
    subRows: undefined
}

const initialState = {
    content: [
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: addOneDay(new Date()).toLocaleDateString(),
            distance: 1120,
            route: 'Ангарск в Чита',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 120,
            route: 'Пенза в Самара',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Контейнеровоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 80,
            route: 'Иркутск в Усолье-Сибирское',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 3760,
            route: 'Пенза в Ростов-на-Дону',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Бензовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 4790,
            route: 'Красноярск в Пенза',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Цементовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 1680,
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Газовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: Math.floor(Math.random() * 9999),
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
           subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: addOneDay(new Date()).toLocaleDateString(),
            distance: 1120,
            route: 'Ангарск в Чита',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: addOneDay(new Date()).toLocaleDateString(),
            distance: 120,
            route: 'Пенза в Самара',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Контейнеровоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 80,
            route: 'Иркутск в Усолье-Сибирское',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Битумовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 3760,
            route: 'Пенза в Ростов-на-Дону',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Бензовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: 4790,
            route: 'Красноярск в Пенза',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Цементовоз',
            requestDate: addOneDay(new Date()).toLocaleDateString(),
            distance: 100,
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
        {
            requestNumber: Math.floor(Math.random() * 999),
            cargoType: 'Газовоз',
            requestDate: new Date().toLocaleDateString(),
            distance: Math.floor(Math.random() * 9999),
            route: 'Пенза в Новосибирск',
            answers: Math.floor(Math.random() * 99),
            subRows: undefined,
        },
    ] as OneTableRow[],
}

export type TableStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof tableStoreActions>

export const tableStoreReducer = (state = initialState, action: ActionsType): TableStoreReducerStateType => {

    switch (action.type) {

        case 'table-store-reducer/SET-VALUES': {
            return {
                ...state,
                content: action.content,
            }
        }
        case 'table-store-reducer/DELETE-ROW': {
            return {
                ...state,
                content: [...state.content.filter(({requestNumber}) => requestNumber !== action.requestNumber)],
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const tableStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setValues: (content: OneTableRow[]) => ({
        type: 'table-store-reducer/SET-VALUES',
        content,
    } as const),
    deleteRow: (requestNumber: number) => ({
        type: 'table-store-reducer/DELETE-ROW',
        requestNumber,
    } as const),

}

/* САНКИ */

export type TableStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): TableStoreReducerThunkActionType =>
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

