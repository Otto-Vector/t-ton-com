import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ParserType, TrailerCardType, ValidateType} from '../../types/form-types'
import {syncValidators} from '../../utils/validators'
import {syncParsers} from '../../utils/parsers';
import {trailerApi} from '../../api/local-api/options/trailer.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {GetActionsTypes} from '../../types/ts-utils';
import {TtonErrorType} from '../../api/local-api/back-instance.api';


const initialState = {
    trailerIsFetching: false,
    currentId: '',

    label: {
        trailerNumber: 'Гос. номер прицепа',
        trailerTrademark: 'Марка прицепа',
        trailerModel: 'Модель прицепа',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        trailerImage: 'Фото транспорта',
    } as Record<keyof TrailerCardType, string>,

    maskOn: {
        trailerNumber: 'AA #### | ### rus',
        trailerTrademark: undefined, // просто текст
        trailerModel: undefined, // просто текст
        pts: '## AA ######',
        dopog: undefined, // просто текст
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        trailerImage: undefined, // просто текст
    } as TrailerCardType,

    initialValues: {} as TrailerCardType,

    validators: {
        trailerNumber: syncValidators.trailerNumber,
        trailerTrademark: syncValidators.trailerTransportModel,
        trailerModel: syncValidators.trailerTransportModel,
        pts: syncValidators.pts,
        dopog: syncValidators.dopog,
        cargoType: syncValidators.required,
        cargoWeight: syncValidators.cargoWeight,
        propertyRights: syncValidators.required,
        trailerImage: undefined,
    } as Record<keyof TrailerCardType, ValidateType>,

    parsers: {
        trailerNumber: syncParsers.pseudoLatin,
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: syncParsers.pseudoLatin,
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
        case 'trailer-store-reducer/SET-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.trailer,
                ],
            }
        }
        case 'trailer-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                trailerIsFetching: action.trailerIsFetching,
            }
        }
        case 'trailer-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
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
        type: 'trailer-store-reducer/SET-CONTENT',
        trailer,
    } as const ),
    setCurrentId: ( currentId: string ) => ( {
        type: 'trailer-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    toggleTrailerIsFetching: ( trailerIsFetching: boolean ) => ( {
        type: 'trailer-store-reducer/SET-IS-FETCHING',
        trailerIsFetching,
    } as const ),
    setInitialValues: ( initialValues: TrailerCardType ) => ( {
        type: 'trailer-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
}

/* САНКИ */

export type TrailerStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// запрос всех ПРИЦЕПОВ пользователя от сервера
export const getAllTrailerAPI = (): TrailerStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(trailerStoreActions.toggleTrailerIsFetching(true))
        dispatch(trailerStoreActions.setTrailerContent([]))
        try {
            const idUser = getState().authStoreReducer.authID

            const response = await trailerApi.getAllTrailerByUserId({ idUser })
            if (response.message || !response.length) {
                throw new Error(response.message || `Прицепы не найдены или пока не внесены`)
            } else {
                dispatch(trailerStoreActions.setTrailerContent(response))
            }

        } catch (e) {
            console.error('Ошибка в запросе списка прицепов: ', e)
        }
        dispatch(trailerStoreActions.toggleTrailerIsFetching(false))
    }

// добавить одну запись ПРИЦЕПА через АПИ
export const newTrailerSaveToAPI = ( values: TrailerCardType<string>, image: File | undefined ): TrailerStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await trailerApi.createOneTrailer({ ...values, idUser }, image)
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(e?.response?.data?.failed))
        }
        await dispatch(getAllTrailerAPI())
    }

// изменить одну запись ПРИЦЕПА через АПИ
export const modifyOneTrailerToAPI = ( values: TrailerCardType<string>, image: File | undefined ): TrailerStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await trailerApi.modifyOneTrailer({ ...values, idUser }, image)
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllTrailerAPI())
    }

// удаляем один ПРИЦЕП
export const oneTrailerDeleteToAPI = ( idTrailer: string ): TrailerStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await trailerApi.deleteOneTrailer({ idTrailer })
            if (response.message) console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllTrailerAPI())
    }

// запрос данных на один ПРИЦЕП из бэка
export const getOneTrailerFromAPI = ( idTrailer: string ): TrailerStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(trailerStoreActions.setInitialValues({} as TrailerCardType))
        try {
            if (idTrailer) {
                const response = await trailerApi.getOneTrailerById({ idTrailer })
                if (response.message) console.log(response.message)
                if (response.length > 0) {
                    const oneTrailer = response[0]
                    dispatch(trailerStoreActions.setInitialValues(oneTrailer))
                }
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }

// было добавлено для адекватного отображения инфы по привязке к сотрудникам (в списке)
export const rerenderTrailer = (): TrailerStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(trailerStoreActions.toggleTrailerIsFetching(true))
        await setTimeout(() =>
                dispatch(trailerStoreActions.toggleTrailerIsFetching(false))
            , 1000)
    }