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
import {getOrganizationByInnDaDataAPI, GetOrganizationByInnDaDataType} from '../../api/dadata.api';
import {PersonalResponseType, requisitesApi} from '../../api/requisites.api';
import {authStoreActions} from '../auth-store-reducer';
import {
    composeParsers,
    parseFIO,
    parseNoFirstSpaces,
    parseNoSpace,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace,
} from '../../utils/parsers';


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
    } as CompanyRequisitesType<string|undefined>,

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

    initialValues: {
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

    } as CompanyRequisitesType,

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

// запрос параметров организации из DaData
export const getOrganizationByInn = ( { inn }: GetOrganizationByInnDaDataType ):
    RequisitesStoreReducerThunkActionType<{ innNumber: string } | null> =>
    async ( dispatch, getState ) => {

        const response = await getOrganizationByInnDaDataAPI({ inn })

        if (response.length > 0) {
            const { data } = response[0]
            dispatch(requisitesStoreActions.setInitialValues({
                ...getState().requisitesStoreReducer.initialValues,
                innNumber: data.inn,
                organizationName: response[0].value,
                taxMode: data.finance?.tax_system,
                kpp: data.kpp,
                ogrn: data.ogrn,
                okpo: data.okpo,
                legalAddress: data.address.value,
                postAddress: data.address.value,
                email: data.emails && data.emails[0]?.value,
            }))

            return null

        } else {
            return { innNumber: 'Неверный ИНН!' }
        }
    }

// запрос данных активного пользователя
export const getPersonalReqisites = (): RequisitesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await requisitesApi.getPersonalAuthData()
            let user: PersonalResponseType
            if (response.userid) {
                user = await requisitesApi.getPersonalDataFromId({ idUser: response.userid })
                console.log(user)
                dispatch(requisitesStoreActions.setInitialValues({
                    innNumber: user.nnNumber,
                    organizationName: user.organizationName,
                    taxMode: user.taxMode,
                    kpp: user.kpp,
                    ogrn: user.ogrn,
                    okpo: user.okpo,
                    legalAddress: user.legalAddress,
                    description: user.description,

                    postAddress: user.postAddress,
                    phoneDirector: user.phoneDirector,
                    phoneAccountant: user.phoneAccountant,
                    email: user.email,
                    bikBank: user.bikBank,
                    nameBank: user.nameBank,
                    checkingAccount: user.checkingAccount,
                    korrAccount: user.korrAccount,
                    tarifs: {
                        create: user.tarifCreate,
                        acceptShortRoute: user.tarifAcceptShortRoute,
                        acceptLongRoute: user.tarifAcceptLongRoute,
                        paySafeTax: user.tarifPaySafeTax,
                    },
                } as CompanyRequisitesType))
            }
            dispatch<any>(authStoreActions.setIsAuth(true))
        } catch (error) {

            // @ts-ignore
            if (error.response) console.log(error.response.data.message)
        }
    }
