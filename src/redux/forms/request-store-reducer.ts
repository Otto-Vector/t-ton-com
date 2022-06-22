import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {DocumentsRequestType, OneRequestType, ValidateType} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {cargoComposition, initialDocumentsRequestValues, makeNTestRequests} from '../../initials-test-data';
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/avtodispetcher';


const initialState = {

    cargoComposition: [] as string[],
    currentRequestNumber: undefined as undefined | number,

    label: {
        id: undefined,
        requestNumber: 'Номер заявки',
        requestDate: 'Дата создания заявки',
        cargoComposition: 'Вид груза',
        shipmentDate: 'Дата погрузки',
        distance: 'Расстояние, км.',
        cargoType: 'Тип груза',
        customer: 'Заказчик',
        shipper: 'Грузоотправитель',
        consignee: 'Грузополучатель',
        carrier: 'Перевозчик',
        driver: 'Водитель',
        note: 'Примечание',
    } as Record<keyof OneRequestType, string | undefined>,

    placeholder: {
        id: undefined,
        requestNumber: '№',
        requestDate: 'ДД-ММ-ГГГГ',
        cargoComposition: 'Полное наименование груза',
        shipmentDate: 'ДД-ММ-ГГГГ',
        distance: 'авто-расчет',
        cargoType: 'Тип груза',
        customer: 'Наименование организации заказчика',
        shipper: 'Наименование организации Владельца груза',
        consignee: 'Наименование организации Грузополучателя',
        carrier: 'Наименование организации Перевозчика',
        driver: 'ФИО, Марка авто, Марка прицепа, тн',
        note: 'дополнительные данные',
    } as Record<keyof OneRequestType, string | undefined>,

    validators: {
        id: undefined,
        requestNumber: undefined,
        requestDate: composeValidators(required),
        cargoComposition: composeValidators(required),
        shipmentDate: composeValidators(required),
        distance: undefined,
        cargoType: composeValidators(required),
        customer: composeValidators(required),
        shipper: composeValidators(required),
        consignee: composeValidators(required),
        carrier: undefined,
        driver: undefined,
        note: undefined,
    } as Record<keyof OneRequestType, ValidateType>,

    initialValues: {
        id: 0,
        requestNumber: undefined,
        requestDate: undefined,
        cargoComposition: undefined,
        shipmentDate: undefined,
        cargoType: undefined,
        customer: undefined,
        distance: undefined,
        shipper: undefined,
        consignee: undefined,
        carrier: undefined,
        driver: undefined,
        note: undefined,
        visible: true,
        documents: initialDocumentsRequestValues,
    } as OneRequestType,

    content: [] as OneRequestType[], // создаём тестовые заявки

    labelDocumentsRequestValues: {
        proxyWay: {
            label: 'Транспортные документы Сторон',
            proxyFreightLoader: 'Доверенность Грузовладельцу',
            proxyDriver: 'Доверенность на Водителя',
            waybillDriver: 'Путевой Лист Водителя',
        },
        uploadTime: 'Время погрузки',
        cargoWeight: 'Вес груза, в тн.',
        cargoDocuments: 'Документы груза',
        cargoPrice: 'Цена по Заявке',
        addedPrice: 'Доп. Услуги',
        finalPrice: 'Итоговая Цена',
        ttnECP: {
            label: 'ТТН или ЭТрН с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            consignee: 'Грузополучатель',
        },
        contractECP: {
            label: 'Договор оказания транспортных услуг с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            uploadDocument: 'Загрузить',
        },
        updECP: {
            label: 'УПД от Перевозчика для Заказчика с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            uploadDocument: 'Загрузить',
        },
        customerToConsigneeContractECP: {
            label: 'Документы от Заказчика для Получателя с ЭЦП',
            customer: 'Заказчик',
            consignee: 'Грузополучатель',
            uploadDocument: 'Загрузить',
        },
        paymentHasBeenTransferred: 'Оплату передал',
        paymentHasBeenReceived: 'Оплату получил',
        completeRequest: 'Закрыть заявку',
    } as DocumentsRequestType,

    initialDocumentsRequestValues: initialDocumentsRequestValues,
}

export type RequestStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof requestStoreActions>

export const requestStoreReducer = ( state = initialState, action: ActionsType ): RequestStoreReducerStateType => {

    switch (action.type) {

        case 'request-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'request-store-reducer/SET-CONTENT': {
            return {
                ...state,
                content: action.content,
            }
        }
        case 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW': {
            return {
                ...state,
                currentRequestNumber: action.currentRequestNumber,
            }
        }
        case 'request-store-reducer/SET-TOGGLE-REQUEST-VISIBLE': {
            return {
                ...state,
                content: [ ...state.content.map(( oneRequest ) =>
                    oneRequest.requestNumber === action.requestNumber
                        ? { ...oneRequest, visible: !oneRequest.visible } : oneRequest) ],
            }
        }
        case 'request-store-reducer/SET-CARGO-COMPOSITION-SELECTOR': {
            return {
                ...state,
                cargoComposition: action.cargoComposition,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const requestStoreActions = {
    setInitialValues: ( initialValues: RequestStoreReducerStateType['initialValues'] ) => ( {
        type: 'request-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setContent: ( content: OneRequestType[] ) => ( {
        type: 'request-store-reducer/SET-CONTENT',
        content,
    } as const ),
    setRequestNumber: ( currentRequestNumber: number | undefined ) => ( {
        type: 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW',
        currentRequestNumber,
    } as const ),
    setToggleRequestVisible: ( requestNumber: number ) => ( {
        type: 'request-store-reducer/SET-TOGGLE-REQUEST-VISIBLE',
        requestNumber,
    } as const ),
    setCargoCompositionSelector: ( cargoComposition: string[] ) => ( {
        type: 'request-store-reducer/SET-CARGO-COMPOSITION-SELECTOR',
        cargoComposition,
    } as const ),
    setDistance: (kilometers: number) => ({
        type: 'request-store-reducer/SET-DISTANCE',
        kilometers,
    } as const

    )
}

/* САНКИ */

export type RequestStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllRequestsAPI = ( { innID }: { innID: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // dispatch( requestFormActions.setIcons( null ) )
        try {
            const response = makeNTestRequests(50)
            dispatch(requestStoreActions.setContent(response))
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
    }

// забираем данные селектора из API и выставляем его значение в Initial
export const getCargoCompositionSelector = (): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = cargoComposition
            dispatch(requestStoreActions.setCargoCompositionSelector(response))
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
    }

// отправляем изменения селектора и выставляем его значение в Initial (это добавляемый селектор)
export const setCargoCompositionSelector = (cargoComposition: string[]): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = cargoComposition
            dispatch(requestStoreActions.setCargoCompositionSelector(response))
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
    }

export const getRouteFromAPI = ({from,to}: GetAvtodispetcherRouteType): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await getRouteFromAvtodispetcherApi({from,to})
            dispatch(requestStoreActions.setDistance((+response.kilometers*0.15)))
            console.log(response)
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
    }