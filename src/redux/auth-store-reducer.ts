import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {phoneSubmitType, ValidateType} from '../types/form-types'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../utils/validators'
import {geoPosition} from '../api/geolocation.api';
import {authApi, AuthRequestType, AuthValidateRequestType, NewUserRequestType} from '../api/auth.api';
import {daDataStoreActions, DaDataStoreActionsType} from './api/dadata-response-reducer';
import {appActions} from './app-store-reducer';
import {globalModalStoreActions} from './utils/global-modal-store-reducer';


const initialValues: phoneSubmitType = {
    innNumber: undefined,
    kppNumber: undefined,
    phoneNumber: undefined,
    sms: undefined,
}

const initialState = {
    isAutoLoginTry: false,
    isAuth: false,
    authID: '',
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

    initialValues: { ...initialValues },

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

export type AuthStoreActionsType = GetActionsTypes<typeof authStoreActions>

export const authStoreReducer = ( state = initialState, action: AuthStoreActionsType ): AuthStoreReducerStateType => {

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
        case 'auth-store-reducer/SET-AUTOLOGIN-DONE': {
            return {
                ...state,
                isAutoLoginTry: true,
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
    setAutologinDone: () => ( {
        type: 'auth-store-reducer/SET-AUTOLOGIN-DONE',
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
    setModalMessage: ( message: string | null ) => ( {
        type: 'auth-store-reducer/SET-MODAL-MESSAGE',
        message,
    } as const ),
}

/* САНКИ */
export type AuthStoreReducerThunkActionType<R = void> =
    ThunkAction<Promise<R>, AppStateType, unknown, AuthStoreActionsType | DaDataStoreActionsType>

// для блокировки нажатия НОВЫЙ ПАРОЛЬ на одну минуту
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
                                     innNumber,
                                     kpp,
                                 }: NewUserRequestType ): AuthStoreReducerThunkActionType<{} | null> =>
    async ( dispatch , getState) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const dadataLocalParams = getState().daDataStoreReducer.suggestions.filter(({data})=>data.kpp===kpp)
            const {value, data} = dadataLocalParams[0]
            const response = await authApi.sendCodeToPhone({ phone, innNumber, kpp,
                organizationName: value,
                taxMode: data.finance?.tax_system || '',
                ogrn: data.ogrn,
                okpo: data.okpo || '',
                legalAddress: data.address.value,
                postAddress: data.address.value,
                email: data.emails ? data.emails[0]?.value : '',
            })
            console.log(response)
            dispatch(authStoreActions.setIsFetching(false))
            // обрабатываем ошибку
            if (response.message) {
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                return { innNumber: response.message }
            }
            if (response.success) {
                // dispatch(authStoreActions.setModalMessage(response.success + 'ПАРОЛЬ: ' + response.password))
                dispatch<any>(globalModalStoreActions.setTextMessage(response.success + 'ПАРОЛЬ: ' + response.password))
            }
        } catch (error) {
            dispatch(authStoreActions.setIsFetching(false))
            // @ts-ignore
            dispatch<any>(globalModalStoreActions.setTextMessage(error.response.data.message))
            // @ts-ignore
            return { phoneNumber: error.response.data.message }
        }
        dispatch(authStoreActions.setIsAvailableSMSRequest(true))
        dispatch(authStoreActions.setIsFetching(false))
        return null
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
                // вносим данные об активном пользователе
                dispatch(authStoreActions.setAuthId(response.userid || ''))
                dispatch(authStoreActions.setAuthPhone(phone))

                // ЗАЧИЩАЕМ ФОРМУ АВТОРИЗАЦИИ
                // зачищаем список КПП
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // чистим форму ввода для следующих авторизаций
                dispatch(authStoreActions.setInitialValues({ ...initialValues }))
                // надо для двойной логики рег/авт
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))

                // для случаев с пере-логиниванием
                dispatch<any>(appActions.setInitialized(false))

                // сама авторизация
                dispatch(authStoreActions.setIsAuth(true))
            }

        } catch (error) {
            dispatch(authStoreActions.setIsFetching(false))
            // @ts-ignore
            dispatch<any>(globalModalStoreActions.setTextMessage(JSON.stringify(error.response.data.message)))
            // @ts-ignore
            return { sms: error.response.data.message }
        }

        dispatch(authStoreActions.setIsFetching(false))
        return null
    }

// разлогиниваемся
export const logoutAuth = (): AuthStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const phone = getState().authStoreReducer.authPhone
            const response = await authApi.logout({ phone })
            dispatch(authStoreActions.setIsAuth(false))
            dispatch(authStoreActions.setAuthId(''))
            if (response.status) {
                console.log(response)
            }
        } catch (error) {
            await dispatch<any>(globalModalStoreActions.setTextMessage(JSON.stringify(error)))
        }
    }

// обновляем пароль
export const newPassword = ( { phone }: AuthRequestType ): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const response = await authApi.passwordRecovery({ phone })

            console.log(response)
            if (response.success) dispatch(authStoreActions.setModalMessage(response.success+ '\n ПАРОЛЬ: ' + response.password))
            if (response.message) dispatch(authStoreActions.setModalMessage(response.message))

        } catch (error) {
            dispatch(authStoreActions.setIsFetching(false))
            // @ts-ignore
            if (error.response.data.message) dispatch<any>(globalModalStoreActions.setTextMessage(error.response.data.message+ '. ПРОВЕРЬТЕ ПРАВИЛЬНОСТЬ ВВОДА НОМЕРА ТЕЛЕФОНА'))
            else dispatch<any>(globalModalStoreActions.setTextMessage(JSON.stringify(error)))
        }
        dispatch(authStoreActions.setIsFetching(false))
    }

// запрос idUser (авторизован или нет)
export const autoLoginMe = (): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await authApi.autoLogin()
            console.log('ответ от api/me/', response)

            if (response.userid) {
                dispatch(authStoreActions.setAuthId(response.userid))
                dispatch(authStoreActions.setIsAuth(true))
            }
            if (response.message) {
                console.log(response.message)
                dispatch<any>(globalModalStoreActions.setTextMessage(response.message))
            }
        } catch (error) {
            // @ts-ignore
            if (error.response.data.message) {
                // @ts-ignore
                console.log(error.response.data.message)
            }
            else dispatch<any>(globalModalStoreActions.setTextMessage("Ошибка при автоматической авторизации: "+JSON.stringify(error)))
        }

        dispatch(authStoreActions.setAutologinDone())
    }