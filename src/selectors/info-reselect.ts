import {AppStateType} from '../redux/redux-store'
import {InfoStoreReducerStateType} from '../redux/info-store-reducer';

type InfoStoreSelectors<T extends keyof Y, Y = InfoStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsFetchingInfoStore: InfoStoreSelectors<'isFetching'> = (state) => state.infoStoreReducer.isFetching
export const getContentInfoStore: InfoStoreSelectors<'content'> = (state) => state.infoStoreReducer.content
