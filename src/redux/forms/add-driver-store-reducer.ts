import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ResponseToRequestCardType, ValidateType} from '../../types/form-types';
import {composeValidators, maxRangeNumber, required} from '../../utils/validators';

const testInitialValues = {
    driverFIO: '1',
    driverTransport: '2',
    driverTrailer: '11',
    driverStavka: '4',
    driverSumm: undefined,
    driverRating: '5',
    driverTax: 'СВО',
    driverPhoto: undefined,
    driverTransportPhoto: undefined,
    driverTrailerPhoto: undefined,
} as ResponseToRequestCardType


const initialState = {
    isFetching: false,
    label: {
        driverFIO: 'Сотрудник',
        driverTransport: 'Транспорт',
        driverTrailer: 'Прицеп',
        driverStavka: 'Ставка, тн.км.',
        driverSumm: 'Сумма, руб.',
        driverRating: 'Рейсы, шт.',
        driverTax: 'Налог',
        driverPhoto: undefined,
        driverTransportPhoto: undefined,
        driverTrailerPhoto: undefined,
    } as ResponseToRequestCardType,

    initialValues: {
        driverFIO: undefined,
        driverTransport: undefined,
        driverTrailer: undefined,
        driverStavka: undefined,
        driverSumm: undefined,
        driverRating: undefined,
        driverTax: undefined,
        driverPhoto: undefined,
        driverTransportPhoto: undefined,
        driverTrailerPhoto: undefined,
    } as ResponseToRequestCardType,

    placeholder: {
        driverFIO: 'Поиск водителя...',
        driverTransport: 'Поиск транспорта...',
        driverTrailer: 'Поиск прицепа...',
        driverStavka: '0.00 руб',
    },

    maskOn: {
        driverStavka: undefined,
    },

    validators: {
        driverFIO: composeValidators(required),
        driverTransport: composeValidators(required),
        driverTrailer: composeValidators(required),
        driverStavka: composeValidators(required, maxRangeNumber(3000)) as ValidateType,
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

