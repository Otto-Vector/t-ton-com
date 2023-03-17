import {ThunkAction} from 'redux-thunk'
import {AppStateType} from './../redux-store'

import {geoPosition} from '../../api/utils-api/geolocation.api'
import {parseFamilyToFIO, stringToCoords} from '../../utils/parsers'
import {GetActionsTypes} from '../../types/ts-utils'
import {getRandomInRange} from '../../utils/random-utils'
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api'
import {employeesApi} from '../../api/local-api/options/employee.api'

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
    drivers: [
        {
            id: 2 as number,
            position: [ 0, 0 ] as number[],
            status: 'empty' as 'empty' | 'full' | 'unknown',
            fio: '',
        },
    ] as DriverOnMapType[],
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
                drivers: action.drivers,
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
    setDriversList: ( drivers: DriverOnMapType[] ) => ( {
        type: 'big-map-store-reducer/SET-DRIVERS-LIST',
        drivers,
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
export const setDriversToMap = (): BigMapStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const drivers: DriverOnMapType[] = getState().employeesStoreReducer.content.map(
            ( { idEmployee, coordinates, status, employeeFIO }, index ) => ( {
                id: index + 1,
                idEmployee,
                position: stringToCoords(coordinates)
                    //toDo: это заглушка для пустых, убрать
                    .map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5)),
                status: status as string,
                fio: parseFamilyToFIO(employeeFIO),
            } ))
        dispatch(bigMapStoreActions.setDriversList(drivers))
    }

// загрузка на карту водителей с ответами перевозчиков
export const setAnswerDriversToMap = ( requestNumber: string ): BigMapStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const request = await responseToRequestApi.getOneOrMoreResponseToRequest({ requestNumber })
            console.log(request)
            // пока грузим ВЕСЬ СПИСОК
            // toDo: дать бэку задание выгружать водителей по списку айдишек
            const allDriversList = await employeesApi.getAllEmployees()

            if (request.length && allDriversList.length) {
                const idEmployeesToSearch = request.map(( { idEmployee } ) => idEmployee)
                const drivers: DriverOnMapType[] = allDriversList
                    .filter(( { idEmployee } ) => idEmployeesToSearch.includes(idEmployee))
                    .map(( { idEmployee, coordinates, status, employeeFIO }, index ) => ( {
                        id: index + 1,
                        idEmployee,
                        position: stringToCoords(coordinates)
                            //toDo: это заглушка для пустых, убрать
                            .map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5)),
                        status: status as string,
                        fio: parseFamilyToFIO(employeeFIO),
                    } ))
                dispatch(bigMapStoreActions.setDriversList(drivers))
            }
        } catch (e) {

        }
    }
