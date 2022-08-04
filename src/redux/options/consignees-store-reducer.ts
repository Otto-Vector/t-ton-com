import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ConsigneesCardType, ParserType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'
import {
    composeParsers,
    coordsToString,
    parseAllCoords,
    parseFIO,
    parseNoFirstSpaces,
    parseOnlyOneComma,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace,
} from '../../utils/parsers';
import {GetOrganizationByInnDaDataType} from '../../api/dadata.api';
import {getOrganizationsByInn} from '../dadata-response-reducer';
import {consigneesApi} from '../../api/options/consignees.api';

const defaultInitialValues = {
    idRecipient: '',
    title: undefined,
    innNumber: undefined,
    organizationName: undefined,
    kpp: undefined,
    ogrn: undefined,
    address: undefined,
    consigneesFio: undefined,
    consigneesTel: undefined,
    description: undefined,
    coordinates: undefined,
} as ConsigneesCardType


const initialState = {
    currentId: '',

    label: {
        title: 'Название грузополучателя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        consigneesFio: 'ФИО получателя',
        consigneesTel: 'Телефон получателя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    } as ConsigneesCardType<string | undefined>,

    maskOn: {
        title: undefined,
        innNumber: '########## ##', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############# ##', // 13,15 цифр
        address: undefined, // понятно. просто адрес
        consigneesFio: undefined, //
        consigneesTel: '+7 (###) ###-##-##', //
        description: undefined, // много букав
        coordinates: undefined,
    } as ConsigneesCardType,

    initialValues: {
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        consigneesFio: undefined,
        consigneesTel: undefined,
        description: undefined,
        coordinates: undefined,
    } as ConsigneesCardType,

    validators: {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(100)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe0_0Numbers(13)(15)),
        address: composeValidators(required, maxLength(150)),
        consigneesFio: composeValidators(required),
        consigneesTel: composeValidators(required, mustBe00Numbers(11)),
        description: composeValidators(maxLength(300)),
        coordinates: composeValidators(required),
    } as ConsigneesCardType<ValidateType>,

    parsers: {
        title: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
        innNumber: undefined,
        organizationName: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        kpp: undefined,
        ogrn: undefined,
        address: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        consigneesFio: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        consigneesTel: undefined,
        description: undefined,
        coordinates: composeParsers(parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
        city: undefined,
    } as ConsigneesCardType<ParserType>,

    content: [] as ConsigneesCardType[],
}

export type ConsigneesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof consigneesStoreActions>

export const consigneesStoreReducer = ( state = initialState, action: ActionsType ): ConsigneesStoreReducerStateType => {

    switch (action.type) {

        case 'consignees-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'consignees-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'consignees-store-reducer/SET-CONSIGNEES-CONTENT': {
            return {
                ...state,
                content: action.consignees,
            }
        }
        case 'consignees-store-reducer/ADD-CONSIGNEE': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.consignee,
                ],
            }

        }
        case 'consignees-store-reducer/CHANGE-CONSIGNEE': {
            return {
                ...state,
                content: [
                    ...state.content.map(( val ) => ( val.idRecipient !== action.idRecipient ) ? val : action.consignee),
                ],
            }
        }
        case 'consignees-store-reducer/DELETE-CONSIGNEE': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { idRecipient } ) => idRecipient !== action.idRecipient),
                ],
            }
        }
        case 'consignees-store-reducer/SET-COORDINATES': {
            return {
                ...state,
                initialValues: { ...state.initialValues, coordinates: coordsToString(action.coordinates) },
            }
        }
        case 'consignees-store-reducer/SET-DEFAULT-INITIAL-VALUES' : {
            return {
                ...state,
                initialValues: defaultInitialValues, //обнуляем значения для номального просмотра новой карточки
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const consigneesStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setInitialValues: ( initialValues: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setDefaultInitialValues: () => ( {
        type: 'consignees-store-reducer/SET-DEFAULT-INITIAL-VALUES',
    } as const ),
    setCurrentId: ( currentId: string ) => ( {
        type: 'consignees-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setCoordinates: ( coordinates: [ number, number ] ) => ( {
        type: 'consignees-store-reducer/SET-COORDINATES',
        coordinates,
    } as const ),
    setConsigneesContent: ( consignees: ConsigneesCardType[] ) => ( {
        type: 'consignees-store-reducer/SET-CONSIGNEES-CONTENT',
        consignees,
    } as const ),
    addOneConsignee: ( consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/ADD-CONSIGNEE',
        consignee,
    } as const ),
    changeOneConsignee: ( idRecipient: string, consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/CHANGE-CONSIGNEE',
        idRecipient,
        consignee,
    } as const ),
    deleteConsignee: ( idRecipient: string ) => ( {
        type: 'consignees-store-reducer/DELETE-CONSIGNEE',
        idRecipient,
    } as const ),
}

/* САНКИ */

export type ConsigneesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllConsigneesAPI = (): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const idUser = getState().authStoreReducer.authID
            if (idUser) {
                const response = await consigneesApi.getAllCosigneesByUserId({ idUser })
                dispatch(consigneesStoreActions.setConsigneesContent(response
                    .map(( { idUser, ...values } ) => values)))
                if (!!response.length) console.log('Пока ни одного Грузополучателя!')
            } else {
                console.log('Пока не авторизован!')
            }
        } catch (e) {
            alert(e)
        }

    }

// запрос параметров организации из DaData
export const getOrganizationByInnConsignee = ( { inn }: GetOrganizationByInnDaDataType ):
    ConsigneesStoreReducerThunkActionType<string | null> =>
    async ( dispatch, getState ) => {
        // обрезаем повторное срабатывание
        const { innNumber } = getState().consigneesStoreReducer.initialValues
        const booleanMemo = ( +( innNumber || 0 ) !== inn )
        const response = booleanMemo
            ? await dispatch<any>(getOrganizationsByInn({ inn }))
            : null

        if (response !== null) {
            return response
        } else return null

    }

// сохранение параметров организации из ранее загруженного списка DaData
export const setOrganizationByInnKppConsignee = ( { kppNumber }: { kppNumber: string } ):
    ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        const response = getState().daDataStoreReducer.suggestions.filter(( { data: { kpp } } ) => kpp === kppNumber)[0]

        if (response !== undefined) {
            const { data } = response
            dispatch(consigneesStoreActions.setInitialValues({
                ...getState().consigneesStoreReducer.initialValues,
                innNumber: data.inn,
                organizationName: response.value,
                kpp: data.kpp,
                ogrn: data.ogrn,
                address: data.address.value,
            }))
        } else alert('Фильтр КПП локально не сработал!')

    }