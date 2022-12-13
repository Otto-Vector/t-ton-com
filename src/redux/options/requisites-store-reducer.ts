import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {CompanyRequisitesApiType, CompanyRequisitesType, ParserType, ValidateType} from '../../types/form-types';
import {syncValidators} from '../../utils/validators';
import {requisitesApi} from '../../api/local-api/options/requisites.api';
import {syncParsers} from '../../utils/parsers';
import {authStoreActions, logoutAuth} from '../auth-store-reducer';
import {
    GlobalModalActionsType,
    globalModalStoreActions,
    textAndActionGlobalModal,
} from '../utils/global-modal-store-reducer';
import {GetActionsTypes} from '../../types/ts-utils';
import {TtonErrorType} from '../../api/local-api/back-instance.api';


const initialState = {
    isFetching: false,
    storedMode: false, // подгружать данные или вводить новые м.б удалю
    innError: null as null | string,
    isRequisitesError: false,

    label: {
        innNumber: 'ИНН Организации',
        organizationName: 'Наименование организации',
        taxMode: 'Вид налогов',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        okpo: 'ОКПО',
        legalAddress: 'Юридический адрес',
        mechanicFIO: 'ФИО механика',
        dispatcherFIO: 'ФИО диспетчера',

        postAddress: 'Почтовый адрес',
        phoneDirector: 'Телефон директора',
        phoneAccountant: 'Телефон бухгалтера',
        email: 'Электронная почта',
        bikBank: 'БИК Банка',
        nameBank: 'Наименование Банка',
        checkingAccount: 'Расчётный счёт',
        korrAccount: 'Корреспондентский счёт',
    } as CompanyRequisitesType,

    maskOn: {
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        taxMode: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '#############', // 13 цифр
        okpo: '##########', // 8,10 цифр
        legalAddress: undefined, //  юридический адрес
        mechanicFIO: undefined, // просто текст
        dispatcherFIO: undefined, // просто текст
        postAddress: undefined, // просто адрес
        phoneDirector: '+7 (###) ###-##-##', //
        phoneAccountant: '+7 (###) ###-##-##',
        email: undefined, // по другой схеме
        bikBank: '#########', // 9 цифр
        nameBank: undefined, // просто текст
        checkingAccount: '#### #### #### #### ####', // 20 цифр
        korrAccount: '#### #### #### #### ####', // 20 цифр
    } as CompanyRequisitesType,

    validators: {
        innNumber: syncValidators.inn,
        organizationName: syncValidators.textReqMin,
        taxMode: syncValidators.required,
        kpp: syncValidators.required,
        ogrn: syncValidators.ogrn,
        okpo: syncValidators.okpo,
        legalAddress: syncValidators.textReqMiddle,
        mechanicFIO: syncValidators.textMin,
        dispatcherFIO: syncValidators.textMin,

        postAddress: syncValidators.textReqMiddle,
        phoneDirector: syncValidators.phone,
        phoneAccountant: syncValidators.phone,
        email: syncValidators.email,
        bikBank: syncValidators.bikBank,
        nameBank: syncValidators.textReqMin,
        checkingAccount: syncValidators.account,
        korrAccount: syncValidators.account,
    } as CompanyRequisitesType<ValidateType>,

    parsers: {
        innNumber: undefined,
        organizationName: syncParsers.title,
        taxMode: undefined,
        kpp: undefined,
        ogrn: undefined,
        okpo: undefined,
        legalAddress: syncParsers.title,
        mechanicFIO: syncParsers.fio,
        dispatcherFIO: syncParsers.fio,

        postAddress: syncParsers.title,
        phoneDirector: undefined,
        phoneAccountant: undefined,
        email: undefined,
        bikBank: undefined,
        nameBank: syncParsers.title,
        checkingAccount: undefined,
        korrAccount: undefined,
        tariffs: {
            create: undefined,
            acceptShortRoute: undefined,
            acceptLongRoute: undefined,
            paySafeTax: undefined,
        },

    } as CompanyRequisitesType<ParserType>,

    storedValues: {} as CompanyRequisitesType,

    filteredContent: [ {} ] as Partial<CompanyRequisitesType>[] | null,
}

export type RequisitesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof requisitesStoreActions>

