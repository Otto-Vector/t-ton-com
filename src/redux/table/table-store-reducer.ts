import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {OneRequestTableType} from '../../types/form-types';
import {GetActionsTypes} from '../../types/ts-utils';


const initialState = {
    initialValues: {
        requestNumber: undefined,
        cargoType: undefined,
        shipmentDate: undefined,
        distance: undefined,
        route: undefined,
        answers: undefined,
        price: 100,
    },
    content: [] as OneRequestTableType[],
}

export type TableStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof tableStoreActions>

export const tableStoreReducer = ( state = initialState, action: ActionsType ): TableStoreReducerStateType => {

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
                content: [ ...state.content.filter(( { requestNumber } ) => requestNumber !== action.requestNumber) ],
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
    setValues: ( content: OneRequestTableType[] ) => ( {
        type: 'table-store-reducer/SET-VALUES',
        content,
    } as const ),
    deleteRow: ( requestNumber: number ) => ( {
        type: 'table-store-reducer/DELETE-ROW',
        requestNumber,
    } as const ),

}

/* САНКИ */

export type TableStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getValuesForTable = (): TableStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            // dispatch( tableStoreActions.setValues(createTableValues) )
        } catch (e) {
            alert(e)
        }

    }

