import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, TransportCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, maxRangeNumber, required} from '../../utils/validators'
import {
    composeParsers,
    parseNoFirstSpaces,
    parseOnlyOneSpace,
    parsePseudoLatinCharsAndNumbers,
} from '../../utils/parsers';
import {transportApi} from '../../api/options/transport.api';


const initialState = {
    transportIsFetchig: false,
    currentId: '',
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
    } as TransportCardType<string | undefined>,

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
        case 'transport-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                transportIsFetchig: action.transportIsFetchig,
            }
        }
        case 'transport-store-reducer/CHANGE-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content
                        .map(( val ) => ( val.idTransport !== action.idTransport ) ? val : action.transport),
                ],
            }
        }
        case 'transport-store-reducer/DELETE-TRANSPORT': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { idTransport } ) => idTransport !== action.idTransport),
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
    setCurrentId: ( currentId: string ) => ( {
        type: 'transport-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),

    changeTransport: ( idTransport: string, transport: TransportCardType ) => ( {
        type: 'transport-store-reducer/CHANGE-TRANSPORT',
        idTransport,
        transport,
    } as const ),
    deleteTransport: ( idTransport: string ) => ( {
        type: 'transport-store-reducer/DELETE-TRANSPORT',
        idTransport,
    } as const ),
    toggleTransportIsFetching: ( transportIsFetchig: boolean ) => ( {
        type: 'transport-store-reducer/SET-IS-FETCHING',
        transportIsFetchig,
    } as const ),
}

/* САНКИ */

export type TransportStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// запрос всего транспорта пользователя от сервера
export const getAllTransportAPI = (): TransportStoreReducerThunkActionType =>
    async ( dispatch,getState ) => {
        dispatch(transportStoreActions.toggleTransportIsFetching(true))
        try {
            const idUser = getState().authStoreReducer.authID
            // const response = initialTransportValues
            const response = await transportApi.getAllTransportByUserId({ idUser })
            dispatch(transportStoreActions.setTransportContent(response.map(( { idUser, ...values } ) => values)))

            if (!response.length) console.log('Пока ни одного ТРАНСПОРТА')
        } catch (e) {
            alert(e)
        }
        dispatch(transportStoreActions.toggleTransportIsFetching(false))
    }

// добавить одну запись ТРАНСПОРТА через АПИ
export const newTransportSaveToAPI = ( values: TransportCardType<string> ): TransportStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await transportApi.createOneTranstport({ idUser, ...values, cargoWeight: values.cargoWeight || '0' })
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(e.response.data.failed)
        }
        await dispatch(getAllTransportAPI())
    }

// изменить одну запись ГРУЗОполучателя через АПИ
export const modifyOneTransportToAPI = ( values: TransportCardType<string> ): TransportStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await transportApi.modifyOneTranstport({
                ...values,
                idUser,
                cargoWeight: values.cargoWeight || '0'
            })
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllTransportAPI())
    }

// удаляем один ТРАНСПОРТ
export const oneTransportDeleteToAPI = ( idTransport: string ): TransportStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await transportApi.deleteOneTranstport({ idTransport })
            if (response.message) console.log(response.message)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllTransportAPI())
    }