export const requisitesStoreReducer = ( state = initialState, action: ActionsType ): RequisitesStoreReducerStateType => {

    switch (action.type) {

        case 'requisites-store-reducer/CHANGE-IS-FETCHING': {
            return {
                ...state,
                isFetching: action.isFetching,
            }
        }
        case 'requisites-store-reducer/SET-IS-REQUISITES-ERROR': {
            return {
                ...state,
                isRequisitesError: action.isRequisitesError,
            }
        }
        case 'requisites-store-reducer/SET-STORED-VALUES' : {
            return {
                ...state,
                storedValues: action.storedValues,
            }
        }
        case 'requisites-store-reducer/SET-FILTERED-CONTENT': {
            return {
                ...state,
                filteredContent: action.filteredContent,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const requisitesStoreActions = {

    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'requisites-store-reducer/CHANGE-IS-FETCHING',
        isFetching,
    } as const ),
    setIsRequisitesError: ( isRequisitesError: boolean ) => ( {
        type: 'requisites-store-reducer/SET-IS-REQUISITES-ERROR',
        isRequisitesError,
    } as const ),
    setStoredValues: ( storedValues: CompanyRequisitesType ) => ( {
        type: 'requisites-store-reducer/SET-STORED-VALUES',
        storedValues,
    } as const ),
    setFilteredContent: ( filteredContent: Partial<CompanyRequisitesType>[] | null ) => ( {
        type: 'requisites-store-reducer/SET-FILTERED-CONTENT',
        filteredContent,
    } as const ),
}

/* САНКИ */
export type RequisitesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// сохранение данных реквизитов в БЭК
export const setOrganizationRequisites = ( values: CompanyRequisitesType ):
    RequisitesStoreReducerThunkActionType<string | undefined> =>
    async ( dispatch, getState ) => {
        dispatch(requisitesStoreActions.setIsFetching(true))
        const idUser = getState().authStoreReducer.authID
        const placeholder = '-'
        try {
            const setPersonal = await requisitesApi.changePersonalData({
                idUser,
                nnNumber: values.innNumber,
                organizationName: values.organizationName,
                taxMode: values.taxMode,
                kpp: values.kpp || placeholder,
                ogrn: values.ogrn,
                okpo: values.okpo || placeholder,
                legalAddress: values.legalAddress,
                dispatcherFIO: values.dispatcherFIO || placeholder,
                mechanicFIO: values.mechanicFIO || placeholder,

                postAddress: values.postAddress,
                phoneDirector: values.phoneDirector,
                phoneAccountant: values.phoneAccountant,
                email: values.email,
                nameBank: values.nameBank,
                bikBank: values.bikBank,
                checkingAccount: values.checkingAccount,
                korrAccount: values.korrAccount,
            } as CompanyRequisitesApiType)

            if (setPersonal.success) {
                await dispatch(getPersonalOrganizationRequisites())
            }

        } catch (error: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error?.response?.data)))
            dispatch(requisitesStoreActions.setIsFetching(false))
            return 'Ошибка сохранения данных, попробуйте ещё раз'
        }
    }

// сохранение данных оплаты в БЭК
export const setOrganizationCashRequisites = ( cash: number ): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requisitesStoreActions.setIsFetching(true))
        const idUser = getState().authStoreReducer.authID
        const localCash = +( getState().requisitesStoreReducer.storedValues.cash || 0 )
        try {
            const setPersonal = await requisitesApi.changePersonalData({
                idUser, cash: localCash + cash,
            } as CompanyRequisitesApiType)

            if (setPersonal.success) {
                await dispatch(getPersonalOrganizationRequisites())
            }
        } catch (error) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error.response.data)))
            dispatch(requisitesStoreActions.setIsFetching(false))
        }
    }

// списание оплаты за создание заявки
export const addRequestCashPay = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const cost = +( getState().requisitesStoreReducer.storedValues.tariffs.create || 0 )
        await dispatch(setOrganizationCashRequisites(-cost))
    }

// возврат оплаты за создание заявки
export const cancelRequestCashReturn = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const cost = +( getState().requisitesStoreReducer.storedValues.tariffs.create || 0 )
        await dispatch(setOrganizationCashRequisites(cost))
    }

// оплата за принятие заявки на КОРОТКОЙ дистанции
export const acceptShorRoutePay = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const cost = +( getState().requisitesStoreReducer.storedValues.tariffs.acceptShortRoute || 0 )
        await dispatch(setOrganizationCashRequisites(-cost))
    }

// оплата за принятие заявки на ДЛИННОЙ дистанции
export const acceptLongRoutePay = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const cost = +( getState().requisitesStoreReducer.storedValues.tariffs.acceptLongRoute || 0 )
        await dispatch(setOrganizationCashRequisites(-cost))
    }

