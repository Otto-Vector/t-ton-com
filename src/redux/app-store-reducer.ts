import {ThunkAction} from 'redux-thunk';
import {AppStateType, GetActionsTypes} from './redux-store';
import {getPersonalOrganizationRequisites} from './options/requisites-store-reducer';
import {getAllEmployeesAPI} from './options/employees-store-reducer';
import {getAllConsigneesAPI} from './options/consignees-store-reducer';
import {getAllRequestsAPI, getCargoCompositionSelector} from './forms/request-store-reducer';
import {getAllShippersAPI} from './options/shippers-store-reducer';
import {getAllTrailerAPI} from './options/trailer-store-reducer';
import {getAllTransportAPI} from './options/transport-store-reducer';
import {geoPositionTake} from './auth-store-reducer';
import {getInfoMessages} from './info-store-reducer';

const initialState = {
    initialazed: false,
}

export type AppReducerStateType = typeof initialState
type ActionsType = GetActionsTypes<typeof appActions>

export const appStoreReducer = ( state = initialState,
                                 action: ActionsType ): AppReducerStateType => {
    switch (action.type) {
        case 'app-reducer/SET-INITIALIZED' : {
            return {
                ...state,
                initialazed: action.initialazed,
            }
        }
        default : {
            // возвращаем вообще без изменений
            return state
        }
    }
}


/* ЭКШОНЫ */
export const appActions = {
    // при обращении, изменяет стейт initialazed
    setInitialazed: ( initialazed: boolean ) => ( {
        type: 'app-reducer/SET-INITIALIZED',
        initialazed,
    } as const ),
}


/* САНКИ */
// конструктор для типов санок
export type InitializedThunkActionType = ThunkAction<void, AppStateType, unknown, ActionsType>

// запускаем комбайн загрузок/обращений к API
export const initializedAll = (): InitializedThunkActionType =>
    ( dispatch ) => {
        const getPersonal = dispatch(getPersonalOrganizationRequisites())
        const getGeoPosition = dispatch(geoPositionTake())
        const getAllShippers = dispatch(getAllShippersAPI())
        const getAllConsignees = dispatch(getAllConsigneesAPI())
        const getAllTransport = dispatch(getAllTransportAPI())
        const getAllTrailer = dispatch(getAllTrailerAPI())
        const getAllEmployees = dispatch(getAllEmployeesAPI())
        const getCargoComposition = dispatch(getCargoCompositionSelector())

        const getAllRequests = dispatch(getAllRequestsAPI({innID: 0}))
        const getAllInfoMessages = dispatch(getInfoMessages())

        Promise.all([
            getPersonal,
            getGeoPosition,
            getCargoComposition,
            getAllShippers,
            getAllConsignees,
            getAllRequests,
            getAllTransport,
            getAllTrailer,
            getAllEmployees,
            getAllInfoMessages,
        ]).then(() => {
            dispatch(appActions.setInitialazed(true))
        })
    }


