import {AppStateType} from '../redux/redux-store'
import {AuthStoreReducerStateType} from '../redux/auth-store-reducer';

type AuthStoreSelectors<T extends keyof Y, Y = AuthStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getIsAuthAuthStore: AuthStoreSelectors<'isAuth'> = ( state ) => state.authStoreReducer.isAuth
export const getAuthCashAuthStore: AuthStoreSelectors<'authCash'> = ( state ) => state.authStoreReducer.authCash

export const getIsFetchingAuth: AuthStoreSelectors<'isFetching'> = ( state ) => state.authStoreReducer.isFetching
export const getIsAvailableSMSrequest: AuthStoreSelectors<'isAvailableSMSRequest'> = ( state ) => state.authStoreReducer.isAvailableSMSRequest

export const getLabelAuthStore: AuthStoreSelectors<'label'> = ( state ) => state.authStoreReducer.label
export const getInitialValuesAuthStore: AuthStoreSelectors<'initialValues'> = ( state ) => state.authStoreReducer.initialValues
export const getMaskOnAuthStore: AuthStoreSelectors<'maskOn'> = ( state ) => state.authStoreReducer.maskOn
export const getValidatorsAuthStore: AuthStoreSelectors<'validators'> = ( state ) => state.authStoreReducer.validators

export const getGeoPositionAuthStore: AuthStoreSelectors<'geoPosition'> = ( state ) => state.authStoreReducer.geoPosition

