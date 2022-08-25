import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ResponseToRequestCardType, ValidateType} from '../../types/form-types';
import {composeValidators, maxRangeNumber, required} from '../../utils/validators';

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
        idEmployee: composeValidators(required),
        idTransport: composeValidators(required),
        idTrailer: undefined,
        responseStavka: composeValidators(required, maxRangeNumber(3000)) as ValidateType,
    },

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
            // const response = await getIconsFromApi( { domain } )
            const response = testInitialValues
            dispatch(addDriverStoreActions.setValues(response))
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
        dispatch(addDriverStoreActions.setIsFetching(false))
    }

