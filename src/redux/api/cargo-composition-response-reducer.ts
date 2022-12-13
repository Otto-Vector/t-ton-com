import {AppStateType} from '../redux-store'
import {ThunkAction} from 'redux-thunk'
import {GetActionsTypes} from '../../types/ts-utils';
import {cargoEditableSelectorApi} from '../../api/local-api/cargoEditableSelector.api';
import {TtonErrorType} from '../../api/local-api/back-instance.api';
import {requestStoreActions, RequestStoreActionsType} from '../forms/request-store-reducer';
import {OneRequestType} from '../../types/form-types';

const initialState = {
    // список названий грузов (изменяемый при создании заявки) - подгружается из бэка
    cargoComposition: [] as string[],
}

export type CargoCopmpositionStoreReducerStateType = typeof initialState

export type CargoCopmositonStoreActionsType = GetActionsTypes<typeof cargoCompositionStoreActions>

// стэйт для подгружаемого редактируемого селектора из бэка
export const cargoCompositionStoreReducer = ( state = initialState, action: CargoCopmositonStoreActionsType ): CargoCopmpositionStoreReducerStateType => {

    switch (action.type) {
        case 'cargo-composition-store-reducer/SET-VALUES': {
            return {
                ...state,
                cargoComposition: action.cargoCompositionValues,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const cargoCompositionStoreActions = {
    setValues: ( cargoCompositionValues: string[] ) => ( {
        type: 'cargo-composition-store-reducer/SET-VALUES',
        cargoCompositionValues,
    } as const ),
}

/* САНКИ */
// конструктор для типов санок
export type CargoCopmositionThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, CargoCopmositonStoreActionsType | RequestStoreActionsType>


// забираем данные селектора из API и выставляем его значение в Initial
export const getCargoCompositionSelector = (): CargoCopmositionThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await cargoEditableSelectorApi.getCargoComposition()
            const reparsedResponse = response.map(( { text } ) => text).reverse()
            dispatch(cargoCompositionStoreActions.setValues(reparsedResponse))
        } catch (e: TtonErrorType) {
            console.log(e)
        }
    }

// отправляем изменения селектора и выставляем его значение в Initial (это добавляемый селектор)
export const setCargoCompositionSelector = ( newCargoCompositionItem: string ): CargoCopmositionThunkActionType =>
    async ( dispatch ,getState) => {
        try {
            // убираем палки в названии
            const text = newCargoCompositionItem.replaceAll('|', '')
            const currentRequestValues = getState().requestStoreReducer.initialValues
            const response = await cargoEditableSelectorApi.addOneCargoComposition(text)

            if (response.success) {
                await dispatch(getCargoCompositionSelector())
                dispatch(requestStoreActions.setInitialValues({
                    ...currentRequestValues,
                    cargoComposition: newCargoCompositionItem,
                }))
            }
        } catch (e: TtonErrorType) {
            console.log(JSON.stringify(e?.response?.data))
        }
    }
