import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'


export type OneRequestTableType = {
    requestNumber: number | undefined
    cargoType: string | undefined
    shipmentDate: Date | undefined
    distance: number | undefined
    route: string | undefined
    answers: number | undefined
    price: number | undefined
}


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
    async ( dispatch , getState) => {
        try {
            const allRequests = getState().requestStoreReducer.content
            const allShippers = getState().shippersStoreReducer.content
            const allConsignee = getState().consigneesStoreReducer.content
             let createTableValues = allRequests?.map((
            { requestNumber, shipmentDate, cargoType, shipper, consignee, distance, answers } ) =>
            ( {
                requestNumber, cargoType, shipmentDate, distance,
                answers: answers?.length, price: 100,
                route: allShippers.filter(( { id } ) => id === shipper)[0]?.city +' в '
                    + allConsignee.filter(( { id } ) => id === consignee)[0]?.city,
            } )) || [getState().tableStoreReducer.initialValues]
            dispatch( tableStoreActions.setValues(createTableValues) )
        } catch (e) {
            alert( e )
        }

    }

