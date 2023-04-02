import {ThunkAction} from 'redux-thunk'
import {AppStateType} from './../redux-store'

import {geoPosition} from '../../api/utils-api/geolocation.api'
import {parseFamilyToFIO, stringToCoords} from '../../utils/parsers'
import {GetActionsTypes} from '../../types/ts-utils'
import {getRandomInRange} from '../../utils/random-utils'
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api'
import {employeesApi} from '../../api/local-api/options/employee.api'
import {EmployeeCardType, TrailerCardType, TransportCardType} from '../../types/form-types'
import {trailerApi} from '../../api/local-api/options/trailer.api'
import {transportApi} from '../../api/local-api/options/transport.api'

export type DriverOnMapType = {
    id: number,
    idEmployee: string,
    position: number[],
    status: string,
    fio: string
}


const initialState = {
    isFetching: true,
    center: [ 0, 0 ] as [ number, number ],
    driversOnMap: [] as EmployeeCardType[],
    transportOnMap: [] as TransportCardType[],
    trailersOnMap: [] as TrailerCardType[],
    requests: [ {} ] as number[],
}

export type BigMapReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof bigMapStoreActions>

export const bigMapStoreReducer = ( state = initialState, action: ActionsType ): BigMapReducerStateType => {

    switch (action.type) {

        case 'big-map-store-reducer/SET-CENTER': {
            return {
                ...state,
                center: action.center,
            }
        }
        case 'big-map-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                isFetching: action.isFetching,
            }
        }
        case 'big-map-store-reducer/SET-DRIVERS-LIST': {
            return {
                ...state,
                driversOnMap: action.driversOnMap,
            }
        }
        case 'big-map-store-reducer/SET-TRANSPORT-LIST': {
            return {
                ...state,
                transportOnMap: action.transportOnMap,
            }
        }
        case 'big-map-store-reducer/SET-TRAILERS-LIST': {
            return {
                ...state,
                trailersOnMap: action.trailersOnMap,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const bigMapStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setCenter: ( center: [ number, number ] ) => ( {
        type: 'big-map-store-reducer/SET-CENTER',
        center,
    } as const ),
    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'big-map-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
    setDriversList: ( driversOnMap: EmployeeCardType[] ) => ( {
        type: 'big-map-store-reducer/SET-DRIVERS-LIST',
        driversOnMap,
    } as const ),
    setTransportList: ( transportOnMap: TransportCardType[] ) => ( {
        type: 'big-map-store-reducer/SET-TRANSPORT-LIST',
        transportOnMap,
    } as const ),
    setTrailersList: ( trailersOnMap: TrailerCardType[] ) => ( {
        type: 'big-map-store-reducer/SET-TRAILERS-LIST',
        trailersOnMap,
    } as const ),
}

/* САНКИ */

export type BigMapStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// берет данные из апи браузера по геопозиции и сохраняет их в стэйт для центровки карты
export const geoPositionTake = (): BigMapStoreReducerThunkActionType =>
    async ( dispatch ) => {
        const reparserLonLat: PositionCallback = ( el ) =>
            dispatch(bigMapStoreActions.setCenter([
                el.coords.latitude || 0,
                el.coords.longitude || 0,
            ]))
        geoPosition(reparserLonLat)
    }


// берёт данные из загруженного списка водителей и сохраняет их в стэйт
// (возможно лучше это сделать через "selectors"
export const setAllMyDriversToMap = (): BigMapStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(bigMapStoreActions.setDriversList([]))
        dispatch(bigMapStoreActions.setTransportList([]))
        dispatch(bigMapStoreActions.setTrailersList([]))
        const myDriversList = getState().employeesStoreReducer.content
        const myTransport = getState().transportStoreReducer.content
        const myTrailers = getState().trailerStoreReducer.content
        dispatch(bigMapStoreActions.setDriversList(myDriversList))
        dispatch(bigMapStoreActions.setTransportList(myTransport))
        dispatch(bigMapStoreActions.setTrailersList(myTrailers))
    }

// загрузка на карту водителей с ответами перевозчиков
export const setAnswerDriversToMap = ( requestNumber: string ): BigMapStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // зачищаем списки
        dispatch(bigMapStoreActions.setDriversList([]))
        dispatch(bigMapStoreActions.setTransportList([]))
        dispatch(bigMapStoreActions.setTrailersList([]))
        dispatch(bigMapStoreActions.setIsFetching(true))
        try {
            // список ответов на заявку
            const responseToRequest = await responseToRequestApi.getOneOrMoreResponseToRequest({ requestNumber })
            // console.log(responseToRequest)
            if (responseToRequest.length) {
                const idEmployee = responseToRequest.map(( { idEmployee } ) => idEmployee).join()
                const idTransport = responseToRequest.map(( { idTransport } ) => idTransport).join()
                const idTrailer = responseToRequest.map(( { idTrailer } ) => idTrailer).join()
                const allDriversList = await employeesApi.getOneOrMoreEmployeeById({ idEmployee })
                if (allDriversList.length) {
                    dispatch(bigMapStoreActions.setDriversList(allDriversList))
                    const allTransportList = await transportApi.getOneOrMoreTransportById({ idTransport })
                    const allTrailersList = await trailerApi.getOneOrMoreTrailerById({ idTrailer })
                    if (Array.isArray(allTransportList)) {
                        dispatch(bigMapStoreActions.setTransportList(allTransportList))
                    }
                    if (Array.isArray(allTrailersList)) {
                        dispatch(bigMapStoreActions.setTrailersList(allTrailersList))
                    }
                }
            }
            dispatch(bigMapStoreActions.setIsFetching(false))
        } catch (e) {
            console.log('Ошибка при загрузке данных водителей, которые привязаны к ответам на заявку: ', e)
        }
    }
