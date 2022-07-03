import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {CompanyRequisitesType, phoneSubmitType, ValidateType} from '../types/form-types'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../utils/validators'
import {geoPosition} from '../api/geolocation';

const initialState = {
    isAuth: true,
    authID: 'sfadsfsadfa',
    authCash: 100,
    isAvailableSMSrequest: false,
    isFetching: false,
    geoPosition: [ 0, 0 ] as number[],

    label: {
        innNumber: 'ИНН Компании',
        phoneNumber: 'Контактный номер',
        sms: 'Пароль из sms',
    } as phoneSubmitType,

    initialValues: {
        innNumber: undefined,
        phoneNumber: undefined,
        sms: undefined,
    } as phoneSubmitType,

    maskOn: {
        innNumber: '########## ##',
        phoneNumber: '+7 (###) ###-##-##',
        sms: '#####',
    } as phoneSubmitType,

    validators: {
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        phoneNumber: composeValidators(required, mustBe00Numbers(11)),
        sms: composeValidators(required, mustBe00Numbers(5)),
    } as phoneSubmitType<ValidateType>,
}

export type AuthStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof authStoreActions>

export const authStoreReducer = ( state = initialState, action: ActionsType ): AuthStoreReducerStateType => {

    switch (action.type) {

        case 'auth-store-reducer/SET-IS-AUTH': {
            return {
                ...state,
                isAuth: action.isAuth,
            }
        }
        case 'auth-store-reducer/SET-IS-AVAILABLE-SMS-REQUEST': {
            return {
                ...state,
                isAvailableSMSrequest: action.isAvailableSMSrequest,
            }
        }
        case 'auth-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                isFetching: action.isFetching,
            }
        }
        case 'auth-store-reducer/SET-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'auth-store-reducer/SET-GEO-POSITION': {
            return {
                ...state,
                geoPosition: [ action.latitude, action.longitude ],
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const authStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setIsAuth: ( isAuth: boolean ) => ( {
        type: 'auth-store-reducer/SET-IS-AUTH',
        isAuth,
    } as const ),
    setIsAvailableSMSRequest: ( isAvailableSMSrequest: boolean ) => ( {
        type: 'auth-store-reducer/SET-IS-AVAILABLE-SMS-REQUEST',
        isAvailableSMSrequest: isAvailableSMSrequest,
    } as const ),
    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'auth-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
    setInitialValues: ( initialValues: phoneSubmitType ) => ( {
        type: 'auth-store-reducer/SET-VALUES',
        initialValues,
    } as const ),
    setGeoPosition: ( { latitude, longitude }: { latitude: number, longitude: number } ) => ( {
        type: 'auth-store-reducer/SET-GEO-POSITION',
        latitude, longitude,
    } as const ),
}

/* САНКИ */

export type AuthStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const fakeAuthFetching = (): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        await setTimeout(() => {
            dispatch(authStoreActions.setIsFetching(false))
        }, 1000)
    }

export const geoPositionTake = (): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        const reparserLonLat: PositionCallback = ( el ) =>
            dispatch(authStoreActions.setGeoPosition({
                latitude: el.coords.latitude || 0,
                longitude: el.coords.longitude || 0,
            }))
        geoPosition(reparserLonLat)
    }

