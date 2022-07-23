import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {phoneSubmitType, ValidateType} from '../types/form-types'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../utils/validators'
import {geoPosition} from '../api/geolocation.api';
import {authApi, AuthRequestType, AuthValidateRequestType, NewUserRequestType} from '../api/auth.api';


const initialState = {
    isAuth: false,
    authID: 'sfadsfsadfa',
    authPhone: '',
    authCash: 100,
    isAvailableSMSRequest: false,
    kppBuffer: [] as string[] | null,
    isFetching: false,
    geoPosition: [ 0, 0 ] as number[],
    modalMessage: null as string | null, // сообщение в модалку (если null, то модалки нет)

    label: {
        innNumber: 'ИНН Организации',
        kppNumber: 'КПП Организации',
        phoneNumber: 'Контактный номер',
        sms: 'Пароль из sms',
    } as phoneSubmitType<string | undefined>,

    initialValues: {
        innNumber: undefined,
        kppNumber: undefined,
        phoneNumber: undefined,
        sms: undefined,
    } as phoneSubmitType,

    maskOn: {
        innNumber: '########## ##',
        kppNumber: undefined,
        phoneNumber: '+7 (###) ###-##-##',
        sms: '####',
    } as phoneSubmitType,

    validators: {
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        kppNumber: composeValidators(required),
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
        case 'auth-store-reducer/SET-AUTH-ID': {
            return {
                ...state,
                authID: action.id,
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
        case 'auth-store-reducer/SET-MODAL-MESSAGE': {
            return {
                ...state,
                modalMessage: action.message,
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
    setAuthId: ( id: string ) => ( {
        type: 'auth-store-reducer/SET-AUTH-ID',
        id,
    } as const ),
    setGeoPosition: ( { latitude, longitude }: { latitude: number, longitude: number } ) => ( {
        type: 'auth-store-reducer/SET-GEO-POSITION',
        latitude, longitude,
    } as const ),
    setModalMessage: ( message: string | null) => ( {
        type: 'auth-store-reducer/SET-MODAL-MESSAGE',
        message
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
export const sendCodeToPhone = ( {
                                     phone,
                                     inn,
                                     kpp,
                                 }: NewUserRequestType ): AuthStoreReducerThunkActionType<{} | null> =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const response = await authApi.sendCodeToPhone({ phone, inn, kpp })
            console.log(response)
            dispatch(authStoreActions.setIsFetching(false))
            // обрабатываем ошибку
            if (response.message) {
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                return { innNumber: response.message }
            }
            if (response.success) {
                dispatch(authStoreActions.setIsAvailableSMSRequest(true))
                dispatch(authStoreActions.setModalMessage(response.success))
            }
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
            const response = await authApi.login({ phone, password })
            dispatch(authStoreActions.setIsFetching(false))

            if (response.success) {
                console.log(response.success)
                dispatch(authStoreActions.setIsAuth(true))
                dispatch(authStoreActions.setAuthPhone(phone))
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                dispatch(authStoreActions.setAuthId(response.success)) // исправить на нормальную

                dispatch(authStoreActions.setIsFetching(false))
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
            const response = await authApi.logout({ phone })
            dispatch(authStoreActions.setIsAuth(false))

            if (response.status) console.log(response)

        } catch (error) {
            alert(error)
        }
    }

// разлогиниваемся
export const newPassword = ( { phone }: AuthRequestType ): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            dispatch(authStoreActions.setIsFetching(true))
            const response = await authApi.passwordRecovery({ phone })
            // const response = {success: 'Сообщение!'}
            console.log(response)
            if (response.success) dispatch(authStoreActions.setModalMessage(response.success))
            if (response.message) dispatch(authStoreActions.setModalMessage(response.message))

        } catch (error) {
            // @ts-ignore
            if (error.response.data.message) dispatch(authStoreActions.setModalMessage(error.response.data.message))
            else alert(error)



        }
    }
