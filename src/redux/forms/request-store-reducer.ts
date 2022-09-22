import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {CargoTypeType, DocumentsRequestType, OneRequestType, ValidateType} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {initialDocumentsRequestValues} from '../../initials-test-data';
import {GetAvtodispetcherRouteType, getRouteFromAvtodispetcherApi} from '../../api/avtodispetcher.api';
import {polyline_decode} from '../../utils/polilyne-decode';
import {cargoEditableSelectorApi} from '../../api/cargoEditableSelector.api';
import {oneRequestApi} from '../../api/request-response/request.api';
import {apiToISODateFormat} from '../../utils/date-formats';


const defaultInitialStateValues = {} as OneRequestType

const initialState = {
    requestIsFetching: false,
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
        case 'request-store-reducer/SET-REQUEST-IS-FETCHING': {
            return {
                ...state,
                requestIsFetching: action.requestIsFetching,
            }
        }
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

    setIsFetching: ( requestIsFetching: boolean ) => ( {
        type: 'request-store-reducer/SET-REQUEST-IS-FETCHING',
        requestIsFetching,
    } as const ),
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
    setCurrentRequestNumber: ( currentRequestNumber: number | undefined ) => ( {
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


export const getAllRequestsAPI = (): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.getAllRequests()
            if (response.length > 0) {

                dispatch(requestStoreActions.setContent(response.map(( elem ) => ( {
                        requestNumber: +elem.requestNumber,
                        requestDate: elem.requestDate ? new Date(apiToISODateFormat(elem.requestDate)) : undefined,
                        cargoComposition: elem.cargoComposition,
                        shipmentDate: elem.shipmentDate ? new Date(elem.shipmentDate) : undefined,
                        cargoType: elem.cargoType as CargoTypeType,

                        idUserCustomer: elem.idUserCustomer,
                        idSender: elem.idSender,
                        idRecipient: elem.idRecipient,

                        distance: Number(elem.distance),
                        note: elem.note,
                        visible: true,
                        marked: false,

                        globalStatus: elem.globalStatus as OneRequestType['globalStatus'],
                        localStatus: {
                            paymentHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred === 'true',
                            paymentHasBeenReceived: elem.localStatuscargoHasBeenReceived === 'true',
                            cargoHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred === 'true',
                            cargoHasBeenReceived: elem.localStatuscargoHasBeenReceived === 'true',
                        },
                        answers: elem.answers?.split(','),

                        requestCarrierId: elem.requestCarrierId,
                        idEmployee: elem.idEmployee,
                        idTransport: elem.idTransport,
                        idTrailer: elem.idTrailer,
                        responseStavka: elem.responseStavka,
                        responseTax: elem.responseTax,

                        responsePrice: elem.responsePrice,
                        cargoWeight: elem.cargoWeight,

                        uploadTime: elem.uploadTime && new Date(elem.uploadTime),

                        documents: {
                            proxyWay: {
                                header: undefined,

                                proxyFreightLoader: elem.proxyFreightLoader,
                                proxyDriver: elem.proxyDriver,
                                waybillDriver: elem.proxyWaybillDriver,
                            },
                            cargoDocuments: elem.cargoDocuments,
                            ttnECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: elem.ttnECPdocumentDownload,
                                customerIsSubscribe: elem.ttnECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: elem.ttnECPcarrierIsSubscribe === 'true',
                                consigneeIsSubscribe: elem.ttnECPconsigneeIsSubscribe === 'true',
                            },
                            contractECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: elem.contractECPdocumentDownload,
                                customerIsSubscribe: elem.contractECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: elem.contractECPcarrierIsSubscribe === 'true',
                            },
                            updECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: elem.updECPdocumentDownload,
                                customerIsSubscribe: elem.updECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: elem.updECPcarrierIsSubscribe === 'true',
                            },
                            customerToConsigneeContractECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: elem.customerToConsigneeContractECPdocumentDownload,
                                customerIsSubscribe: elem.customerToConsigneeContractECPcustomerIsSubscribe === 'true',
                                consigneeIsSubscribe: elem.customerToConsigneeContractECPconsigneeIsSubscribe === 'true',
                            },
                        },
                    } ),
                )))
            }
        } catch (e) {
            alert(e)
        }
    }