// запрос данных активного пользователя
export const getPersonalOrganizationRequisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requisitesStoreActions.setIsFetching(true))
        try {
            const idUser = getState().authStoreReducer.authID
            const user = await requisitesApi.getPersonalDataFromId({ idUser })

            if (user.message || !user.length) {
                throw new Error(user.message || `Реквизиты [ ${ idUser } ] не найдены`)
            }

            if (user.length > 0) {
                dispatch<any>(authStoreActions.setAuthPhone(user[0].phone || ''))
                dispatch(requisitesStoreActions.setStoredValues({
                    // ...getState().requisitesStoreReducer.initialValues,
                    innNumber: user[0].nnNumber,
                    organizationName: user[0].organizationName,
                    taxMode: user[0].taxMode,
                    kpp: user[0].kpp,
                    ogrn: user[0].ogrn,
                    okpo: user[0].okpo,
                    legalAddress: user[0].legalAddress,
                    description: user[0].description,
                    dispatcherFIO: user[0].dispatcherFIO,
                    mechanicFIO: user[0].mechanicFIO,

                    cash: user[0].cash,
                    requestActiveCount: user[0].requestActiveCount,
                    maxRequests: user[0].maxRequests,

                    postAddress: user[0].postAddress,
                    phoneDirector: user[0].phoneDirector,
                    phoneAccountant: user[0].phoneAccountant,
                    email: user[0].email,
                    bikBank: user[0].bikBank,
                    nameBank: user[0].nameBank,
                    checkingAccount: user[0].checkingAccount,
                    korrAccount: user[0].korrAccount,
                    tariffs: {
                        create: user[0].tarifCreate,
                        acceptShortRoute: user[0].tarifAcceptShortRoute,
                        acceptLongRoute: user[0].tarifAcceptLongRoute,
                        paySafeTax: user[0].tarifPaySafeTax,
                    },
                } as CompanyRequisitesType))
                // проверяем, было ли ошибочно забыто про реквизиты
                if (!( user[0].taxMode &&
                    user[0].postAddress &&
                    user[0].phoneDirector &&
                    user[0].phoneAccountant &&
                    user[0].email &&
                    user[0].bikBank &&
                    user[0].nameBank &&
                    user[0].checkingAccount &&
                    user[0].korrAccount )) {
                    dispatch(requisitesStoreActions.setIsRequisitesError(true))
                    await dispatch(textAndActionGlobalModal({
                        text: 'НЕОБХОДИМО ЗАПОЛНИТЬ ДАННЫЕ РЕКВИЗИТОВ!',
                        navigateOnOk: getState().routesStoreReducer.routes.requisites + 'new',
                        navigateOnCancel: getState().routesStoreReducer.routes.requisites + 'new',
                    }))
                }
            }
        } catch (error) {
            // console.error('Ошибка API запроса реквизитов организации: ', error)
            dispatch(globalModalStoreActions.setTextMessage('Ошибка API запроса реквизитов организации: ' + error))
            dispatch(requisitesStoreActions.setIsFetching(false))
        }
        dispatch(requisitesStoreActions.setIsFetching(false))
    }

// удалить данного пользователя (если вдруг что)
export const deletePersonalOrganizationRequisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const idUser = getState().authStoreReducer.authID
            const response = await requisitesApi.removePersonalData({ idUser })
            if (response.message) {
                dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(response.message)))
            }
        } catch (error: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error.response?.error)))
        }
        dispatch(logoutAuth())
    }

// загрузить список данных для сопоставления в заявках
export const getListOrganizationRequisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(requisitesStoreActions.setFilteredContent(null))
        try {
            const response = await requisitesApi.getPersonalDataList()
            if (response.message) {
                console.log('Сообщение в запросе списка пользователей', JSON.stringify(response.message))
            }
            if (response.length > 0) {
                dispatch(requisitesStoreActions.setFilteredContent(response.filter(
                    ( { idUser, nnNumber } ) => idUser && nnNumber)?.map(
                    ( {
                          idUser,
                          nnNumber,
                          organizationName,
                          taxMode,
                          kpp,
                          ogrn,
                          okpo,
                          legalAddress,
                          dispatcherFIO,
                          mechanicFIO,
                          bikBank,
                          checkingAccount,
                          korrAccount,
                          nameBank,
                          email,
                          phoneDirector,
                          phoneAccountant,
                          postAddress,
                          description,
                      } ) => ( {
                        idUser,
                        innNumber: nnNumber,
                        organizationName,
                        taxMode,
                        kpp,
                        ogrn,
                        okpo,
                        legalAddress,
                        dispatcherFIO,
                        mechanicFIO,
                        bikBank,
                        checkingAccount,
                        korrAccount,
                        nameBank,
                        email,
                        phoneDirector,
                        phoneAccountant,
                        postAddress,
                        description,
                    } ),
                ) || null))
            }
        } catch (error: TtonErrorType) {
            console.log('Не удалось загрузить список пользователей: ', error)
        }
    }