import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, TrailerCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, maxRangeNumber, required} from '../../utils/validators'
import {initialTrailerValues} from '../../initials-test-data';
import {
    composeParsers,
    parseNoFirstSpaces,
    parseOnlyOneSpace,
    parsePseudoLatinCharsAndNumbers,
} from '../../utils/parsers';


const initialState = {
    currentId: 0,

    label: {
        trailerNumber: 'Гос. номер авто',
        trailerTrademark: 'Марка авто',
        trailerModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        trailerImage: 'Фото транспорта',
    } as TrailerCardType<string|undefined>,

    maskOn: {
        trailerNumber: undefined, // просто текст
        trailerTrademark: undefined, // просто текст
        trailerModel: undefined, // просто текст
        pts: undefined, // просто текст
        dopog: undefined, // просто текст
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        trailerImage: undefined, // просто текст
    } as TrailerCardType,

    initialValues: {
        trailerNumber: undefined,
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        trailerImage: undefined,
    } as TrailerCardType,

    validators: {
        trailerNumber: composeValidators(required, maxLength(20)),
        trailerTrademark: composeValidators(required, maxLength(30)),
        trailerModel: composeValidators(required, maxLength(30)),
        pts: composeValidators(required),
        dopog: composeValidators(required),
        cargoType: composeValidators(required),
        cargoWeight: composeValidators(required, maxRangeNumber(50)),
        propertyRights: composeValidators(required),
        trailerImage: undefined,
    } as TrailerCardType<ValidateType>,

    parsers: {
        trailerNumber: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces),
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces),
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        trailerImage: undefined,
    } as TrailerCardType<ParserType>,

    content: [] as TrailerCardType[],
}

export type TrailerStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof trailerStoreActions>

export const trailerStoreReducer = ( state = initialState, action: ActionsType ): TrailerStoreReducerStateType => {

    switch (action.type) {

        case 'trailer-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'trailer-store-reducer/SET-TRANSPORTS-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.trailer,
                ],
            }
        }
        case 'trailer-store-reducer/ADD-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.trailer,
                ],
            }

        }
        case 'trailer-store-reducer/CHANGE-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content
                        .map(( val ) => ( +( val.id || 0 ) !== action.id ) ? val : action.trailer),
                ],
            }
        }
        case 'trailer-store-reducer/DELETE-TRANSPORT': {
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
export const trailerStoreActions = {
    setTrailerContent: ( trailer: TrailerCardType[] ) => ( {
        type: 'trailer-store-reducer/SET-TRANSPORTS-CONTENT',
        trailer,
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'trailer-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),

    addTrailer: ( trailer: TrailerCardType ) => ( {
        type: 'trailer-store-reducer/ADD-TRANSPORT',
        trailer,
    } as const ),
    changeTrailer: ( id: number, trailer: TrailerCardType ) => ( {
        type: 'trailer-store-reducer/CHANGE-TRANSPORT',
        id,
        trailer,
    } as const ),
    deleteTrailer: ( id: number ) => ( {
        type: 'trailer-store-reducer/DELETE-TRANSPORT',
        id,
    } as const ),

}

/* САНКИ */

export type TrailerStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllTrailerAPI = ( { innID }: { innID: number } ): TrailerStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = initialTrailerValues
            dispatch(trailerStoreActions.setTrailerContent(response))
        } catch (e) {
            alert(e)
        }

    }
