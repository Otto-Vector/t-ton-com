import {AppStateType, GetActionsTypes} from './redux-store'
import {DaDataResponseAPIType} from '../types/api-types'
import {
    getOrganizationByInnDaDataAPI,
    GetOrganizationByInnDaDataType,
    getOrganizationByInnKPPDaDataAPI,
    GetOrganizationByInnKPPDaDataType,
} from '../api/dadata.api'
import {ThunkAction} from 'redux-thunk'

const initialState = {
    suggestions: [] as DaDataResponseAPIType[],
}

export type DaDataStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof daDataStoreActions>

export const daDataStoreReducer = ( state = initialState, action: ActionsType ): DaDataStoreReducerStateType => {

    switch (action.type) {
        case 'daData-store-reducer/SET-VALUES': {
            return {
                ...state,
                suggestions: action.suggections,
            }
        }

        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const daDataStoreActions = {
    setSuggectionsValues: ( suggections: DaDataResponseAPIType[] ) => ( {
        type: 'daData-store-reducer/SET-VALUES',
        suggections,
    } as const ),
}

/* САНКИ */
// конструктор для типов санок
export type DaDataThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// запрос параметров организации из DaData
export const getOrganizationsByInn = ( { inn }: GetOrganizationByInnDaDataType ): DaDataThunkActionType<string | null> =>
    async ( dispatch, getState ) => {
        dispatch(daDataStoreActions.setSuggectionsValues([]))

        const response = await getOrganizationByInnDaDataAPI({ inn })
        console.log(response)
        if (response.length < 1) {

            return 'Неверный ИНН!'
        }

        dispatch(daDataStoreActions.setSuggectionsValues(response))

        return null
    }

// запрос параметров организации из DaData
export const getOrganizationsByInnKPP = ( {
    inn,
    kpp,
}: GetOrganizationByInnKPPDaDataType ): DaDataThunkActionType<{ innNumber: string } | null> =>
    async ( dispatch, getState ) => {

        const response = await getOrganizationByInnKPPDaDataAPI({ inn, kpp })
        console.log(response)
        if (response.length < 1) {

            return ( { innNumber: 'Неверный ИНН/КПП!' } )
        }


        dispatch(daDataStoreActions.setSuggectionsValues(response))

        return null
    }