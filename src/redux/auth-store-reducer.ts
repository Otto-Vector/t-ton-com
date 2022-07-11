import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {phoneSubmitType, ValidateType} from '../types/form-types'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../utils/validators'
import {geoPosition} from '../api/geolocation';
import {authAPI, AuthValidateRequestType} from '../api/auth-api';
import Cookies from 'js-cookie'

const initialState = {
    isAuth: false,
    authID: 'sfadsfsadfa',
    authPhone: '',
    authCash: 100,
    isAvailablePhoneEdit: true,
    isAvailableSMSRequest: false,

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
        sms: '####',
    } as phoneSubmitType,

    validators: {
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        phoneNumber: composeValidators(required, mustBe00Numbers(11)),
        sms: composeValidators(required, mustBe00Numbers(4)),
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
                isAvailableSMSRequest: action.isAvailableSMSRequest,
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
        case 'auth-store-reducer/SET-AUTH-PHONE': {
            return {
                ...state,
                authPhone: action.authPhone,
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
    setIsAvailableSMSRequest: ( isAvailableSMSRequest: boolean ) => ( {
        type: 'auth-store-reducer/SET-IS-AVAILABLE-SMS-REQUEST',
        isAvailableSMSRequest: isAvailableSMSRequest,
    } as const ),
    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'auth-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
    setInitialValues: ( initialValues: phoneSubmitType ) => ( {
        type: 'auth-store-reducer/SET-VALUES',
        initialValues,
    } as const ),
    setAuthPhone: ( authPhone: string ) => ( {
        type: 'auth-store-reducer/SET-AUTH-PHONE',
        authPhone,
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

// прописываем актуальную геопозицию в стэйт
export const geoPositionTake = (): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        const reparserLonLat: PositionCallback = ( el ) =>
            dispatch(authStoreActions.setGeoPosition({
                latitude: el.coords.latitude || 0,
                longitude: el.coords.longitude || 0,
            }))
        geoPosition(reparserLonLat)
    }

// отправляем запрос на код авторизации в телефон
export const sendCodeToPhone = ( phone: string ): AuthStoreReducerThunkActionType<{} | null> =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            await authAPI.sendCodeToPhone({ phone })

            dispatch(authStoreActions.setIsAvailableSMSRequest(false))
            dispatch(authStoreActions.setIsFetching(false))

            return null
        } catch (error) {
            dispatch(authStoreActions.setIsFetching(false))
            dispatch(authStoreActions.setIsAvailableSMSRequest(true))
            // @ts-ignore
            return { phoneNumber: error.response.data.message }
        }
    }


// логинимся по номеру телефона и паролю
export const loginAuthorization = ( {
                                        phone,
                                        password,
                                    }: AuthValidateRequestType ): AuthStoreReducerThunkActionType<{} | null> =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const response = await authAPI.login({ phone, password })
            dispatch(authStoreActions.setIsFetching(false))

            if (response.success) {
                console.log(response.success)
                dispatch(authStoreActions.setIsAuth(true))
                dispatch(authStoreActions.setAuthPhone(phone))
                // Cookies.set('userid', '30672918-39e6-44f9-b8be-eedfa9c99fc7')
            }

            return null
        } catch (error) {

            dispatch(authStoreActions.setIsFetching(false))

            // @ts-ignore
            return { sms: error.response.data.message }
        }
    }

// разлогиниваемся
export const logoutAuth = (): AuthStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const phone = getState().authStoreReducer.authPhone
            const response = await authAPI.logout({ phone })
            dispatch(authStoreActions.setIsAuth(false))

            if (response.status) console.log(response)

        } catch (error) {
            alert(error)
        }
    }
