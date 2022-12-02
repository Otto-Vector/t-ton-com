import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ResponseToRequestCardType, ValidateType} from '../../types/form-types';
import {syncValidators} from '../../utils/validators';
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api';

const testInitialValues = {} as ResponseToRequestCardType


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

    initialValues: {
        idEmployee: undefined,
        idTransport: undefined,
        idTrailer: undefined,
        responseStavka: undefined,
        responsePrice: undefined,
        responseTax: undefined,
    } as ResponseToRequestCardType,

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

export type AddDriverStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const getTestAddDriverValues = ( responseNumber?: number ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(addDriverStoreActions.setIsFetching(true))
        try {
            const response = testInitialValues
            dispatch(addDriverStoreActions.setValues(response))
        } catch (e) {
            alert(e)
        }
        dispatch(addDriverStoreActions.setIsFetching(false))
    }

export const setAddDriverValues = ( addDriverValues: ResponseToRequestCardType ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
    try {
        const requestCarrierId = getState().authStoreReducer.authID
        const response = responseToRequestApi.createOneResponseToRequest({
            ...addDriverValues, requestCarrierId
        })
        console.log(response)

        } catch (e) {
            alert(e)
        }
    }