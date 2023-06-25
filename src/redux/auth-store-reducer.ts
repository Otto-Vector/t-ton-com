import {ThunkAction} from 'redux-thunk'
import {AppStateType} from './redux-store'
import {PhoneSubmitType, ValidateType} from '../types/form-types'
import {syncValidators} from '../utils/validators'
import {authApi, AuthRequestType, AuthValidateRequestType, NewUserRequestType} from '../api/local-api/auth.api'
import {daDataStoreActions, DaDataStoreActionsType} from './api/dadata-response-reducer'
import {appActions} from './app-store-reducer'
import {textAndActionGlobalModal} from './utils/global-modal-store-reducer'
import {GetActionsTypes} from '../types/ts-utils'
import {TtonErrorType} from '../api/local-api/back-instance.api'
import {geoPosition} from '../utils/map-utils'


const initialValues: PhoneSubmitType = {
    innNumber: undefined,
    kppNumber: undefined,
    phoneNumber: undefined,
    sms: undefined,
}

const initialState = {
    // для срабатывания автологина только один раз
    isAutoLoginTry: false,

    isAuth: false,
    authID: '',
    authPhone: '',
    isAvailableSMSRequest: false,
    kppBuffer: [] as string[] | null,
    isFetching: false,
    geoPosition: [ 0, 0 ] as number[],

    label: {
        innNumber: 'ИНН Организации',
        kppNumber: 'КПП Организации',
        phoneNumber: 'Контактный номер',
        sms: 'Пароль',
    } as PhoneSubmitType<string | undefined>,

    initialValues: { ...initialValues },

    maskOn: {
        innNumber: '########## ##',
        kppNumber: undefined,
        phoneNumber: '+7 (###) ###-##-##',
        sms: '####',
    } as PhoneSubmitType,

    validators: {
        innNumber: syncValidators.inn,
        kppNumber: syncValidators.required,
        phoneNumber: syncValidators.phone,
        sms: syncValidators.sms,
    } as PhoneSubmitType<ValidateType>,
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
    setInitialValues: ( initialValues: PhoneSubmitType ) => ( {
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
export const sendCodeToPhoneAndCreateShortRequisitesToValidateOnServer = ( {
                                     phone,
                                     innNumber,
                                     kpp,
                                 }: NewUserRequestType ): AuthStoreReducerThunkActionType<{} | null> =>
    async ( dispatch, getState ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const daDataLocalAllValues = getState().daDataStoreReducer.suggestions
            // уже подгруженные при регистрации данные из dadata
            const { value, data } = daDataLocalAllValues.find(( { data } ) => data.kpp === kpp) ||
                daDataLocalAllValues[0]

            const response = await authApi.sendCodeToPhone({
                phone, innNumber,
                kpp,
                organizationName: value,
                taxMode: data.finance?.tax_system || 'null',
                ogrn: data.ogrn,
                okpo: data.okpo || 'null',
                legalAddress: data.address.value,
                postAddress: data.address.value,
                email: data.emails ? data.emails[0]?.value : 'null',
            })

            dispatch(authStoreActions.setIsFetching(false))
            // обрабатываем ошибку
            if (response.message) {
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                dispatch(textAndActionGlobalModal({
                    text: JSON.stringify(`Аккаунт c этим номером [ ${ phone } ] уже создан`),
                }))
                return { phoneNumber: response.message }
            }
            if (response.success) {
                dispatch(textAndActionGlobalModal({
                    text: response.success + ' ПАРОЛЬ: ' + response.password,
                }))
            }
        } catch (error: TtonErrorType) {
            dispatch(authStoreActions.setIsFetching(false))
            await dispatch(textAndActionGlobalModal({
                text: JSON.stringify(error?.response?.data?.message),
            }))
            return { innNumber: error?.response?.data?.message }
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

                // вносим данные об активном пользователе
                dispatch(authStoreActions.setAuthId(response.userid || ''))
                dispatch(authStoreActions.setAuthPhone(phone))
                // ЗАЧИЩАЕМ ФОРМУ АВТОРИЗАЦИИ
                // зачищаем список КПП
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // чистим форму ввода для следующих авторизаций
                dispatch(authStoreActions.setInitialValues({} as PhoneSubmitType))
                // надо для двойной логики рег/авт
                dispatch(authStoreActions.setIsAvailableSMSRequest(false))

                // для случаев с пере-логиниванием
                dispatch<any>(appActions.setInitialized(false))

                // сама авторизация
                dispatch(authStoreActions.setIsAuth(true))
            }

        } catch (error: TtonErrorType) {
            dispatch(authStoreActions.setIsFetching(false))

            await dispatch(textAndActionGlobalModal({
                text: JSON.stringify(error?.response?.data?.message),
            }))

            return { sms: error?.response?.data?.message }
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
            if (response.status) {
                dispatch(authStoreActions.setIsAuth(false))
                dispatch(authStoreActions.setAuthId(''))
                console.log(response.status)
            }
        } catch (error) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(error),
            }))
        }
    }

// обновляем пароль
export const newPassword = ( { phone }: AuthRequestType ): AuthStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(authStoreActions.setIsFetching(true))
        try {
            const response = await authApi.passwordRecovery({ phone })

            console.log(response)
            if (response.success) dispatch(textAndActionGlobalModal({
                text: response.success + '\n ПАРОЛЬ: ' + response.password,
            }))
            if (response.message) dispatch(textAndActionGlobalModal({
                text: response.message,
            }))

        } catch (error: TtonErrorType) {
            dispatch(authStoreActions.setIsFetching(false))

            if (error?.response?.data?.message) {
                dispatch(textAndActionGlobalModal({
                    text: error.response.data.message + '. ПРОВЕРЬТЕ ПРАВИЛЬНОСТЬ ВВОДА НОМЕРА ТЕЛЕФОНА',
                }))
            } else {
                dispatch(textAndActionGlobalModal({
                    text: JSON.stringify(error),
                }))
            }
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
                dispatch(textAndActionGlobalModal({
                    text: response.message,
                }))
            }
        } catch (error: TtonErrorType) {
            if (error?.response?.data?.message) {
                console.log(error.response.data.message)
            } else {
                dispatch(textAndActionGlobalModal({
                    text: 'Ошибка при автоматической авторизации: ' + JSON.stringify(error),
                }))
            }
        }
        dispatch(authStoreActions.setAutologinDone())
    }
