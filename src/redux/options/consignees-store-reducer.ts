import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ConsigneesCardType, ParserType, ValidateType} from '../../types/form-types'
import {syncValidators} from '../../utils/validators'
import {coordsToString, syncParsers} from '../../utils/parsers';
import {consigneesApi} from '../../api/local-api/options/consignees.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {TtonErrorType} from '../../types/other-types';
import {GetActionsTypes} from '../../types/ts-utils';


const initialState = {
    consigneeIsFetching: false,
    currentId: '' as string | null,

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
        title: syncValidators.textReqMin,
        innNumber: syncValidators.inn,
        organizationName: syncValidators.textReqMiddle,
        kpp: syncValidators.required,
        ogrn: syncValidators.ogrn,
        address: syncValidators.textReqMiddle,
        consigneesFio: syncValidators.textReqMin,
        consigneesTel: syncValidators.phone,
        description: syncValidators.textMax,
        coordinates: syncValidators.required,
    } as ConsigneesCardType<ValidateType>,

    parsers: {
        title: syncParsers.title,
        innNumber: undefined,
        organizationName: syncParsers.title,
        kpp: undefined,
        ogrn: undefined,
        address: syncParsers.title,
        consigneesFio: syncParsers.fio,
        consigneesTel: undefined,
        description: undefined,
        coordinates: syncParsers.coordinates,
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
                content: [
                    ...action.consignees,
                ],
            }
        }
        case 'consignees-store-reducer/TOGGLE-CONSIGNEE-IS-FETCHING': {
            return {
                ...state,
                consigneeIsFetching: action.consigneeIsFetching,
            }

        }
        case 'consignees-store-reducer/SET-COORDINATES': {
            return {
                ...state,
                initialValues: {
                    ...action.payload.formValue,
                    coordinates: coordsToString(action.payload.coordinates),
                },
            }
        }
        case 'consignees-store-reducer/SET-DEFAULT-INITIAL-VALUES': {
            return {
                ...state,
                currentId: null,
                initialValues: {} as ConsigneesCardType,
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
    // подгрузка во временный стейт координат
    setCoordinates: ( payload: { formValue: ConsigneesCardType, coordinates: [ number, number ] } ) => ( {
        type: 'consignees-store-reducer/SET-COORDINATES',
        payload,
    } as const ),
    setConsigneesContent: ( consignees: ConsigneesCardType[] ) => ( {
        type: 'consignees-store-reducer/SET-CONSIGNEES-CONTENT',
        consignees,
    } as const ),
    toggleConsigneeIsFetching: ( consigneeIsFetching: boolean ) => ( {
        type: 'consignees-store-reducer/TOGGLE-CONSIGNEE-IS-FETCHING',
        consigneeIsFetching,
    } as const ),

}


/* САНКИ */

export type ConsigneesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// запрос всех грузополучателей по id пользователя
export const getAllConsigneesAPI = (): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(consigneesStoreActions.toggleConsigneeIsFetching(true))
        dispatch(consigneesStoreActions.setConsigneesContent([]))
        try {
            const idUser = getState().authStoreReducer.authID
            const response = await consigneesApi.getAllConsigneesByUserId({ idUser })
            if (response.message || !response.length) {
                throw new Error(response.message || `Грузополучатели не найдены или пока не внесены`)
            } else {
                dispatch(consigneesStoreActions.setConsigneesContent(response))
            }
        } catch (e) {
            console.error('Ошибка в запросе грузополучателей: ', e)
        }
        dispatch(consigneesStoreActions.toggleConsigneeIsFetching(false))
    }

// сохранение параметров организации из ранее загруженного списка DaData
export const setOrganizationByInnKppConsignees = ( {
                                                       kppNumber,
                                                       formValue,
                                                   }: { kppNumber: string, formValue: ConsigneesCardType } ):
    ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        const suggestions = getState().daDataStoreReducer.suggestions

        const response = ( kppNumber !== '-' )
            ? suggestions.filter(( { data: { kpp } } ) => kpp === kppNumber)[0]
            : suggestions[0]

        if (response !== undefined) {
            const { data } = response
            dispatch(consigneesStoreActions.setInitialValues({
                ...formValue,
                innNumber: data.inn,
                kpp: kppNumber,
                organizationName: response.value,
                ogrn: data.ogrn,
                address: data.address.value,
            }))
        } else {
            dispatch(globalModalStoreActions.setTextMessage('Фильтр КПП локально не сработал!'))
        }

    }

// добавить одну запись грузоПОЛУЧАТЕЛЯ через АПИ
export const newConsigneeSaveToAPI = ( values: ConsigneesCardType<string> ): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await consigneesApi.createOneConsignee({
                ...values, idUser,
                description: values.description || '-',
                city: values.city || '-',
            })
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.failed)))
        }
        await dispatch(getAllConsigneesAPI())
    }

// изменить одну запись ГРУЗОполучателя через АПИ
export const modifyOneConsigneeToAPI = ( values: ConsigneesCardType<string> ): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await consigneesApi.modifyOneConsignee({
                ...values, idUser,
                description: values.description || '-',
                city: values.city || '-',
            })
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllConsigneesAPI())
    }

// УДАЛИТЬ одного ГРУЗОполучателя
export const oneConsigneeDeleteToAPI = ( idRecipient: string | null ): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            if (idRecipient) {
                const response = await consigneesApi.deleteOneConsignee({ idRecipient })
                if (response.message) console.log(response.message)
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllConsigneesAPI())
    }

// ЗАПРОСИТЬ одного ГРУЗОполучателя
export const getOneConsigneeFromAPI = ( idRecipient: string ): ConsigneesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            if (idRecipient) {
                const response = await consigneesApi.getOneConsigneeById({ idRecipient })
                if (response.message) console.log(response.message)
                const oneConsignee = response[0]
                dispatch(consigneesStoreActions.setInitialValues(oneConsignee))
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }