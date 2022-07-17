import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, ShippersCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'
import {initialShippersContent} from '../../initials-test-data';
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
import {getOrganizationByInnDaDataAPI, GetOrganizationByInnDaDataType} from '../../api/dadata.api';


const defaultInitialValues = {
    title: undefined,
    innNumber: undefined,
    organizationName: undefined,
    kpp: undefined,
    ogrn: undefined,
    address: undefined,
    shipperFio: undefined,
    shipperTel: undefined,
    description: undefined,
    coordinates: undefined,
    city: undefined,
} as ShippersCardType

const initialState = {
    currentId: 0,
    label: {
        // id: undefined,
        title: 'Название грузоотправителя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        shipperFio: 'ФИО отправителя',
        shipperTel: 'Телефон отправителя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
        city: undefined,
    } as ShippersCardType<string | undefined>,

    maskOn: {
        // id: undefined,
        title: undefined,
        innNumber: '########## ##', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 12 цифр
        address: undefined, // понятно. просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    initialValues: {
        // id: undefined,
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        shipperFio: undefined,
        shipperTel: undefined,
        description: undefined,
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    validators: {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(12), maxLength(100)),
        address: composeValidators(required),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
        description: composeValidators(maxLength(300)),
        coordinates: composeValidators(required),
    } as ShippersCardType<ValidateType>,

    parsers: {
        title: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        innNumber: undefined,
        organizationName: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        kpp: undefined,
        ogrn: undefined,
        address: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        shipperFio: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        shipperTel: undefined,
        description: undefined,
        coordinates: composeParsers(parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
        city: undefined,
    } as ShippersCardType<ParserType>,

    content: [] as ShippersCardType[],
}

export type ShippersStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof shippersStoreActions>

export const shippersStoreReducer = ( state = initialState, action: ActionsType ): ShippersStoreReducerStateType => {

    switch (action.type) {

        case 'shippers-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'shippers-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'shippers-store-reducer/SET-SHIPPERS-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.shippers,
                ],
            }
        }
        case 'shippers-store-reducer/ADD-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.shipper,
                ],
            }

        }
        case 'shippers-store-reducer/CHANGE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.map(( val ) => ( +( val.id || 0 ) !== action.id ) ? val : action.shipper),
                ],
            }
        }
        case 'shippers-store-reducer/DELETE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { id } ) => +( id || 1 ) !== action.id),
                ],
            }
        }
        case 'shippers-store-reducer/SET-COORDINATES': {
            return {
                ...state,
                initialValues: { ...state.initialValues, coordinates: coordsToString(action.coordinates) },
            }
        }
        case 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: defaultInitialValues,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const shippersStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setInitialValues: ( initialValues: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setDefaultInitialValues: () => ( {
        type: 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES',
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'shippers-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setCoordinates: ( coordinates: [ number, number ] ) => ( {
        type: 'shippers-store-reducer/SET-COORDINATES',
        coordinates,
    } as const ),
    setShippersContent: ( shippers: ShippersCardType[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS-CONTENT',
        shippers,
    } as const ),
    addOneShipper: ( shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/ADD-SHIPPER',
        shipper,
    } as const ),
    changeShipper: ( id: number, shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/CHANGE-SHIPPER',
        id,
        shipper,
    } as const ),
    deleteShipper: ( id: number ) => ( {
        type: 'shippers-store-reducer/DELETE-SHIPPER',
        id,
    } as const ),
}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllShippersAPI = ( { innID }: { innID: number } ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = initialShippersContent
            await dispatch(shippersStoreActions.setShippersContent(response))
        } catch (e) {
            alert(e)
        }

    }

// запрос параметров организации из DaData
export const getOrganizationByInnShipper = ( { inn }: GetOrganizationByInnDaDataType ):
    ShippersStoreReducerThunkActionType<string | null> =>
    async ( dispatch, getState ) => {

        const { innNumber } = getState().shippersStoreReducer.initialValues
        const booleanMemo = ( +( innNumber || 0 ) !== inn )
        const response = booleanMemo
            ? await getOrganizationByInnDaDataAPI({ inn })
            : null

        if (response !== null) {
            if (response.length > 0) {
                const { data } = response[0]
                dispatch(shippersStoreActions.setInitialValues({
                    ...getState().shippersStoreReducer.initialValues,
                    innNumber: data.inn,
                    organizationName: response[0].value,
                    kpp: data.kpp,
                    ogrn: data.ogrn,
                    address: data.address.value,
                }))
                return null
            } else return 'Неверный ИНН!'
        } else return null

    }