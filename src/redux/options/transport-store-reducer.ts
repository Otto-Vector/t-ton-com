import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, TransportCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, maxRangeNumber, required} from '../../utils/validators'
import {initialTransportValues} from '../../initials-test-data';
import {
    composeParsers,
    parseNoFirstSpaces,
    parseOnlyOneSpace,
    parsePseudoLatinCharsAndNumbers,
} from '../../utils/parsers';


const initialState = {
    currentId: 0,
    label: {
        transportNumber: 'Гос. номер авто',
        transportTrademark: 'Марка авто',
        transportModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        transportImage: 'Фото транспорта',
    } as TransportCardType,

    maskOn: {
        transportNumber: undefined, // просто текст
        transportTrademark: undefined, // просто текст
        transportModel: undefined, // просто текст
        pts: undefined, // просто фото
        dopog: undefined, // просто фото
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        transportImage: undefined, // просто текст
    } as TransportCardType,

    initialValues: {
        transportNumber: undefined,
        transportTrademark: undefined,
        transportModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        transportImage: undefined,
    } as TransportCardType,

    validators: {
        transportNumber: composeValidators(required, maxLength(20)),
        transportTrademark: composeValidators(required, maxLength(20)),
        transportModel: composeValidators(required, maxLength(20)),
        pts: composeValidators(required),
        dopog: composeValidators(required),
        cargoType: composeValidators(required),
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: composeValidators(required),
        transportImage: undefined,
    } as TransportCardType<ValidateType>,

    parsers: {
        transportNumber: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces),
        transportTrademark: undefined,
        transportModel: undefined,
        pts: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces),
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        transportImage: undefined,
    } as TransportCardType<ParserType>,

    content: [] as TransportCardType[],

}

export type TransportStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof transportStoreActions>

export const transportStoreReducer = ( state = initialState, action: ActionsType ): TransportStoreReducerStateType => {

    switch (action.type) {

        case 'transport-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'transport-store-reducer/SET-TRANSPORTS-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.transport,
                ],
            }
        }
        case 'transport-store-reducer/ADD-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.transport,
                ],
            }

        }
        case 'transport-store-reducer/CHANGE-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content
                        .map(( val ) => ( +( val.id || 0 ) !== action.id ) ? val : action.transport),
                ],
            }
        }
        case 'transport-store-reducer/DELETE-TRANSPORT': {
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
export const transportStoreActions = {

    setTransportContent: ( transport: TransportCardType[] ) => ( {
        type: 'transport-store-reducer/SET-TRANSPORTS-CONTENT',
        transport,
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'transport-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),

    addTransport: ( transport: TransportCardType ) => ( {
        type: 'transport-store-reducer/ADD-TRANSPORT',
        transport,
    } as const ),
    changeTransport: ( id: number, transport: TransportCardType ) => ( {
        type: 'transport-store-reducer/CHANGE-TRANSPORT',
        id,
        transport,
    } as const ),
    deleteTransport: ( id: number ) => ( {
        type: 'transport-store-reducer/DELETE-TRANSPORT',
        id,
    } as const ),
}

/* САНКИ */

export type TransportStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllTransportAPI = ( { innID }: { innID: number } ): TransportStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = initialTransportValues
            dispatch(transportStoreActions.setTransportContent(response))
        } catch (e) {
            alert(e)
        }

    }