// забрать данные одной СОЗДАННОЙ заявки от сервера
export const getOneRequestsAPI = (requestNumber: number): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.getOneRequestById({requestNumber})
            if (response.length > 0) {
                let element = response[0]
                debugger
                dispatch(requestStoreActions.setInitialValues( {
                        requestNumber: +element.requestNumber,
                        requestDate: element.requestDate ? new Date(apiToISODateFormat(element.requestDate)) : undefined,
                        cargoComposition: element.cargoComposition,
                        shipmentDate: element.shipmentDate ? new Date(element.shipmentDate) : undefined,
                        cargoType: element.cargoType as CargoTypeType,

                        idUserCustomer: element.idUserCustomer,
                        idSender: element.idSender,
                        idRecipient: element.idRecipient,

                        distance: Number(element.distance),
                        note: element.note,
                        visible: true,
                        marked: false,

                        globalStatus: element.globalStatus as OneRequestType['globalStatus'],
                        localStatus: {
                            paymentHasBeenTransferred: element.localStatuspaymentHasBeenTransferred === 'true',
                            paymentHasBeenReceived: element.localStatuscargoHasBeenReceived === 'true',
                            cargoHasBeenTransferred: element.localStatuspaymentHasBeenTransferred === 'true',
                            cargoHasBeenReceived: element.localStatuscargoHasBeenReceived === 'true',
                        },
                        answers: element.answers?.split(','),

                        requestCarrierId: element.requestCarrierId,
                        idEmployee: element.idEmployee,
                        idTransport: element.idTransport,
                        idTrailer: element.idTrailer,
                        responseStavka: element.responseStavka,
                        responseTax: element.responseTax,

                        responsePrice: element.responsePrice,
                        cargoWeight: element.cargoWeight,

                        uploadTime: element.uploadTime && new Date(element.uploadTime),

                        documents: {
                            proxyWay: {
                                header: undefined,

                                proxyFreightLoader: element.proxyFreightLoader,
                                proxyDriver: element.proxyDriver,
                                waybillDriver: element.proxyWaybillDriver,
                            },
                            cargoDocuments: element.cargoDocuments,
                            ttnECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: element.ttnECPdocumentDownload,
                                customerIsSubscribe: element.ttnECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: element.ttnECPcarrierIsSubscribe === 'true',
                                consigneeIsSubscribe: element.ttnECPconsigneeIsSubscribe === 'true',
                            },
                            contractECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: element.contractECPdocumentDownload,
                                customerIsSubscribe: element.contractECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: element.contractECPcarrierIsSubscribe === 'true',
                            },
                            updECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: element.updECPdocumentDownload,
                                customerIsSubscribe: element.updECPcustomerIsSubscribe === 'true',
                                carrierIsSubscribe: element.updECPcarrierIsSubscribe === 'true',
                            },
                            customerToConsigneeContractECP: {
                                header: undefined,
                                documentUpload: undefined,
                                documentDownload: element.customerToConsigneeContractECPdocumentDownload,
                                customerIsSubscribe: element.customerToConsigneeContractECPcustomerIsSubscribe === 'true',
                                consigneeIsSubscribe: element.customerToConsigneeContractECPconsigneeIsSubscribe === 'true',
                            },
                        },
                    } ),
                )
            } else {requestStoreActions.setCurrentRequestNumber(0)}
        } catch (e) {
            alert(e)
        }
    }

