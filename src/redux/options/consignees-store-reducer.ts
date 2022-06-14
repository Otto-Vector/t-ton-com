import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ConsigneesCardType, ParserType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'
import {initialConsigneesContent} from '../../initials-test-data'
import {
    composeParsers,
    parseAllCoords,
    parseFIO,
    parseNoFirstSpaces, parseOnlyOneComma,
    parseOnlyOneDash,
    parseOnlyOneDot, parseOnlyOneSpace,
} from '../../utils/parsers';

const initialState = {
    currentId: 0,

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
    } as ConsigneesCardType,

    maskOn: {
        title: undefined,
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 12 цифр
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
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(12)),
        address: composeValidators(required, maxLength(100)),
        consigneesFio: composeValidators(required),
        consigneesTel: composeValidators(required, mustBe00Numbers(11)),
        description: composeValidators(required, maxLength(300)),
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
                    ...state.content.map(( val ) => ( +( val.id || 0 ) !== action.id ) ? val : action.consignee),
                ],
            }
        }
        case 'consignees-store-reducer/DELETE-CONSIGNEE': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { id } ) => +( id || 1 ) !== action.id),
                ],
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
    setCurrentId: ( currentId: number ) => ( {
        type: 'consignees-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setConsigneesContent: ( consignees: ConsigneesCardType[] ) => ( {
        type: 'consignees-store-reducer/SET-CONSIGNEES-CONTENT',
        consignees,
    } as const ),
    addOneConsignee: ( consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/ADD-CONSIGNEE',
        consignee,
    } as const ),
    changeOneConsignee: ( id: number, consignee: ConsigneesCardType ) => ( {
        type: 'consignees-store-reducer/CHANGE-CONSIGNEE',
        id,
        consignee,
    } as const ),
    deleteConsignee: ( id: number ) => ( {
        type: 'consignees-store-reducer/DELETE-CONSIGNEE',
        id,
    } as const ),
}

/* САНКИ */

export type ConsigneesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllConsigneesAPI = ( { innID }: { innID: number } ): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = initialConsigneesContent
            await dispatch(consigneesStoreActions.setConsigneesContent(response))
        } catch (e) {
            alert(e)
        }

    }

