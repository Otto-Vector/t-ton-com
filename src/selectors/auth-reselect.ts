import {AppStateType} from '../redux/redux-store'
import {AuthStoreReducerStateType} from '../redux/auth-store-reducer';

type AuthStoreSelectors<T extends keyof Y, Y = AuthStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsAuth: AuthStoreSelectors<'isAuth'> = (state) => state.authStoreReducer.isAuth
export const getIsFetchingAuth: AuthStoreSelectors<'isFetching'> = (state) => state.authStoreReducer.isFetching
export const getIsAvailableSMSrequest: AuthStoreSelectors<'isAvailableSMSrequest'> = (state) => state.authStoreReducer.isAvailableSMSrequest