// создать одну пустую заявку и вернуть дату и номер создания
export const setNewRequestAPI = (): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))

        try {
            const idUserCustomer = getState().authStoreReducer.authID
            const response = await oneRequestApi.createOneRequest({ idUserCustomer })
            // debugger
            if (response.success) {
                dispatch(requestStoreActions.setInitialValues({
                    ...getState().requestStoreReducer.initialValues,
                    requestNumber: +response.Number,
                    requestDate: new Date(apiToISODateFormat(response.Date)),
                }))
            }
        } catch (e) {
            alert(e)
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// изменить текущую заявку
export const changeCurrentRequestAPI = ( { requestNumber }: { requestNumber: number | undefined } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        // dispatch(requestStoreActions.setIsFetching(true))

        try {
            const idUserCustomer = getState().authStoreReducer.authID
            const initialValues = getState().requestStoreReducer.initialValues
            const requestNumberCorrector = requestNumber?.toString() || '0'
            const response = await oneRequestApi.modifyOneRequest({
                    requestNumber: requestNumberCorrector,
                    requestDate: initialValues.requestDate?.toString() || '',
                    idUserCustomer: idUserCustomer,

                    cargoComposition: initialValues.cargoComposition,
                    shipmentDate: initialValues.shipmentDate?.toString(),
                    cargoType: initialValues.cargoType,
                    idSender: initialValues.idSender,
                    idRecipient: initialValues.idRecipient,
                    distance: initialValues.distance?.toString(),
                    note: initialValues.note,

                    globalStatus: initialValues.globalStatus,
                    localStatuspaymentHasBeenTransferred: initialValues.localStatus.paymentHasBeenTransferred?.toString(),
                    localStatuscargoHasBeenTransferred: initialValues.localStatus.cargoHasBeenTransferred?.toString(),
                    localStatuspaymentHasBeenReceived: initialValues.localStatus.paymentHasBeenReceived?.toString(),
                    localStatuscargoHasBeenReceived: initialValues.localStatus.cargoHasBeenReceived?.toString(),

                    requestCarrierId: initialValues.requestCarrierId,
                    idEmployee: initialValues.idEmployee,
                    idTransport: initialValues.idTransport,
                    idTrailer: initialValues.idTrailer,
                    responseStavka: initialValues.responseStavka,
                    responseTax: initialValues.responseTax,
                    responsePrice: initialValues.responsePrice,
                    cargoWeight: initialValues.cargoWeight?.toString(),
                    uploadTime: initialValues.uploadTime?.toString(),

                    proxyFreightLoader: initialValues.documents.proxyWay.proxyFreightLoader,
                    proxyDriver: initialValues.documents.proxyWay.proxyDriver,
                    proxyWaybillDriver: initialValues.documents.proxyWay.waybillDriver,
                    // здесь надо будет добавить файл
                    // cargoDocuments: initialValues.documents.cargoDocuments,

                    ttnECPdocumentDownload: initialValues.documents.ttnECP.documentDownload,
                    // здесь надо будет добавить файл
                    // ttnECPdocumentUpload: initialValues.documents.ttnECP.documentUpload,
                    ttnECPcustomerIsSubscribe: initialValues.documents.ttnECP.customerIsSubscribe?.toString(),
                    ttnECPcarrierIsSubscribe: initialValues.documents.ttnECP.carrierIsSubscribe?.toString(),
                    ttnECPconsigneeIsSubscribe: initialValues.documents.ttnECP.consigneeIsSubscribe?.toString(),

                    contractECPdocumentDownload: initialValues.documents.contractECP.documentDownload,
                    // здесь надо будет добавить файл
                    // contractECPdocumentUpload: initialValues.documents.contractECPdocumentUpload,
                    contractECPcustomerIsSubscribe: initialValues.documents.contractECP.customerIsSubscribe?.toString(),
                    contractECPcarrierIsSubscribe: initialValues.documents.contractECP.carrierIsSubscribe?.toString(),

                    updECPdocumentDownload: initialValues.documents.updECP.documentDownload,
                    // здесь надо будет добавить файл
                    // updECPdocumentUpload: initialValues.documents.updECP.documentUpload,
                    updECPcustomerIsSubscribe: initialValues.documents.updECP.customerIsSubscribe?.toString(),
                    updECPcarrierIsSubscribe: initialValues.documents.updECP.carrierIsSubscribe?.toString(),

                    customerToConsigneeContractECPdocumentDownload: initialValues.documents.customerToConsigneeContractECP.documentDownload,
                    // здесь надо будет добавить файл
                    // customerToConsigneeContractECPdocumentUpload: initialValues.documents.customerToConsigneeContractECP.documentUpload,
                    customerToConsigneeContractECPcustomerIsSubscribe: initialValues.documents.customerToConsigneeContractECP.customerIsSubscribe?.toString(),
                    customerToConsigneeContractECPconsigneeIsSubscribe: initialValues.documents.customerToConsigneeContractECP.consigneeIsSubscribe?.toString(),
                },
            )

            if (response.success) {
                await dispatch(getAllRequestsAPI())
            }
        } catch (e) {
            alert(e)
        }
        // dispatch(requestStoreActions.setIsFetching(false))
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
