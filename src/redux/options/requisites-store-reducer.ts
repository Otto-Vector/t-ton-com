import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {CompanyRequisitesType, ParserType, ValidateType} from '../../types/form-types';
import {
    composeValidators,
    maxLength,
    mustBe00Numbers,
    mustBe0_0Numbers,
    mustBeMail,
    required,
} from '../../utils/validators';
import {PersonalResponseType, requisitesApi} from '../../api/options/requisites.api';
import {
    composeParsers,
    parseFIO,
    parseNoFirstSpaces,
    parseNoSpace,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace,
} from '../../utils/parsers';
import {authStoreActions, logoutAuth} from '../auth-store-reducer';
import {
    GlobalModalActionsType,
    globalModalStoreActions,
    textAndActionGlobalModal,
} from '../utils/global-modal-store-reducer';


const initialValues = {} as CompanyRequisitesType

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
    } as CompanyRequisitesType<string | undefined>,

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
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        taxMode: composeValidators(required),
        kpp: composeValidators(mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(13)),
        okpo: composeValidators(required, mustBe0_0Numbers(8)(10)),
        legalAddress: composeValidators(required),
        mechanicFIO: composeValidators(maxLength(50)),
        dispatcherFIO: composeValidators(maxLength(50)),

        postAddress: composeValidators(required),
        phoneDirector: composeValidators(required, mustBe00Numbers(11)),
        phoneAccountant: composeValidators(required, mustBe00Numbers(11)),
        email: composeValidators(required, mustBeMail),
        bikBank: composeValidators(required, mustBe00Numbers(9)),
        nameBank: composeValidators(required),
        checkingAccount: composeValidators(required, mustBe00Numbers(20)),
        korrAccount: composeValidators(required, mustBe00Numbers(20)),
    } as CompanyRequisitesType<ValidateType>,

    parsers: {
        innNumber: undefined,
        organizationName: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        taxMode: composeParsers(parseNoSpace),
        kpp: undefined,
        ogrn: undefined,
        okpo: undefined,
        legalAddress: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        mechanicFIO: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        dispatcherFIO: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),

        postAddress: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        phoneDirector: undefined,
        phoneAccountant: undefined,
        email: undefined,
        bikBank: undefined,
        nameBank: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        checkingAccount: undefined,
        korrAccount: undefined,
        tariffs: {
            create: undefined,
            acceptShortRoute: undefined,
            acceptLongRoute: undefined,
            paySafeTax: undefined,
        },

    } as CompanyRequisitesType<ParserType>,

    initialValues: { ...initialValues },

    storedValues: {} as CompanyRequisitesType,

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
        case 'requisites-store-reducer/SET-INITIAL-VALUES' : {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'requisites-store-reducer/SET-STORED-VALUES' : {
            return {
                ...state,
                storedValues: action.storedValues,
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
    setInitialValues: ( initialValues: CompanyRequisitesType ) => ( {
        type: 'requisites-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setStoredValues: ( storedValues: CompanyRequisitesType ) => ( {
        type: 'requisites-store-reducer/SET-STORED-VALUES',
        storedValues,
    } as const ),

}

/* САНКИ */
export type RequisitesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// сохранение данных реквизитов в БЭК
export const setOrganizationRequisites = ( values: CompanyRequisitesType ):
    RequisitesStoreReducerThunkActionType<string | undefined> =>
    async ( dispatch, getState ) => {
        const idUser = getState().authStoreReducer.authID
        try {
            const setPersonal = await requisitesApi.changePersonalData({
                idUser,
                nnNumber: values.innNumber,
                organizationName: values.organizationName,
                taxMode: values.taxMode,
                kpp: values.kpp || '-',
                ogrn: values.ogrn,
                okpo: values.okpo || '-',
                legalAddress: values.legalAddress,
                dispatcherFIO: values.dispatcherFIO || '-',
                mechanicFIO: values.mechanicFIO || '-',

                postAddress: values.postAddress,
                phoneDirector: values.phoneDirector,
                phoneAccountant: values.phoneAccountant,
                email: values.email,
                nameBank: values.nameBank,
                bikBank: values.bikBank,
                checkingAccount: values.checkingAccount,
                korrAccount: values.korrAccount,
            } as PersonalResponseType)

            console.log('setPersonal: ', setPersonal)

            if (setPersonal.success) {
                await dispatch(getPersonalOrganizationRequisites())
            }
        } catch (error) {

            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error.response.data)))
            return 'Ошибка сохранения данных, попробуйте ещё раз'
        }
    }

// запрос данных активного пользователя
export const getPersonalOrganizationRequisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requisitesStoreActions.setIsFetching(true))
        try {
            const idUser = getState().authStoreReducer.authID
            const user = await requisitesApi.getPersonalDataFromId({ idUser })

            if (user.message || !user.length) {
                throw new Error(user.message || `Реквизиты [ ${idUser} ] не найдены`)
            }

            if (user.length > 0) {
                dispatch<any>(authStoreActions.setAuthPhone(user[0].phone || ''))
                dispatch(requisitesStoreActions.setStoredValues({
                    ...getState().requisitesStoreReducer.initialValues,
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
            console.error('Ошибка API запроса реквизитов организации: ', error)
        }
        dispatch(requisitesStoreActions.setIsFetching(false))
    }

export const deletePersonalOrganizationRequisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const idUser = getState().authStoreReducer.authID
            const response = await requisitesApi.removePersonalData({ idUser })
            console.log(response.message)
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(response.message)))
            dispatch(logoutAuth())
        } catch (error) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(error.response?.error)))
        }
    }