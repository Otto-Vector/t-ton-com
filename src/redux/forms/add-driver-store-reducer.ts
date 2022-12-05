import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ResponseToRequestCardType, ValidateType} from '../../types/form-types';
import {syncValidators} from '../../utils/validators';
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {getAllRequestsAPI} from './request-store-reducer';



const initialState = {
    isFetching: false,
    label: {
        idEmployee: 'Сотрудник',
        idTransport: 'Транспорт',
        idTrailer: 'Прицеп',
        responseStavka: 'Ставка, тн.км.',
        responsePrice: 'Сумма, руб.',
        responseTax: 'Налог',
    } as ResponseToRequestCardType,

    initialValues: {} as ResponseToRequestCardType,

    placeholder: {
        idEmployee: 'Поиск водителя...',
        idTransport: 'Поиск транспорта...',
        idTrailer: 'Поиск прицепа...',
        responseStavka: '0.00 руб',
    },

    maskOn: {
        responseStavka: undefined,
    },

    validators: {
        idEmployee: syncValidators.required,
        idTransport: syncValidators.required,
        idTrailer: undefined,
        responseStavka: syncValidators.responseStavka,
    } as ResponseToRequestCardType<ValidateType>,

}

export type AddDriverStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof addDriverStoreActions>

export const addDriverStoreReducer = ( state = initialState, action: ActionsType ): AddDriverStoreReducerStateType => {

    switch (action.type) {

        case 'add-driver-store-reducer/SET-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const addDriverStoreActions = {
    // установка значения в карточку отображения водителя
    setValues: ( initialValues: ResponseToRequestCardType ) => ( {
        type: 'add-driver-store-reducer/SET-VALUES',
        initialValues,
    } as const ),
    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'add-driver-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
}

/* САНКИ */

export type AddDriverStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>


export const setOneResponseToRequest = ( addDriverValues: ResponseToRequestCardType<string> ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(addDriverStoreActions.setIsFetching(true))
        try {
            const requestCarrierId = getState().authStoreReducer.authID
            const response = await responseToRequestApi.createOneResponseToRequest({
                ...addDriverValues, requestCarrierId,
            })
            console.log(response)
            dispatch(getAllRequestsAPI())
        } catch (e) {
            dispatch(addDriverStoreActions.setIsFetching(false))
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(
                // @ts-ignore-next-line
                e.response.data)))
        }
        dispatch(addDriverStoreActions.setIsFetching(false))
    }

// удаление ответов на заявки, из-за принятия на заявке
export const removeResponseToRequestsBzAcceptRequest = ( requestNumber: string ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await responseToRequestApi.deleteSomeResponseToRequest({ requestNumber })
            console.log(response)
        } catch (e) {
            console.log(JSON.stringify(
                // @ts-ignore-next-line
                e.response.data))
        }
    }

// удаление ответов на заявки, привязанных к сотруднику
export const removeResponseToRequestsBzEmployee = ( responseId: string ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await responseToRequestApi.deleteSomeResponseToRequest({ responseId })
            console.log(response)
        } catch (e) {
            console.log(JSON.stringify(
                // @ts-ignore-next-line
                e.response.data))
        }
    }