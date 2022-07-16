import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {DocumentsRequestType, OneRequestType, ValidateType} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {cargoComposition, initialDocumentsRequestValues, makeNTestRequests} from '../../initials-test-data';
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/avtodispetcher.api';
import {polyline_decode} from '../../utils/polilyne-decode';


const defaultInitialStateValues = {
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
    documents: {
        proxyWay: {
            label: undefined,
            proxyFreightLoader: false,
            proxyDriver: false,
            waybillDriver: false,
        },
        uploadTime: undefined,
        cargoWeight: 0,
        cargoDocuments: undefined,
        cargoPrice: 0,
        addedPrice: 0,
        finalPrice: 0,
        ttnECP: {
            label: undefined,
            customer: false,
            carrier: false,
            consignee: false,
        },
        contractECP: {
            label: undefined,
            customer: false,
            carrier: false,
            uploadDocument: undefined,
        },
        updECP: {
            label: undefined,
            customer: false,
            carrier: false,
            uploadDocument: undefined,
        },
        customerToConsigneeContractECP: {
            label: undefined,
            customer: false,
            consignee: false,
            uploadDocument: undefined,
        },
        paymentHasBeenTransferred: undefined,
        paymentHasBeenReceived: false,
        completeRequest: false,
    },
} as OneRequestType

const initialState = {

    cargoComposition: [] as string[],
    currentRequestNumber: undefined as undefined | number,
    currentDistance: 0 as number | null,
    currentDistanceIsFetching: false,
    currentRoute: null as number[][] | null,
    isNewRequest: true,

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

    defaultInitialStateValues,

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
            label: 'Документы от Заказчика для ГрузоПолучателя с ЭЦП',
            customer: 'Заказчик',
            consignee: 'Грузополучатель',
            uploadDocument: 'Загрузить',
        },
        paymentHasBeenTransferred: 'Оплату передал',
        paymentHasBeenReceived: 'Оплату получил',
        completeRequest: 'Закрыть заявку',
    } as DocumentsRequestType,

    // инфо для модальных окон после нажатия на кнопку
    infoTextModals: {
        contractECP: 'Используется стандартный шаблон транспортного договора, подпишите по ЭЦП или Загрузите свой экземпляр для пописания.',
        updECP: 'Используется стандартный шаблон УПД, проверьте и подпишите по ЭЦП или Загрузите свой экземпляр для пописания.',
        customerToConsigneeContractECP: 'Загрузите документы для подписания по ЭЦП, данный документ  доступен только для Заказчика и Грузополучателя.',
        paymentHasBeenTransferred: 'Загрузите платежное поручение из банка с синей отметкой, для подтверждения оплаты.',

        cargoComposition: 'Номенклатура груза по документации.',
        shipmentDate: 'Дата погрузки по доверенности',
        distance: 'Расчет производится автоматически на основании координатов мест Погрузки и Разгрузки. Корректировка местоположения изменяет параметры',
        cargoType: 'Укажите тип прицепа или сцепки, для осуществления верного поиска транспорта.',
        customer: 'Ваша организация или стороняя организация использующая Агентов для оказания собственных услуг перевозки. Получает права владельца Заявки после создания Заявки.',
        shipper: 'Юридические владельцы груза. НЕ получает права на просмотр данной Заявки, предоставляет местоположение и контактный телефон представителя для сбора груза.',
        consignee: 'Юридические получатели груза. Получает права на просмотр созданной Заявки, отслеживание транспорта, просмотр контактных и прочих данных указанных в Заявке.',
        carrier: 'Перевозчики Вашего груза от Отправителя до Получателя. НЕ видит информацию о Заказчике, Грузоотправителе и Грузополучателе, до окончательного принятия Заявки. Требуется проверка Перевозчика до момента передачи груза!',
        driver: 'Сотрудник Перевозчика и данные транспорта. При использовани мобильного приложения, отображается маршрут на карте, может звонить всем сторонам Заявки и предоставлять сканы документов.',
        note: 'Дополнительная информация доступная До принятия Заявки, для указания особенностей транспортировки или погрузочно-разгрузочных работ.',
        selfDeliveryButton: 'Использование собстввенных сотрудников и транспорта, для оказания услуг транспортировки. Услуга оплачивается со счета Перевозчика-Заказчика.'
    },

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
        case 'request-store-reducer/SET-CURRENT-DISTANCE': {
            return {
                ...state,
                currentDistance: action.currentDistance,
            }
        }
        case 'request-store-reducer/SET-CURRENT-DISTANCE-IS-FETCHING': {
            return {
                ...state,
                currentDistanceIsFetching: action.isFetching,
            }
        }
        case 'request-store-reducer/SET-CURRENT-ROUTE': {
            return {
                ...state,
                currentRoute: action.currentRoute,
            }
        }
        case 'request-store-reducer/SET-CARGO-COMPOSITION-SELECTOR': {
            return {
                ...state,
                cargoComposition: action.cargoComposition,
            }
        }
        case 'request-store-reducer/SET-IS-NEW-REQUEST': {
            return {
                ...state,
                isNewRequest: action.isNewRequest,
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
    setIsNewRequest: ( isNewRequest: boolean ) => ( {
        type: 'request-store-reducer/SET-IS-NEW-REQUEST',
        isNewRequest,
    } as const ),
    setRequestNumber: ( currentRequestNumber: number | undefined ) => ( {
        type: 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW',
        currentRequestNumber,
    } as const ),
    // дистанция в километрах, отображаемая в форме ввода заявки
    setCurrentDistance: ( currentDistance: number | null ) => ( {
        type: 'request-store-reducer/SET-CURRENT-DISTANCE',
        currentDistance,
    } as const ),
    setCurrentRoute: ( currentRoute: number[][] | null ) => ( {
        type: 'request-store-reducer/SET-CURRENT-ROUTE',
        currentRoute,
    } as const ),
    setCurrentDistanceIsFetching: ( isFetching: boolean ) => ( {
        type: 'request-store-reducer/SET-CURRENT-DISTANCE-IS-FETCHING',
        isFetching,
    } as const ),
    setToggleRequestVisible: ( requestNumber: number ) => ( {
        type: 'request-store-reducer/SET-TOGGLE-REQUEST-VISIBLE',
        requestNumber,
    } as const ),
    setCargoCompositionSelector: ( cargoComposition: string[] ) => ( {
        type: 'request-store-reducer/SET-CARGO-COMPOSITION-SELECTOR',
        cargoComposition,
    } as const ),

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
export const setCargoCompositionSelector = ( cargoComposition: string[] ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = cargoComposition
            dispatch(requestStoreActions.setCargoCompositionSelector(response))
        } catch (e) {
            alert(e)
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
    }

export const getRouteFromAPI = ( { from, to }: GetAvtodispetcherRouteType ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(true))
        try {
            const response = await getRouteFromAvtodispetcherApi({ from, to })
            // const response = { kilometers: 50 }
            dispatch(requestStoreActions.setCurrentDistance(
                +( +response.kilometers * 1.05 ).toFixed(0)))

            // переводим зашифрованную строку polyline в массив координат и записываем в стэйт
            dispatch(requestStoreActions.setCurrentRoute(
                polyline_decode(response.polyline),
            ))

        } catch (e) {
            alert(e)
            dispatch(requestStoreActions.setCurrentDistance(null))
            // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
        }
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(false))
    }
