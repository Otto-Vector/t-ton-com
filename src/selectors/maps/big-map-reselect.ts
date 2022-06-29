import {BigMapReducerStateType} from '../../redux/maps/big-map-store-reducer';
import {AppStateType} from '../../redux/redux-store';


type AuthStoreSelectors<T extends keyof Y, Y = BigMapReducerStateType> = (state: AppStateType) => Y[T]

export const getIsFetchingBigMapStore: AuthStoreSelectors<'isFetching'> = (state) => state.bigMapStoreReducer.isFetching
export const getCenterBigMapStore: AuthStoreSelectors<'center'> = (state) => state.bigMapStoreReducer.center
export const getDriversBigMapStore: AuthStoreSelectors<'drivers'> = (state) => state.bigMapStoreReducer.drivers
