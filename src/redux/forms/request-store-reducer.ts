import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {DocumentsRequestType, OneRequestType, ValidateType} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {initialDocumentsRequestValues, makeNTestRequests} from '../../initials-test-data';
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/avtodispetcher.api';
import {polyline_decode} from '../../utils/polilyne-decode';
import {cargoEditableSelectorApi} from '../../api/cargoEditableSelector.api';


const defaultInitialStateValues = {} as OneRequestType

const initialState = {

    cargoComposition: [] as string[],
    currentRequestNumber: undefined as undefined | number,
    currentDistance: 0 as number | null,
    currentDistanceIsFetching: false,
    currentRoute: null as number[][] | null,
    isNewRequest: true,

    label: {
        requestNumber: 'Номер заявки',
        requestDate: 'Дата создания заявки',
        cargoComposition: 'Вид груза',
        shipmentDate: 'Дата погрузки',
        distance: 'Расстояние, км.',
        cargoType: 'Тип груза',
        idUserCustomer: 'Заказчик',
        idSender: 'Грузоотправитель',
        idRecipient: 'Грузополучатель',
        requestCarrierId: 'Перевозчик',
        idEmployee: 'Водитель',
        note: 'Примечание',
        // поля на вкладку ДОКУМЕНТЫ
        uploadTime: 'Время погрузки',
        cargoWeight: 'Вес груза, в тн.',
        responsePrice: 'Цена по Заявке',
        localStatus: {
            paymentHasBeenTransferred: 'Оплату передал',
            paymentHasBeenReceived: 'Оплату получил',
            cargoHasBeenTransferred: 'Груз передан',
            cargoHasBeenReceived: 'Закрыть заявку',
        },
    } as Record<keyof OneRequestType, string | undefined> & { localStatus: Record<keyof OneRequestType['localStatus'], string | undefined> },

    placeholder: {
        requestNumber: '№',
        requestDate: 'ДД-ММ-ГГГГ',
        cargoComposition: 'Полное наименование груза',
        shipmentDate: 'ДД-ММ-ГГГГ',
        distance: 'авто-расчет',
        cargoType: 'Тип груза',
        idUserCustomer: 'Наименование организации заказчика',
        idSender: 'Наименование организации Владельца груза',
        idRecipient: 'Наименование организации Грузополучателя',
        requestCarrierId: 'Наименование организации Перевозчика',
        idEmployee: 'ФИО, Марка авто, Марка прицепа, тн',
        note: 'дополнительные данные',
    } as Record<keyof OneRequestType, string | undefined>,

    validators: {
        requestNumber: undefined,
        requestDate: composeValidators(required),
        cargoComposition: composeValidators(required),
        shipmentDate: composeValidators(required),
        distance: undefined,
        cargoType: composeValidators(required),
        idUserCustomer: composeValidators(required),
        idSender: composeValidators(required),
        idRecipient: composeValidators(required),
        requestCarrierId: undefined,
        idEmployee: undefined,
        note: undefined,
    } as Record<keyof OneRequestType, ValidateType>,

    defaultInitialStateValues,

    initialValues: {
        requestNumber: 0,
        requestDate: undefined,
        cargoComposition: undefined,
        shipmentDate: undefined,
        cargoType: undefined,
        idUserCustomer: undefined,
        distance: undefined,
        idSender: undefined,
        idRecipient: undefined,
        requestCarrierId: undefined,
        idEmployee: undefined,
        note: undefined,
        visible: true,
        documents: initialDocumentsRequestValues,
    } as OneRequestType,

    content: [] as OneRequestType[], // создаём тестовые заявки

    labelDocumentsRequestValues: {
        proxyWay: {
            header: 'Транспортные документы Сторон',
            proxyFreightLoader: 'Доверенность Грузовладельцу',
            proxyDriver: 'Доверенность на Водителя',
            waybillDriver: 'Путевой Лист Водителя',
        },

        cargoDocuments: 'Документы груза',

        ttnECP: {
            header: 'ТТН или ЭТрН с ЭЦП',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            consigneeIsSubscribe: 'Грузополучатель',
            documentDownload: 'Загрузить',
        },
        contractECP: {
            header: 'Договор оказания транспортных услуг с ЭЦП',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            documentDownload: 'Загрузить',
        },
        updECP: {
            header: 'УПД от Перевозчика для Заказчика с ЭЦП',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            documentDownload: 'Загрузить',
        },
        customerToConsigneeContractECP: {
            header: 'Документы от Заказчика для ГрузоПолучателя с ЭЦП',
            customerIsSubscribe: 'Заказчик',
            consigneeIsSubscribe: 'Грузополучатель',
            documentDownload: 'Загрузить',
        },
    } as DocumentsRequestType,

    // инфо для модальных окон после нажатия на кнопку
    infoTextModals: {
        ttnECP: 'Используется стандартный шаблон товарно-транспортной накладной, подпишите по ЭЦП или Загрузите свой экземпляр для подписания.',
        contractECP: 'Используется стандартный шаблон транспортного договора, подпишите по ЭЦП или Загрузите свой экземпляр для подписания.',
        updECP: 'Используется стандартный шаблон УПД, проверьте и подпишите по ЭЦП или Загрузите свой экземпляр для подписания.',
        customerToConsigneeContractECP: 'Загрузите документы для подписания по ЭЦП, данный документ  доступен только для Заказчика и Грузополучателя.',
        paymentHasBeenTransferred: 'Загрузите платежное поручение из банка с синей отметкой, для подтверждения оплаты.',

        cargoComposition: 'Номенклатура груза по документации.',
        shipmentDate: 'Дата погрузки по доверенности',
        distance: 'Расчет производится автоматически на основании координат мест Погрузки и Разгрузки. Корректировка местоположения изменяет параметры',
        cargoType: 'Укажите тип прицепа или сцепки, для осуществления верного поиска транспорта.',
        customer: 'Ваша организация или сторонняя организация использующая Агентов для оказания собственных услуг перевозки. Получает права владельца Заявки после создания Заявки.',
        shipper: 'Юридические владельцы груза. НЕ получает права на просмотр данной Заявки, предоставляет местоположение и контактный телефон представителя для сбора груза.',
        consignee: 'Юридические получатели груза. Получает права на просмотр созданной Заявки, отслеживание транспорта, просмотр контактных и прочих данных указанных в Заявке.',
        carrier: 'Перевозчики Вашего груза от Отправителя до Получателя. НЕ видит информацию о Заказчике, Грузоотправителе и Грузополучателе, до окончательного принятия Заявки. Требуется проверка Перевозчика до момента передачи груза!',
        driver: 'Сотрудник Перевозчика и данные транспорта. При использовании мобильного приложения, отображается маршрут на карте, может звонить всем сторонам Заявки и предоставлять сканы документов.',
        note: 'Дополнительная информация доступная До принятия Заявки, для указания особенностей транспортировки или погрузочно-разгрузочных работ.',
        selfDeliveryButton: 'Использование собственных сотрудников и транспорта, для оказания услуг транспортировки. Услуга оплачивается со счета Перевозчика-Заказчика.',
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
            const response = await cargoEditableSelectorApi.getCargoComposition()
            const reparsedResponse = response.map(( { text } ) => text).reverse()
            dispatch(requestStoreActions.setCargoCompositionSelector(reparsedResponse))
        } catch (e) {
            alert(e)
        }
    }

// отправляем изменения селектора и выставляем его значение в Initial (это добавляемый селектор)
export const setCargoCompositionSelector = ( newCargoCompositionItem: string ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {

            const text = newCargoCompositionItem.replaceAll('|', '')
            const response = await cargoEditableSelectorApi.addOneCargoComposition(text)
            if (response.success) {
                await dispatch(getCargoCompositionSelector())
            }
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
    }

export const getRouteFromAPI = ( { from, to }: GetAvtodispetcherRouteType ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(true))
        try {
            const response = await getRouteFromAvtodispetcherApi({ from, to })

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
