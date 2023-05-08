import {ThunkAction} from 'redux-thunk'
import {AppStateType} from './../redux-store'

import {geoPosition} from '../../api/utils-api/geolocation.api'
import {parseFamilyToFIO, stringToCoords} from '../../utils/parsers'
import {GetActionsTypes} from '../../types/ts-utils'
import {getRandomInRange} from '../../utils/random-utils'
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api'
import {employeesApi} from '../../api/local-api/options/employee.api'
import {EmployeesApiType, ResponseToRequestCardType, TrailerCardType, TransportCardType} from '../../types/form-types'
import {trailerApi} from '../../api/local-api/options/trailer.api'
import {transportApi} from '../../api/local-api/options/transport.api'
import {getOneRequestsAPI} from '../forms/request-store-reducer'
import {TtonErrorType} from '../../api/local-api/back-instance.api'

export type DriverOnMapType = EmployeesApiType & {
    id: number
    position: number[]
    fio: string
    isOutOfBounds: boolean
    positionToBounds: number[]
    isSelected: boolean
}


const initialState = {
    isFetching: true,
    center: [ 0, 0 ] as [ number, number ],
    driversOnMap: [] as DriverOnMapType[],
    transportOnMap: [] as TransportCardType<string>[],
    trailersOnMap: [] as TrailerCardType<string>[],
    responsesOnMap: [] as ResponseToRequestCardType<string>[],
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
        case 'big-map-store-reducer/SET-RESPONSES-LIST': {
            return {
                ...state,
                responsesOnMap: action.responsesOnMap,
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
    setResponsesList: ( responsesOnMap: ResponseToRequestCardType<string>[] ) => ( {
        type: 'big-map-store-reducer/SET-RESPONSES-LIST',
        responsesOnMap,
    } as const ),
    setDriversList: ( driversOnMap: DriverOnMapType[] ) => ( {
        type: 'big-map-store-reducer/SET-DRIVERS-LIST',
        driversOnMap,
    } as const ),
    setTransportList: ( transportOnMap: TransportCardType<string>[] ) => ( {
        type: 'big-map-store-reducer/SET-TRANSPORT-LIST',
        transportOnMap,
    } as const ),
    setTrailersList: ( trailersOnMap: TrailerCardType<string>[] ) => ( {
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

// преобразование данных для карты
const myDriversToMapConverter = ( myDriversList: EmployeesApiType[] ): DriverOnMapType[] => myDriversList.map(
    ( {
          coordinates,
          employeeFIO,
          ...props
      }, index ) => ( {
        ...props, coordinates, employeeFIO,
        id: index + 1,
        position: stringToCoords(coordinates)
            //toDo: это заглушка для пустых, убрать
            .map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5)),
        fio: parseFamilyToFIO(employeeFIO),
        isOutOfBounds: false,
        positionToBounds: stringToCoords(coordinates),
        isSelected: false,
    } ))

// берёт данные списка водителей от сервера и сохраняет их в стэйт
export const setAllMyDriversToMap = (): BigMapStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(bigMapStoreActions.setDriversList([]))
        dispatch(bigMapStoreActions.setTransportList([]))
        dispatch(bigMapStoreActions.setTrailersList([]))
        dispatch(bigMapStoreActions.setResponsesList([]))
        dispatch(bigMapStoreActions.setIsFetching(true))
        const idUser = getState().authStoreReducer.authID
        try {
            // const myDriversList = getState().employeesStoreReducer.content
            const myDriversList = await employeesApi.getAllEmployeesByUserId({ idUser })
            // const myTransport = getState().transportStoreReducer.content
            const myTransport = await transportApi.getAllTransportByUserId({ idUser })
            // const myTrailers = getState().trailerStoreReducer.content
            const myTrailers = await trailerApi.getAllTrailerByUserId({ idUser })

            dispatch(bigMapStoreActions.setDriversList(myDriversToMapConverter(myDriversList)))
            dispatch(bigMapStoreActions.setTransportList(myTransport))
            dispatch(bigMapStoreActions.setTrailersList(myTrailers))
        } catch (e: TtonErrorType) {
            console.log('Ошибка при загрузке данных водителей на карту: ', e)
        }
        dispatch(bigMapStoreActions.setIsFetching(false))
    }

// загрузка на карту водителей с ответами перевозчиков
export const setAnswerDriversToMap = ( requestNumber: string ): BigMapStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // зачищаем списки
        dispatch(bigMapStoreActions.setDriversList([]))
        dispatch(bigMapStoreActions.setTransportList([]))
        dispatch(bigMapStoreActions.setTrailersList([]))
        dispatch(bigMapStoreActions.setResponsesList([]))
        dispatch(bigMapStoreActions.setIsFetching(true))
        try {
            // список ответов на заявку
            const responseToRequest = await responseToRequestApi.getOneOrMoreResponseToRequest({ requestNumber })
            dispatch(getOneRequestsAPI(+requestNumber))
            if (responseToRequest.length) {
                dispatch(bigMapStoreActions.setResponsesList(responseToRequest as ResponseToRequestCardType<string>[]))
                const idEmployee = responseToRequest.map(( { idEmployee } ) => idEmployee).join()
                const idTransport = responseToRequest.map(( { idTransport } ) => idTransport).join()
                const idTrailer = responseToRequest.map(( { idTrailer } ) => idTrailer).join()
                const allDriversList = await employeesApi.getOneOrMoreEmployeeById({ idEmployee })
                if (allDriversList.length) {
                    dispatch(bigMapStoreActions.setDriversList(myDriversToMapConverter(allDriversList)))
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
