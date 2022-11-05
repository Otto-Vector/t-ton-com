import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, TransportCardType, ValidateType} from '../../types/form-types'
import {syncValidators} from '../../utils/validators'
import {syncParsers} from '../../utils/parsers';
import {transportApi} from '../../api/local-api/options/transport.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';


const initialState = {
    transportIsFetching: false,
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

    initialValues: {} as TransportCardType,

    validators: {
        transportNumber: syncValidators.trailerTransportNumber,
        transportTrademark: syncValidators.trailerTransportModel,
        transportModel: syncValidators.trailerTransportModel,
        pts: syncValidators.pts,
        dopog: syncValidators.dopog,
        cargoType: syncValidators.required,
        cargoWeight: syncValidators.cargoWeight,
        propertyRights: syncValidators.required,
        transportImage: undefined,
    } as TransportCardType<ValidateType>,

    parsers: {
        transportNumber: syncParsers.trailerTransportNumber,
        transportTrademark: undefined,
        transportModel: undefined,
        pts: syncParsers.pts,
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
        case 'transport-store-reducer/SET-CONTENT': {
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
                transportIsFetching: action.transportIsFetching,
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
        type: 'transport-store-reducer/SET-CONTENT',
        transport,
    } as const ),
    setCurrentId: ( currentId: string ) => ( {
        type: 'transport-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    toggleTransportIsFetching: ( transportIsFetching: boolean ) => ( {
        type: 'transport-store-reducer/SET-IS-FETCHING',
        transportIsFetching,
    } as const ),
}

/* САНКИ */

export type TransportStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// запрос всего транспорта пользователя от сервера
export const getAllTransportAPI = (): TransportStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(transportStoreActions.toggleTransportIsFetching(true))
        dispatch(transportStoreActions.setTransportContent([]))
        try {
            const idUser = getState().authStoreReducer.authID

            const response = await transportApi.getAllTransportByUserId({ idUser })
            if (response.message || !response.length) {
                throw new Error(response.message || `Транспорт не найден или пока не внесен`)
            } else {
                dispatch(transportStoreActions.setTransportContent(response.map(( { idUser, ...values } ) => values)))
            }
        } catch (e) {
            console.error('Ошибка в запросе списка транспорта: ', e)
        }
        dispatch(transportStoreActions.toggleTransportIsFetching(false))
    }

// добавить одну запись ТРАНСПОРТА через АПИ
export const newTransportSaveToAPI = ( values: TransportCardType<string>, image: File | undefined ): TransportStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await transportApi.createOneTransport({
                idUser, ...values,
                cargoWeight: values.cargoWeight || '0',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            console.error(e.response.data.failed)
        }
        await dispatch(getAllTransportAPI())
    }

// изменить одну запись ТРАНСПОРТА через АПИ
export const modifyOneTransportToAPI = ( values: TransportCardType<string>, image: File | undefined ): TransportStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await transportApi.modifyOneTransport({
                ...values,
                idUser,
                cargoWeight: values.cargoWeight || '0',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            console.error(JSON.stringify(e.response.data))
        }
        await dispatch(getAllTransportAPI())
    }

// удаляем один ТРАНСПОРТ
export const oneTransportDeleteToAPI = ( idTransport: string ): TransportStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await transportApi.deleteOneTransport({ idTransport })
            if (response.message) console.log(response.message)
        } catch (e) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e.response.data)))
        }
        await dispatch(getAllTransportAPI())
    }


export const rerenderTransport = (): TransportStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(transportStoreActions.toggleTransportIsFetching(true))
        await setTimeout(() =>
                dispatch(transportStoreActions.toggleTransportIsFetching(false))
            , 1000)
    }