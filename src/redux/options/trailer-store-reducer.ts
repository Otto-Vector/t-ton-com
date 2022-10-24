import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ParserType, TrailerCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, maxRangeNumber, required} from '../../utils/validators'
import {
    composeParsers,
    parseNoFirstSpaces,
    parseOnlyOneSpace,
    parsePseudoLatinCharsAndNumbers,
    parseToUpperCase,
} from '../../utils/parsers';
import {trailerApi} from '../../api/options/trailer.api';


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
    } as TrailerCardType<string | undefined>,

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

    initialValues: {} as TrailerCardType,

    validators: {
        trailerNumber: composeValidators(required, maxLength(20)),
        trailerTrademark: composeValidators(required, maxLength(30)),
        trailerModel: composeValidators(required, maxLength(30)),
        pts: composeValidators(required),
        dopog: composeValidators(required),
        cargoType: composeValidators(required),
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: composeValidators(required),
        trailerImage: undefined,
    } as TrailerCardType<ValidateType>,

    parsers: {
        trailerNumber: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces, parseToUpperCase),
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces, parseToUpperCase),
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
}

/* САНКИ */

export type TrailerStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// запрос всего транспорта пользователя от сервера
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
                dispatch(trailerStoreActions.setTrailerContent(response.map(( { idUser, ...values } ) => values)))
            }

        } catch (e) {
            console.error('Ошибка в запросе списка прицепов: ', e)
        }
        dispatch(trailerStoreActions.toggleTrailerIsFetching(false))
    }

// добавить одну запись ТРАНСПОРТА через АПИ
export const newTrailerSaveToAPI = ( values: TrailerCardType<string>, image: File | undefined ): TrailerStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await trailerApi.createOneTrailer({
                idUser, ...values,
                cargoWeight: values.cargoWeight || '0',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            dispatch(globalModalStoreActions.setTextMessage(e.response.data.failed))
        }
        await dispatch(getAllTrailerAPI())
    }

// изменить одну запись ПРИЦЕПА через АПИ
export const modifyOneTrailerToAPI = ( values: TrailerCardType<string>, image: File | undefined ): TrailerStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await trailerApi.modifyOneTrailer({
                ...values,
                idUser,
                cargoWeight: values.cargoWeight || '0',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllTrailerAPI())
    }

// удаляем один ПРИЦЕП
export const oneTrailerDeleteToAPI = ( idTrailer: string ): TrailerStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await trailerApi.deleteOneTrailer({ idTrailer })
            if (response.message) console.log(response.message)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllTrailerAPI())
    }