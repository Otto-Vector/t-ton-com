import {ThunkAction} from 'redux-thunk';
import {AppStateType} from './redux-store';
import {getListOrganizationRequisites, getPersonalOrganizationRequisites} from './options/requisites-store-reducer';
import {getAllEmployeesAPI} from './options/employees-store-reducer';
import {getAllConsigneesAPI} from './options/consignees-store-reducer';
import {getAllRequestsAPI, getCargoCompositionSelector} from './forms/request-store-reducer';
import {getAllShippersAPI} from './options/shippers-store-reducer';
import {getAllTrailerAPI} from './options/trailer-store-reducer';
import {getAllTransportAPI} from './options/transport-store-reducer';
import {geoPositionTake} from './auth-store-reducer';
import {getInfoMessages} from './info-store-reducer';
import {GetActionsTypes} from '../types/ts-utils';

const initialState = {
    initialized: false,
    // КОНСТАНТЫ ИЗ БЭКА
    // КЛЮЧИ
    // процент, на который надо помножить
    distanceCoefficient: 1.05,
}

export type AppReducerStateType = typeof initialState
type ActionsType = GetActionsTypes<typeof appActions>

export const appStoreReducer = ( state = initialState,
                                 action: ActionsType ): AppReducerStateType => {
    switch (action.type) {
        case 'app-reducer/SET-INITIALIZED' : {
            return {
                ...state,
                initialized: action.initialized,
            }
        }
        default : {
            return state
        }
    }
}


/* ЭКШОНЫ */
export const appActions = {
    // при обращении, изменяет стейт initialized
    setInitialized: ( initialized: boolean ) => ( {
        type: 'app-reducer/SET-INITIALIZED',
        initialized,
    } as const ),
}


/* САНКИ */
// конструктор для типов санок
export type InitializedThunkActionType = ThunkAction<void, AppStateType, unknown, ActionsType>

// запускаем комбайн загрузок/обращений к API
export const initializedAll = (): InitializedThunkActionType =>
    async ( dispatch ) => {
        try { // реджектить промисы здесь https://qna.habr.com/q/1060904
            const getPersonal = dispatch(getPersonalOrganizationRequisites())
            const getGeoPosition = dispatch(geoPositionTake())
            const getOrganisationsList = dispatch(getListOrganizationRequisites())
            const getAllShippers = dispatch(getAllShippersAPI())
            const getAllConsignees = dispatch(getAllConsigneesAPI())
            const getAllTransport = dispatch(getAllTransportAPI())
            const getAllTrailer = dispatch(getAllTrailerAPI())
            const getAllEmployees = dispatch(getAllEmployeesAPI())
            const getCargoComposition = dispatch(getCargoCompositionSelector())

            const getAllRequests = dispatch(getAllRequestsAPI())
            const getAllInfoMessages = dispatch(getInfoMessages())

            Promise.all([
                getPersonal,
                getGeoPosition,
                getOrganisationsList,
                getCargoComposition,
                getAllShippers,
                getAllConsignees,
                getAllRequests,
                getAllTransport,
                getAllTrailer,
                getAllEmployees,
                getAllInfoMessages,
            ])
                .then(() => {
                    dispatch(appActions.setInitialized(true))
                })
        } catch (e) {
            console.log(e)
        }
    }


