import {ThunkAction} from 'redux-thunk';
import {ActionsAnyType, AppStateType, GetActionsTypes} from './redux-store';
import {getPersonalReqisites} from './options/requisites-store-reducer';
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

        case 'app-reducer/SET_INITIALIZED' : {
            return {
                ...state,
                initialazed: true,
            }
        }

        default : {
            // возвращаем вообще без изменений
            return state
        }
    }

}


/* ЭКШОНЫ */
const appActions: ActionsAnyType = {
    // при обращении, изменяет стейт initialazed на true
    setInitialazedSuccess: () => ( { type: 'app-reducer/SET_INITIALIZED' } as const ),
}


/* САНКИ */
// конструктор для типов санок
export type InitializedThunkActionType = ThunkAction<void, AppStateType, unknown, ActionsType>

// запускаем комбайн загрузок/обращений к API
export const initializedAll = (): InitializedThunkActionType =>
    ( dispatch ) => {
        const getPersonal = dispatch(getPersonalReqisites())
        const getGeoPosition = dispatch(geoPositionTake())
        const getAllShippers = dispatch(getAllShippersAPI())
        const getAllConsignees = dispatch(getAllConsigneesAPI())
        const getAllRequests = dispatch(getAllRequestsAPI({ innID: 0 }))
        const getAllTransport = dispatch(getAllTransportAPI({ innID: 0 }))
        const getAllTrailer = dispatch(getAllTrailerAPI({ innID: 0 }))
        const getAllEmployees = dispatch(getAllEmployeesAPI({ innID: 0 }))


        const getAllInfoMessages = dispatch(getInfoMessages({ authID: 0 }))
        const getCargoComposition = dispatch(getCargoCompositionSelector())

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
            dispatch(appActions.setInitialazedSuccess())
        })
    }


