import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ParserType, ShippersCardType, ValidateType} from '../../types/form-types'
import {syncValidators} from '../../utils/validators'
import {coordsToString, syncParsers} from '../../utils/parsers';
import {shippersApi} from '../../api/local-api/options/shippers.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {TtonErrorType} from '../../types/other-types';
import {GetActionsTypes} from '../../types/ts-utils';


const initialState = {
    shippersIsFetching: false,
    currentId: '' as string | null,

    label: {
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
        title: undefined,
        innNumber: '########## ##', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############# ##', // 13,15 цифр
        address: undefined, // просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
        city: undefined,
    } as ShippersCardType,

    initialValues: {
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
        title: syncValidators.textReqMin,
        innNumber: syncValidators.inn,
        organizationName: syncValidators.textReqMiddle,
        kpp: syncValidators.required,
        ogrn: syncValidators.ogrn,
        address: syncValidators.textReqMiddle,
        shipperFio: syncValidators.textReqMin,
        shipperTel: syncValidators.phone,
        description: syncValidators.textMax,
        coordinates: syncValidators.required,
    } as ShippersCardType<ValidateType>,

    parsers: {
        title: syncParsers.title,
        innNumber: undefined,
        organizationName: syncParsers.title,
        kpp: undefined,
        ogrn: undefined,
        address: syncParsers.title,
        shipperFio: syncParsers.fio,
        shipperTel: undefined,
        description: undefined,
        coordinates: syncParsers.coordinates,
        city: undefined,
    } as ShippersCardType<ParserType>,

    content: [] as ShippersCardType<string>[],
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
        case 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETCHING': {
            return {
                ...state,
                shippersIsFetching: action.shippersIsFetching,
            }

        }
        case 'shippers-store-reducer/SET-COORDINATES': {
            return {
                ...state,
                initialValues: {
                    ...action.payload.formValue,
                    coordinates: coordsToString(action.payload.coordinates),
                },
            }
        }
        case 'shippers-store-reducer/SET-DEFAULT-INITIAL-VALUES': {
            return {
                ...state,
                currentId: null,
                initialValues: {} as ShippersCardType,
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
    setCurrentId: ( currentId: string ) => ( {
        type: 'shippers-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    // подгрузка во временный стейт координат
    setCoordinates: ( payload: { formValue: ShippersCardType, coordinates: [ number, number ] } ) => ( {
        type: 'shippers-store-reducer/SET-COORDINATES',
        payload,
    } as const ),
    setShippersContent: ( shippers: ShippersCardType<string>[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS-CONTENT',
        shippers,
    } as const ),
    toggleShipperIsFetching: ( shippersIsFetching: boolean ) => ( {
        type: 'shippers-store-reducer/TOGGLE-SHIPPER-IS-FETCHING',
        shippersIsFetching,
    } as const ),

}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType
    |
    GlobalModalActionsType>

// запрос на всех Грузоотправителей данного пользователя
export const getAllShippersAPI = (): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(shippersStoreActions.toggleShipperIsFetching(true))
        dispatch(shippersStoreActions.setShippersContent([]))
        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.getAllShippersByUserId({ idUser })
            if (response.message || !response.length) {
                throw new Error(response.message || `Грузоотправители не найдены или пока не внесены`)
            } else {
                dispatch(shippersStoreActions.setShippersContent(response))
            }

        } catch (e) {
            console.error('Ошибка в запросе грузоотправителей', e)
        }
        dispatch(shippersStoreActions.toggleShipperIsFetching(false))
    }


// сохранение параметров организации из ранее загруженного списка DaData
export const setOrganizationByInnKppShippers = ( {
                                                     kppNumber,
                                                     formValue,
                                                 }: { kppNumber: string, formValue: ShippersCardType } ):
    ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        const suggestions = getState().daDataStoreReducer.suggestions

        const response = ( kppNumber !== '-' )
            ? suggestions.filter(( { data: { kpp } } ) => kpp === kppNumber)[0]
            : suggestions[0]

        if (response !== undefined) {
            const { data } = response
            dispatch(shippersStoreActions.setInitialValues({
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

// добавить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
export const newShipperSaveToAPI = ( values: ShippersCardType<string> ): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.createOneShipper({
                ...values, idUser,
                description: values.description || '-',
                city: values.city || '-',
            })
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.failed)))
        }
        await dispatch(getAllShippersAPI())
    }

// изменить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
export const modifyOneShipperToAPI = ( values: ShippersCardType<string> ): ShippersStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await shippersApi.modifyOneShipper({
                ...values, idUser,
                description: values.description || '-',
                city: values.city || '-',
            })
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllShippersAPI())
    }

// удалить одну запись ГРУЗООТПРАВИТЕЛЯ через АПИ
export const oneShipperDeleteToAPI = ( idSender: string | null ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {

        try {
            if (idSender) {
                const response = await shippersApi.deleteOneShipper({ idSender })
                if (response.message) console.log(response.message)
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllShippersAPI())
    }

// ЗАПРОСИТЬ одного ГРУЗО-отправителя из бэка
export const getOneShipperFromAPI = ( idSender: string ): ShippersStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            if (idSender) {
                const response = await shippersApi.getOneShipperById({ idSender })
                if (response.message) console.log(response.message)
                const oneShipper = response[0]
                dispatch(shippersStoreActions.setInitialValues(oneShipper))
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }

