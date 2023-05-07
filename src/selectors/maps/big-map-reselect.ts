import {BigMapReducerStateType, DriverOnMapType} from '../../redux/maps/big-map-store-reducer'
import {AppStateType} from '../../redux/redux-store'
import {createSelector} from 'reselect'
import {parseFamilyToFIO, stringToCoords} from '../../utils/parsers'
import {getRandomInRange} from '../../utils/random-utils'


type AuthStoreSelectors<T extends keyof Y, Y = BigMapReducerStateType> = ( state: AppStateType ) => Y[T]

export const getIsFetchingBigMapStore: AuthStoreSelectors<'isFetching'> = ( state ) => state.bigMapStoreReducer.isFetching
export const getCenterBigMapStore: AuthStoreSelectors<'center'> = ( state ) => state.bigMapStoreReducer.center
export const getFilteredResponsesBigMapStore: AuthStoreSelectors<'responsesOnMap'> = ( state ) => state.bigMapStoreReducer.responsesOnMap
export const getFilteredDriversBigMapStore: AuthStoreSelectors<'driversOnMap'> = ( state ) => state.bigMapStoreReducer.driversOnMap
export const getFilteredTransportBigMapStore: AuthStoreSelectors<'transportOnMap'> = ( state ) => state.bigMapStoreReducer.transportOnMap
export const getFilteredTrailersBigMapStore: AuthStoreSelectors<'trailersOnMap'> = ( state ) => state.bigMapStoreReducer.trailersOnMap

export const getDriversBigMapStore = createSelector(getFilteredDriversBigMapStore, ( drivers ): DriverOnMapType[] => drivers
    .map(( { idEmployee, coordinates, status, employeeFIO }, index ) => ( {
        id: index + 1,
        idEmployee,
        position: stringToCoords(coordinates)
            //toDo: это заглушка для пустых, убрать
            .map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5)),
        status,
        fio: parseFamilyToFIO(employeeFIO),
        isOutOfBounds: false,
        positionToBounds: stringToCoords(coordinates),
    } )))
