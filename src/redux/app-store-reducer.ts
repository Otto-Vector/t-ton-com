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
        let getPersonal = dispatch(getPersonalReqisites())
        let getGeoPosition = dispatch<any>(geoPositionTake())
        let getConsignees = dispatch<any>(getAllConsigneesAPI({ innID: 0 }))
        let getAllRequests = dispatch<any>(getAllRequestsAPI({ innID: 0 }))
        let getAllShippers = dispatch<any>(getAllShippersAPI({ innID: 0 }))
        let getAllTransport = dispatch<any>(getAllTransportAPI({ innID: 0 }))
        let getAllTrailer = dispatch<any>(getAllTrailerAPI({ innID: 0 }))
        let getAllEmployees = dispatch<any>(getAllEmployeesAPI({ innID: 0 }))

        let getAllInfoMessages = dispatch(getInfoMessages({ authID: 0 }))
        let getCargoComposition = dispatch(getCargoCompositionSelector())

        Promise.all([
            getPersonal,
            getGeoPosition,
            getConsignees,
            getAllRequests,
            getAllShippers,
            getAllTransport,
            getAllTrailer,
            getAllEmployees,
            getAllInfoMessages,
            getCargoComposition,
        ])
            .then(() => {
                dispatch(appActions.setInitialazedSuccess())
            })
    }
