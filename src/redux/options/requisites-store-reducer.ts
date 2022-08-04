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
import {getOrganizationByInnKPPDaDataAPI, GetOrganizationByInnKPPDaDataType} from '../../api/dadata.api';
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
import {authStoreActions} from '../auth-store-reducer';


const initialValues: CompanyRequisitesType = {
    innNumber: undefined,
    organizationName: undefined,
    taxMode: undefined,
    kpp: undefined,
    ogrn: undefined,
    okpo: undefined,
    legalAddress: undefined,
    mechanicFIO: undefined,
    dispatcherFIO: undefined,

    postAddress: undefined,
    phoneDirector: undefined,
    phoneAccountant: undefined,
    email: undefined,
    bikBank: undefined,
    nameBank: undefined,
    checkingAccount: undefined,
    korrAccount: undefined,
    tarifs: {
        create: undefined,
        acceptShortRoute: undefined,
        acceptLongRoute: undefined,
        paySafeTax: undefined,
    },
    cash: undefined,
    description: undefined,
    maxRequests: undefined,
    requestActiveCount: undefined,
}

const initialState = {
    isFetching: false,
    storedMode: false, // подгружать данные или вводить новые м.б удалю
    innError: null as null | string,

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
        kpp: composeValidators(required, mustBe00Numbers(9)),
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
        tarifs: {
            create: undefined,
            acceptShortRoute: undefined,
            acceptLongRoute: undefined,
            paySafeTax: undefined,
        },

    } as CompanyRequisitesType<ParserType>,

    initialValues: { ...initialValues },

    storedValues: {
        innNumber: '4265631947',
        organizationName: 'Тестовое наименование',
        taxMode: 'УСН',
        kpp: '839646136',
        ogrn: '5179220547402',
        okpo: '7512278594',
        legalAddress: 'Россия, г. Нижний Тагил, Пушкина ул., д. 23 кв.173',
        description: undefined,

        postAddress: 'Россия, г. Магнитогорск, Колхозная ул., д. 19 кв.40',
        phoneDirector: '+7 (965) 461-43-67',
        phoneAccountant: '+7 (993) 383-63-63',
        email: 'valentina19@outlook.com',
        bikBank: '648417961',
        nameBank: 'СБЕРБАНК СБЕР СБЕРБАНК',
        checkingAccount: '40560033000000009122',
        korrAccount: '50934220600000004673',
        tarifs: {
            create: '100',
            acceptShortRoute: '100',
            acceptLongRoute: '100',
            paySafeTax: '3',
        },
    } as CompanyRequisitesType,

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
        case 'requisites-store-reducer/SET-INN-ERROR': {
            return {
                ...state,
                innError: action.innError,
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
    setInitialValues: ( initialValues: CompanyRequisitesType ) => ( {
        type: 'requisites-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setStoredValues: ( storedValues: CompanyRequisitesType ) => ( {
        type: 'requisites-store-reducer/SET-STORED-VALUES',
        storedValues,
    } as const ),
    setInnError: ( innError: string | null ) => ( {
        type: 'requisites-store-reducer/SET-INN-ERROR',
        innError,
    } as const ),
}

/* САНКИ */

export type RequisitesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// запрос параметров организации из DaData и установка этих данных в бэк
export const setOrganizationByInnKpp = ( { inn, kpp }: GetOrganizationByInnKPPDaDataType ):
    RequisitesStoreReducerThunkActionType<{ innNumber: string } | null> =>
    async ( dispatch, getState ) => {

        const response = await getOrganizationByInnKPPDaDataAPI({ inn, kpp })
        console.log('innKPPdaDataResp: ', response)
        if (response.length > 0) {
            const { data } = response[0]
            const setPersonal = await requisitesApi.setPersonalData({
                // idUser: 'e041ccb0-7848-4064-981d-f861897a8fdd',
                idUser: getState().authStoreReducer.authID,
                innNumber: data.inn,
                organizationName: response[0].value,
                taxMode: data.finance?.tax_system || undefined,
                kpp: data.kpp,
                ogrn: data.ogrn,
                okpo: data.okpo,
                legalAddress: data.address.value,
                postAddress: data.address.value,
                email: data.emails && data.emails[0]?.value || undefined,
            } as PersonalResponseType)
            console.log('setPersonal: ', setPersonal)

            return null

        } else {
            return { innNumber: 'Неверный ИНН!' }
        }
    }

// сохранение данных реквизитов в БЭК
export const setOrganizationRequisites = ():
    RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        const setPersonal = await requisitesApi.changePersonalData({
            idUser: 'e041ccb0-7848-4064-981d-f861897a8fdd',
            innNumber: '3459008089',
            organizationName: 'Тестовые данн-ые',
            taxMode: 'УСН',
            kpp: '345901010',
            ogrn: '12345678',
            okpo: '22403359',
            legalAddress: '400078, г Волгоград, пр-кт им. В.И. Ленина, д 67, офис 207',
            postAddress: '400078, г Волгоград, пр-кт им. В.И. Ленина, д 67, офис 207',
            email: 'ttt@yaya.ru',
            phone: '+7 (938) 693-07-27',
        } as PersonalResponseType)
        console.log('setPersonal: ', setPersonal)
        // if (setPersonal.success) {
        //     return null
        // } else {
        //     return { innNumber: 'Неверный ИНН!' }
        // }
    }

// запрос данных активного пользователя
export const getPersonalReqisites = ( ): RequisitesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const idUser = getState().authStoreReducer.authID
            const user = await requisitesApi.getPersonalDataFromId({idUser})
            if (user.length > 0) {
                dispatch<any>(authStoreActions.setAuthPhone(user[0].phone||''))
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

                    postAddress: user[0].postAddress,
                    phoneDirector: user[0].phoneDirector,
                    phoneAccountant: user[0].phoneAccountant,
                    email: user[0].email,
                    bikBank: user[0].bikBank,
                    nameBank: user[0].nameBank,
                    checkingAccount: user[0].checkingAccount,
                    korrAccount: user[0].korrAccount,
                    tarifs: {
                        create: user[0].tarifCreate,
                        acceptShortRoute: user[0].tarifAcceptShortRoute,
                        acceptLongRoute: user[0].tarifAcceptLongRoute,
                        paySafeTax: user[0].tarifPaySafeTax,
                    },
                } as CompanyRequisitesType))
            }

        } catch (error) {

            // @ts-ignore
            if (error.response) console.log(error.response.data.message)
        }
    }
