import {AppStateType} from '../redux/redux-store'
import {AuthStoreReducerStateType} from '../redux/auth-store-reducer';


type BaseStoreSelectors<T extends keyof Y, Y = AuthStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsAuth: BaseStoreSelectors<'isAuth'> = (state) => state.authStoreReducer.isAuth
