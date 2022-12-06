import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {
    CargoTypeType,
    ConsigneesCardType,
    DocumentsRequestType,
    OneRequestApiType,
    OneRequestType,
    ResponseToRequestCardType,
    ShippersCardType,
    ValidateType,
} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {initialDocumentsRequestValues} from '../../initials-test-data';
import {getRouteFromAvtodispetcherApi} from '../../api/external-api/avtodispetcher.api';
import {cargoEditableSelectorApi} from '../../api/local-api/cargoEditableSelector.api';
import {oneRequestApi} from '../../api/local-api/request-response/request.api';
import {apiToISODateFormat, yearMmDdFormatISO} from '../../utils/date-formats';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {getOneEmployeeFromAPI} from '../options/employees-store-reducer';
import {getOneTransportFromAPI} from '../options/transport-store-reducer';
import {getOneTrailerFromAPI} from '../options/trailer-store-reducer';
import {removeResponseToRequestsBzAcceptRequest} from './add-driver-store-reducer';


const defaultInitialStateValues = {} as OneRequestType

const initialState = {
    requestIsFetching: false,
    // список названий грузов (изменяемый при создании заявки) - подгружается из бэка
    cargoComposition: [] as string[],
    currentRequestNumber: undefined as undefined | number,
    // для отрисовки ожидания построения маршрута при создании заявки
    currentDistanceIsFetching: false,

    label: {
        requestNumber: 'Номер заявки',
        requestDate: 'Дата создания заявки',
        cargoComposition: 'Вид груза',
        shipmentDate: 'Дата погрузки',
        distance: 'Расстояние, км.',
        cargoType: 'Тип груза',
        idCustomer: 'Заказчик',
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
        idCustomer: 'Наименование организации заказчика',
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
        idCustomer: composeValidators(required),
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
        idCustomer: undefined,
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

export type RequestStoreActionsType = GetActionsTypes<typeof requestStoreActions>

export const requestStoreReducer = ( state = initialState, action: RequestStoreActionsType ): RequestStoreReducerStateType => {

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
        case 'request-store-reducer/SET-CURRENT-DISTANCE-IS-FETCHING': {
            return {
                ...state,
                currentDistanceIsFetching: action.isFetching,
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
    setCurrentRequestNumber: ( currentRequestNumber: number | undefined ) => ( {
        type: 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW',
        currentRequestNumber,
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

const parseRequestFromAPI = ( elem: OneRequestApiType ): OneRequestType => ( {
    requestNumber: +elem.requestNumber,
    requestDate: elem.requestDate ? new Date(apiToISODateFormat(elem.requestDate)) : undefined,
    cargoComposition: elem.cargoComposition,
    shipmentDate: elem.shipmentDate ? new Date(elem.shipmentDate) : undefined,
    cargoType: elem.cargoType as CargoTypeType,

    idUserCustomer: elem.idUserCustomer,
    idCustomer: elem.idCustomer,

    distance: Number(elem.distance),
    route: elem.route,
    note: elem.note,
    visible: true,
    marked: false,

    acceptedUsers: elem.acceptedUsers?.split(', ').filter(v => v),
    answers: elem.answers?.split(', ').filter(v => v),

    idUserSender: elem.idUserSender,
    idSender: elem.idSender,
    sender: {
        idUser: elem.idUserSender,
        idSender: elem.idSender + '',
        title: elem.titleSender,
        innNumber: elem.innNumberSender,
        organizationName: elem.organizationNameSender,
        kpp: elem.kppSender,
        ogrn: elem.ogrnSender,
        address: elem.addressSender,
        shipperFio: elem.shipperFioSender,
        shipperTel: elem.shipperTelSender,
        description: elem.descriptionSender,
        coordinates: elem.coordinatesSender,
        city: elem.citySender,
    },


    idRecipient: elem.idRecipient,
    idUserRecipient: elem.idUserRecipient,
    recipient: {
        idUser: elem.idUserRecipient,
        idRecipient: elem.idRecipient as string,
        title: elem.titleRecipient,
        innNumber: elem.innNumberRecipient,
        organizationName: elem.organizationNameRecipient,
        kpp: elem.kppRecipient,
        ogrn: elem.ogrnRecipient,
        address: elem.addressRecipient,
        consigneesFio: elem.consigneesFioRecipient,
        consigneesTel: elem.consigneesTelRecipient,
        description: elem.descriptionRecipient,
        coordinates: elem.coordinatesRecipient,
        city: elem.cityRecipient,
    },

    globalStatus: elem.globalStatus as OneRequestType['globalStatus'],
    localStatus: {
        paymentHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred,
        paymentHasBeenReceived: elem.localStatuscargoHasBeenReceived,
        cargoHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred,
        cargoHasBeenReceived: elem.localStatuscargoHasBeenReceived,
    },


    requestUserCarrierId: elem.requestUserCarrierId,
    requestCarrierId: elem.requestCarrierId,
    idEmployee: elem.idEmployee,
    responseEmployee: {
        idEmployee: elem.idEmployee,
        employeeFIO: elem.responseEmployeeFIO,
        employeePhoneNumber: elem.responseEmployeePhoneNumber,
        passportSerial: elem.responseEmployeepassportSerial,
        passportFMS: elem.responseEmployeepassportFMS,
        passportDate: elem.responseEmployeepassportDate,
        drivingLicenseNumber: elem.responseEmployeedrivingLicenseNumber,
    },

    idTransport: elem.idTransport,
    responseTransport: {
        idTransport: elem.idTransport,
        transportNumber: elem.responseTransportNumber,
        transportTrademark: elem.responseTransportTrademark,
        transportModel: elem.responseTransportModel,
        pts: elem.responseTransportPts,
        dopog: elem.responseTransportDopog,
        cargoType: elem.responseTransportCargoType,
        cargoWeight: elem.responseTransportCargoWeight,
        propertyRights: elem.responseTransportPropertyRights,
    },

    idTrailer: elem.idTrailer,
    responseTrailer: {
        idTrailer: elem.idTrailer,
        trailerNumber: elem.responseTrailertrailerNumber,
        trailerTrademark: elem.responseTrailerTrademark,
        trailerModel: elem.responseTrailerModel,
        pts: elem.responseTrailerPts,
        dopog: elem.responseTrailerDopog,
        cargoType: elem.responseTrailerCargoType,
        cargoWeight: elem.responseTrailerCargoWeight,
        propertyRights: elem.responseTrailerPropertyRights,
    },

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
} )

/* САНКИ */

export type RequestStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, RequestStoreActionsType | GlobalModalActionsType>

// запрос списка всех заявок из бэка
export const getAllRequestsAPI = (): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.getAllRequests()
            if (response.length > 0) {
                dispatch(requestStoreActions.setContent(response.map(parseRequestFromAPI)))
            }
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
    }

// забрать данные одной СОЗДАННОЙ заявки от сервера
export const getOneRequestsAPI = ( requestNumber: number ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        try {
            const response = await oneRequestApi.getOneRequestById({ requestNumber })
            if (response.length > 0) {
                let element = response[0]
                dispatch(requestStoreActions.setInitialValues(parseRequestFromAPI(element)))
            } else {
                dispatch(globalModalStoreActions.setTextMessage('НЕ УДАЛОСЬ ЗАГРУЗИТЬ ЗАЯВКУ №' + requestNumber))
            }
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
            dispatch(requestStoreActions.setIsFetching(false))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// создать одну пустую заявку и вернуть дату и номер создания
export const setNewRequestAPI = (): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        dispatch(requestStoreActions.setInitialValues({} as OneRequestType))
        try {
            const idUserCustomer = getState().authStoreReducer.authID
            const response = await oneRequestApi.createOneRequest({ idUserCustomer })

            if (response.success) {
                dispatch(requestStoreActions.setInitialValues({
                    ...getState().requestStoreReducer.initialValues,
                    requestNumber: +response.Number,
                    requestDate: new Date(apiToISODateFormat(response.Date)),
                }))
            }
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// изменить текущую заявку
export const addAcceptedResponseToRequest = ( submitValues: ResponseToRequestCardType<string> ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))

        // подгружаем все данные из бэка по айдишкам
        await dispatch(getOneEmployeeFromAPI(submitValues.idEmployee))
        const employeeValues = getState().employeesStoreReducer.initialValues
        await dispatch(getOneTransportFromAPI(submitValues.idTransport))
        const transportValues = getState().transportStoreReducer.initialValues
        await dispatch(getOneTrailerFromAPI(submitValues.idTrailer))
        const trailerValues = getState().trailerStoreReducer.initialValues

        // удаляем все ответы, привязанные к данной заявке
        await dispatch(removeResponseToRequestsBzAcceptRequest(submitValues.requestNumber))

        try {
            const response = await oneRequestApi.modifyOneRequest({
                requestNumber: submitValues.requestNumber,
                globalStatus: 'в работе',
                responseStavka: submitValues.responseStavka,
                responseTax: submitValues.responseId,
                responsePrice: submitValues.responsePrice,
                /* СОТРУДНИК */
                idEmployee: employeeValues.idEmployee,
                responseEmployeeFIO: employeeValues.employeeFIO,
                responseEmployeePhoneNumber: employeeValues.employeePhoneNumber,
                responseEmployeepassportSerial: employeeValues.passportSerial,
                responseEmployeepassportFMS: employeeValues.passportFMS,
                responseEmployeepassportDate: employeeValues.passportDate as string,
                responseEmployeedrivingLicenseNumber: employeeValues.drivingLicenseNumber,
                /* ТРАНСПОРТ */
                idTransport: transportValues.idTransport,
                responseTransportNumber: transportValues.transportNumber,
                responseTransportTrademark: transportValues.transportTrademark,
                responseTransportModel: transportValues.transportModel,
                responseTransportPts: transportValues.pts,
                responseTransportDopog: transportValues.dopog,
                responseTransportCargoType: transportValues.cargoType,
                responseTransportCargoWeight: transportValues.cargoWeight,
                responseTransportPropertyRights: transportValues.propertyRights,
                /* ПРИЦЕП */
                idTrailer: trailerValues.idTrailer,
                responseTrailertrailerNumber: trailerValues.trailerNumber,
                responseTrailerTrademark: trailerValues.trailerTrademark,
                responseTrailerModel: trailerValues.trailerModel,
                responseTrailerPts: trailerValues.pts,
                responseTrailerDopog: trailerValues.dopog,
                responseTrailerCargoType: trailerValues.cargoType,
                responseTrailerCargoWeight: trailerValues.cargoWeight,
                responseTrailerPropertyRights: trailerValues.propertyRights,
            })

            if (response.success) {
                await dispatch(getAllRequestsAPI())
            }

        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
    }

// изменить текущую заявку
export const changeCurrentRequest = ( submitValues: OneRequestType ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        try {
            const idUserCustomer = getState().authStoreReducer.authID
            const requestNumber = submitValues.requestNumber?.toString() || '0'
            const placeholder = '-'
            const response = await oneRequestApi.modifyOneRequest({
                    acceptedUsers: undefined, // изменяется через другой запрос
                    requestDate: undefined, // потому как она уже задана при создании

                    requestNumber,
                    idUserCustomer,
                    idCustomer: submitValues.idCustomer,

                    cargoComposition: submitValues.cargoComposition,
                    shipmentDate: yearMmDdFormatISO(submitValues.shipmentDate),
                    cargoType: submitValues.cargoType,
                    idSender: submitValues.idSender,
                    idRecipient: submitValues.idRecipient,
                    distance: submitValues.distance?.toString(),
                    route: submitValues.route,
                    note: submitValues.note,


                    globalStatus: submitValues.globalStatus,
                    localStatuspaymentHasBeenTransferred: submitValues.localStatus?.paymentHasBeenTransferred,
                    localStatuscargoHasBeenTransferred: submitValues.localStatus?.cargoHasBeenTransferred,
                    localStatuspaymentHasBeenReceived: submitValues.localStatus?.paymentHasBeenReceived,
                    localStatuscargoHasBeenReceived: submitValues.localStatus?.cargoHasBeenReceived,

                    // idUserSender: submitValues.idUserSender,
                    titleSender: submitValues.sender.title,
                    innNumberSender: submitValues.sender.innNumber,
                    organizationNameSender: submitValues.sender.organizationName,
                    kppSender: submitValues.sender.kpp,
                    ogrnSender: submitValues.sender.ogrn,
                    addressSender: submitValues.sender.address,
                    shipperFioSender: submitValues.sender.shipperFio,
                    shipperTelSender: submitValues.sender.shipperTel,
                    descriptionSender: submitValues.sender.description,
                    coordinatesSender: submitValues.sender.coordinates,
                    citySender: submitValues.sender.city,

                    // idUserRecipient: submitValues.idUserRecipient,
                    titleRecipient: submitValues.recipient.title,
                    innNumberRecipient: submitValues.recipient.innNumber,
                    organizationNameRecipient: submitValues.recipient.organizationName,
                    kppRecipient: submitValues.recipient.kpp,
                    ogrnRecipient: submitValues.recipient.ogrn,
                    addressRecipient: submitValues.recipient.address,
                    consigneesFioRecipient: submitValues.recipient.consigneesFio,
                    consigneesTelRecipient: submitValues.recipient.consigneesTel,
                    descriptionRecipient: submitValues.recipient.description || placeholder,
                    coordinatesRecipient: submitValues.recipient.coordinates,
                    cityRecipient: submitValues.recipient.city,

                    // ответка на заявку
                    requestCarrierId: submitValues.requestCarrierId,
                    // сотрудник
                    idEmployee: submitValues.idEmployee,
                    responseEmployeeFIO: submitValues.responseEmployee?.employeeFIO,
                    responseEmployeePhoneNumber: submitValues.responseEmployee?.employeePhoneNumber,
                    responseEmployeedrivingLicenseNumber: submitValues.responseEmployee?.drivingLicenseNumber,
                    responseEmployeepassportDate: submitValues.responseEmployee?.passportDate as string,
                    responseEmployeepassportFMS: submitValues.responseEmployee?.passportFMS,
                    responseEmployeepassportSerial: submitValues.responseEmployee?.idEmployee,
                    // транспорт
                    idTransport: submitValues.idTransport,
                    responseTransportCargoType: submitValues.responseTransport?.cargoType,
                    responseTransportCargoWeight: submitValues.responseTransport?.cargoWeight,
                    responseTransportDopog: submitValues.responseTransport?.dopog,
                    responseTransportModel: submitValues.responseTransport?.transportModel,
                    responseTransportNumber: submitValues.responseTransport?.transportNumber,
                    responseTransportPropertyRights: submitValues.responseTransport?.propertyRights,
                    responseTransportPts: submitValues.responseTransport?.pts,
                    responseTransportTrademark: submitValues.responseTransport?.transportTrademark,
                    // прицеп
                    idTrailer: submitValues.idTrailer,
                    responseTrailerCargoType: submitValues.responseTrailer?.cargoType,
                    responseTrailerCargoWeight: submitValues.responseTrailer?.cargoWeight,
                    responseTrailerDopog: submitValues.responseTrailer?.dopog,
                    responseTrailerModel: submitValues.responseTrailer?.trailerModel,
                    responseTrailerPropertyRights: submitValues.responseTrailer?.propertyRights,
                    responseTrailerPts: submitValues.responseTrailer?.pts,
                    responseTrailerTrademark: submitValues.responseTrailer?.trailerTrademark,
                    responseTrailertrailerNumber: submitValues.responseTrailer?.trailerNumber,
                    responseStavka: submitValues.responseStavka,
                    responseTax: submitValues.responseTax,
                    responsePrice: submitValues.responsePrice,
                    cargoWeight: submitValues.cargoWeight?.toString(),
                    uploadTime: submitValues.uploadTime?.toString(),

                    proxyFreightLoader: submitValues.documents?.proxyWay?.proxyFreightLoader,
                    proxyDriver: submitValues.documents?.proxyWay?.proxyDriver,
                    proxyWaybillDriver: submitValues.documents?.proxyWay?.waybillDriver,
                    // здесь надо будет добавить файл
                    // cargoDocuments: initialValues.documents.cargoDocuments,

                    ttnECPdocumentDownload: submitValues.documents?.ttnECP?.documentDownload,
                    // здесь надо будет добавить файл
                    // ttnECPdocumentUpload: initialValues.documents.ttnECP.documentUpload,
                    ttnECPcustomerIsSubscribe: submitValues.documents?.ttnECP?.customerIsSubscribe?.toString(),
                    ttnECPcarrierIsSubscribe: submitValues.documents?.ttnECP?.carrierIsSubscribe?.toString(),
                    ttnECPconsigneeIsSubscribe: submitValues.documents?.ttnECP?.consigneeIsSubscribe?.toString(),

                    contractECPdocumentDownload: submitValues.documents?.contractECP?.documentDownload,
                    // здесь надо будет добавить файл
                    // contractECPdocumentUpload: initialValues.documents.contractECPdocumentUpload,
                    contractECPcustomerIsSubscribe: submitValues.documents?.contractECP?.customerIsSubscribe?.toString(),
                    contractECPcarrierIsSubscribe: submitValues.documents?.contractECP?.carrierIsSubscribe?.toString(),

                    updECPdocumentDownload: submitValues.documents?.updECP?.documentDownload,
                    // здесь надо будет добавить файл
                    // updECPdocumentUpload: initialValues.documents.updECP.documentUpload,
                    updECPcustomerIsSubscribe: submitValues.documents?.updECP?.customerIsSubscribe?.toString(),
                    updECPcarrierIsSubscribe: submitValues.documents?.updECP?.carrierIsSubscribe?.toString(),

                    customerToConsigneeContractECPdocumentDownload: submitValues.documents?.customerToConsigneeContractECP?.documentDownload,
                    // здесь надо будет добавить файл
                    // customerToConsigneeContractECPdocumentUpload: initialValues.documents.customerToConsigneeContractECP.documentUpload,
                    customerToConsigneeContractECPcustomerIsSubscribe: submitValues.documents?.customerToConsigneeContractECP?.customerIsSubscribe?.toString(),
                    customerToConsigneeContractECPconsigneeIsSubscribe: submitValues.documents?.customerToConsigneeContractECP?.consigneeIsSubscribe?.toString(),
                },
            )

            if (response.success) {
                await dispatch(getAllRequestsAPI())
            }
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

export const deleteCurrentRequestAPI = ( { requestNumber }: { requestNumber: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.deleteOneRequest({ requestNumber })
            console.log(response.message)
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(
                // @ts-ignore-next-line
                e.response.data)))
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
            console.log(e)
        }
    }

// отправляем изменения селектора и выставляем его значение в Initial (это добавляемый селектор)
export const setCargoCompositionSelector = ( newCargoCompositionItem: string ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            // убираем палки в названии
            const text = newCargoCompositionItem.replaceAll('|', '')
            const response = await cargoEditableSelectorApi.addOneCargoComposition(text)
            if (response.success) {
                await dispatch(getCargoCompositionSelector())
            }
        } catch (e) {
            console.log(JSON.stringify(
                // @ts-ignore-next-line
                e.response.data))
        }
    }

export const getRouteFromAPI = ( {
                                     oneShipper,
                                     oneConsignee,
                                 }: { oneShipper: ShippersCardType, oneConsignee: ConsigneesCardType } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(true))
        const initialValues = getState().requestStoreReducer.initialValues
        try {
            const response = await getRouteFromAvtodispetcherApi({
                from: oneShipper.coordinates || '',
                to: oneConsignee.coordinates || '',
            })

            const distance = +( +response.kilometers * getState().appStoreReducer.distanceCoefficient ).toFixed(0)

            // записываем изменения селекторов и прилепляем данные грузоотправителя и грузополучателя
            dispatch(requestStoreActions.setInitialValues({
                ...initialValues,
                idSender: oneShipper.idSender,
                sender: oneShipper,
                idRecipient: oneConsignee.idRecipient,
                recipient: oneConsignee,
                route: response.polyline,
                distance,
            }))
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
            dispatch(requestStoreActions.setInitialValues({
                ...initialValues, route: '', distance: 0,
            }))
        }
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(false))
    }
