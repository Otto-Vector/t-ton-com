import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {
    CargoTypeType,
    ConsigneesCardType,
    DocumentsRequestType,
    EmployeeCardType,
    OneRequestApiType,
    OneRequestType,
    ResponseToRequestCardType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
    ValidateType,
} from '../../types/form-types'
import {composeValidators, required} from '../../utils/validators'
import {getRouteFromAvtodispetcherApi} from '../../api/external-api/avtodispetcher.api';
import {cargoEditableSelectorApi} from '../../api/local-api/cargoEditableSelector.api';
import {oneRequestApi} from '../../api/local-api/request-response/request.api';
import {apiToISODateFormat, yearMmDdFormatISO} from '../../utils/date-formats';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest} from '../options/employees-store-reducer';
import {removeResponseToRequestsBzAcceptRequest} from './add-driver-store-reducer';
import {TtonErrorType} from '../../types/other-types';
import {AllNestedKeysToType, GetActionsTypes} from '../../types/ts-utils';


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
    } as AllNestedKeysToType<OneRequestType, ( string | undefined )>,

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
    } as AllNestedKeysToType<DocumentsRequestType>,

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

    initialDocumentsRequestValues: {} as DocumentsRequestType,
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
    customerUser: {
        innNumber: elem.innNumberCustomer,
        organizationName: elem.organizationNameCustomer,
        taxMode: elem.taxModeCustomer,
        kpp: elem.kppCustomer,
        ogrn: elem.ogrnCustomer,
        okpo: elem.okpoCustomer,
        legalAddress: elem.legalAddressCustomer,
        description: elem.descriptionCustomer,
        postAddress: elem.postAddressCustomer,
        phoneDirector: elem.phoneDirectorCustomer,
        phoneAccountant: elem.phoneAccountantCustomer,
        email: elem.emailCustomer,
        bikBank: elem.bikBankCustomer,
        nameBank: elem.nameBankCustomer,
        checkingAccount: elem.checkingAccountCustomer,
        korrAccount: elem.korrAccountCustomer,
        mechanicFIO: elem.mechanicFIOCustomer,
        dispatcherFIO: elem.dispatcherFIOCustomer,
    },

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
    senderUser: {
        taxMode: elem.taxModeSender,
        okpo: elem.okpoSender,
        legalAddress: elem.legalAddressSender,
        postAddress: elem.postAddressSender,
        phoneDirector: elem.phoneDirectorSender,
        phoneAccountant: elem.phoneAccountantSender,
        email: elem.emailSender,
        bikBank: elem.bikBankSender,
        nameBank: elem.nameBankSender,
        checkingAccount: elem.checkingAccountSender,
        korrAccount: elem.korrAccountSender,
        mechanicFIO: elem.mechanicFIOSender,
        dispatcherFIO: elem.dispatcherFIOSender,
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
    recipientUser: {
        taxMode: elem.taxModeRecipient,
        okpo: elem.okpoRecipient,
        legalAddress: elem.legalAddressRecipient,
        postAddress: elem.postAddressRecipient,
        phoneDirector: elem.phoneDirectorRecipient,
        phoneAccountant: elem.phoneAccountantRecipient,
        email: elem.emailRecipient,
        bikBank: elem.bikBankRecipient,
        nameBank: elem.nameBankRecipient,
        checkingAccount: elem.checkingAccountRecipient,
        korrAccount: elem.korrAccountRecipient,
        mechanicFIO: elem.mechanicFIORecipient,
        dispatcherFIO: elem.dispatcherFIORecipient,
    },

    globalStatus: elem.globalStatus as OneRequestType['globalStatus'],
    localStatus: {
        paymentHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred,
        paymentHasBeenReceived: elem.localStatuscargoHasBeenReceived,
        cargoHasBeenTransferred: elem.localStatuscargoHasBeenTransferred,
        cargoHasBeenReceived: elem.localStatuscargoHasBeenReceived,
    },

    requestUserCarrierId: elem.requestUserCarrierId,
    requestCarrierId: elem.requestCarrierId,
    requestCarrierUser: {
        innNumber: elem.innNumberCarrier,
        organizationName: elem.organizationNameCarrier,
        taxMode: elem.taxModeCarrier,
        kpp: elem.kppCarrier,
        ogrn: elem.ogrnCarrier,
        okpo: elem.okpoCarrier,
        legalAddress: elem.legalAddressCarrier,
        description: elem.descriptionCarrier,
        postAddress: elem.postAddressCarrier,
        phoneDirector: elem.phoneDirectorCarrier,
        phoneAccountant: elem.phoneAccountantCarrier,
        email: elem.emailCarrier,
        bikBank: elem.bikBankCarrier,
        nameBank: elem.nameBankCarrier,
        checkingAccount: elem.checkingAccountCarrier,
        korrAccount: elem.korrAccountCarrier,
        mechanicFIO: elem.mechanicFIOCarrier,
        dispatcherFIO: elem.dispatcherFIOCarrier,
    },

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
            customerIsSubscribe: elem.ttnECPcustomerIsSubscribe,
            carrierIsSubscribe: elem.ttnECPcarrierIsSubscribe,
            consigneeIsSubscribe: elem.ttnECPconsigneeIsSubscribe,
        },
        contractECP: {
            header: undefined,
            documentUpload: undefined,
            documentDownload: elem.contractECPdocumentDownload,
            customerIsSubscribe: elem.contractECPcustomerIsSubscribe,
            carrierIsSubscribe: elem.contractECPcarrierIsSubscribe,
        },
        updECP: {
            header: undefined,
            documentUpload: undefined,
            documentDownload: elem.updECPdocumentDownload,
            customerIsSubscribe: elem.updECPcustomerIsSubscribe,
            carrierIsSubscribe: elem.updECPcarrierIsSubscribe,
        },
        customerToConsigneeContractECP: {
            header: undefined,
            documentUpload: undefined,
            documentDownload: elem.customerToConsigneeContractECPdocumentDownload,
            customerIsSubscribe: elem.customerToConsigneeContractECPcustomerIsSubscribe,
            consigneeIsSubscribe: elem.customerToConsigneeContractECPconsigneeIsSubscribe,
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
                dispatch(requestStoreActions.setInitialValues(parseRequestFromAPI(response[0])))
            } else {
                dispatch(globalModalStoreActions.setTextMessage(
                    ['НЕ УДАЛОСЬ ЗАГРУЗИТЬ ЗАЯВКУ №' + requestNumber,
                    ( response.message ? ' Причина' + response.message : '' ),
                    ]
                ))
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
                    idUserCustomer,
                    requestNumber: +response.Number,
                    requestDate: new Date(apiToISODateFormat(response.Date)),
                } as OneRequestType))
            }
        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// акцептировать текущую заявку и присвоить ей статус "в работе" ПРИ САМОВЫВОЗЕ
export const addAcceptedResponseToRequestOnCreate = (
    { addDriverValues, oneEmployee: employeeValues, oneTransport: transportValues, oneTrailer: trailerValues }
        : {
        addDriverValues: ResponseToRequestCardType<string>,
        oneEmployee: EmployeeCardType<string>
        oneTransport: TransportCardType<string>
        oneTrailer: TrailerCardType<string>
    } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        const idUser = getState().authStoreReducer.authID
        try {
            const response = await oneRequestApi.modifyOneRequest({
                requestNumber: addDriverValues.requestNumber,

                globalStatus: 'в работе',
                responseStavka: addDriverValues.responseStavka,
                responseTax: addDriverValues.responseId,
                responsePrice: addDriverValues.responsePrice,
                requestUserCarrierId: idUser,
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
                // удаляем все ответы, привязанные к данной заявке
                // await dispatch(removeResponseToRequestsBzAcceptRequest(addDriverValues.requestNumber))
                // применяем статус 'на заявке'
                await dispatch(modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest({ idEmployee: employeeValues.idEmployee }))
                // перезаливаем все заявки
                await dispatch(getAllRequestsAPI())
            }

        } catch (e) {
            dispatch(globalModalStoreActions.setTextMessage(e as string))
        }
    }

// изменить текущую заявку ПРИ СОЗДАНИИ
export const changeCurrentRequestOnCreate = ( submitValues: OneRequestType ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        try {
            const userId = getState().authStoreReducer.authID
            // механика выяснения какому пользователю каокй инн
            const filteredContent = getState().requisitesStoreReducer.filteredContent
            const innCustomer = getState().shippersStoreReducer.content
                .find(( { idSender } ) => idSender === submitValues.idCustomer)?.innNumber
            const userCustomer = filteredContent?.find(( { innNumber } ) => innNumber === innCustomer)
            const userSender = filteredContent?.find(( { innNumber } ) => innNumber === submitValues.sender.innNumber)
            const userRecipient = filteredContent?.find(( { innNumber } ) => innNumber === submitValues.recipient.innNumber)
            const acceptedUsers = [ userCustomer?.idUser || userId, userSender?.idUser, userRecipient?.idUser ].filter(x => x).join(', ')

            const requestNumber = submitValues.requestNumber?.toString() || '0'
            const placeholder = '-'

            const response = await oneRequestApi.modifyOneRequest({

                    requestNumber,
                    globalStatus: 'новая заявка',
                    acceptedUsers,
                    cargoComposition: submitValues.cargoComposition,
                    shipmentDate: yearMmDdFormatISO(submitValues.shipmentDate),
                    cargoType: submitValues.cargoType,
                    distance: submitValues.distance?.toString(),
                    route: submitValues.route,
                    note: submitValues.note,

                    idCustomer: submitValues.idCustomer,
                    idUserCustomer: userCustomer?.idUser || userId,
                    // organizationNameCustomer: userCustomer?.organizationName,
                    // taxModeCustomer: userCustomer?.taxMode,
                    // kppCustomer: userCustomer?.kpp,
                    // ogrnCustomer: userCustomer?.ogrn,
                    // okpoCustomer: userCustomer?.okpo,
                    // legalAddressCustomer: userCustomer?.legalAddress,
                    // descriptionCustomer: userCustomer?.description,
                    // postAddressCustomer: userCustomer?.postAddress,
                    // phoneDirectorCustomer: userCustomer?.phoneDirector,
                    // phoneAccountantCustomer: userCustomer?.phoneAccountant,
                    // emailCustomer: userCustomer?.email,
                    // bikBankCustomer: userCustomer?.bikBank,
                    // nameBankCustomer: userCustomer?.nameBank,
                    // checkingAccountCustomer: userCustomer?.checkingAccount,
                    // korrAccountCustomer: userCustomer?.korrAccount,
                    // mechanicFIOCustomer: userCustomer?.mechanicFIO,
                    // dispatcherFIOCustomer: userCustomer?.dispatcherFIO,

                    idSender: submitValues.idSender,
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

                    idUserSender: userSender?.idUser,
                    // taxModeSender: userSender?.taxMode,
                    // okpoSender: userSender?.okpo,
                    // legalAddressSender: userSender?.legalAddress,
                    // postAddressSender: userSender?.postAddress,
                    // phoneDirectorSender: userSender?.phoneDirector,
                    // phoneAccountantSender: userSender?.phoneAccountant,
                    // emailSender: userSender?.email,
                    // bikBankSender: userSender?.bikBank,
                    // nameBankSender: userSender?.nameBank,
                    // checkingAccountSender: userSender?.checkingAccount,
                    // korrAccountSender: userSender?.korrAccount,
                    // mechanicFIOSender: userSender?.mechanicFIO,
                    // dispatcherFIOSender: userSender?.dispatcherFIO,

                    idRecipient: submitValues.idRecipient,
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

                    idUserRecipient: userRecipient?.idUser,
                    // taxModeRecipient: userRecipient?.taxMode,
                    // okpoRecipient: userRecipient?.okpo,
                    // legalAddressRecipient: userRecipient?.legalAddress,
                    // postAddressRecipient: userRecipient?.postAddress,
                    // phoneDirectorRecipient: userRecipient?.phoneDirector,
                    // phoneAccountantRecipient: userRecipient?.phoneAccountant,
                    // emailRecipient: userRecipient?.email,
                    // bikBankRecipient: userRecipient?.bikBank,
                    // nameBankRecipient: userRecipient?.nameBank,
                    // checkingAccountRecipient: userRecipient?.checkingAccount,
                    // korrAccountRecipient: userRecipient?.korrAccount,
                    // mechanicFIORecipient: userRecipient?.mechanicFIO,
                    // dispatcherFIORecipient: userRecipient?.dispatcherFIO,
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

// удаляем заявку по её номеру
export const deleteCurrentRequestAPI = ( { requestNumber }: { requestNumber: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.deleteOneRequest({ requestNumber })
            console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
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
        } catch (e: TtonErrorType) {
            console.log(JSON.stringify(e?.response?.data))
        }
    }

// загрузка километража и прорисовка пути в карту
export const getRouteFromAPI = ( {
                                     oneShipper,
                                     oneConsignee,
                                 }: { oneShipper: ShippersCardType, oneConsignee: ConsigneesCardType } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(true))
        const initialValues = getState().requestStoreReducer.initialValues
        try {
            // отправляем запрос на маршрут
            const response = await getRouteFromAvtodispetcherApi({
                from: oneShipper.coordinates || '',
                to: oneConsignee.coordinates || '',
            })

            // конвертируем дистанцию с учетом коэффициэнта
            const distance = +( +response.kilometers * getState().appStoreReducer.distanceCoefficient ).toFixed(0)

            // максимальное количество символов, которые мы можем у себя сохранить
            if (response.polyline && response.polyline.length > 49990) {
                // уходим в ошибку
                throw new Error(`Слишком длинный маршрут (${ distance }км), выберите другого грузоотправителя или грузополучателя`)
            }

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

            const isSenderChanged = oneShipper.idSender !== initialValues.idSender
            const isConsigneeChanged = oneConsignee.idRecipient !== initialValues.idRecipient
            // зачищаем поле при изменении которого возникли ошибки
            dispatch(requestStoreActions.setInitialValues({
                ...initialValues,
                idSender: isSenderChanged ? '' : oneShipper.idSender,
                sender: isSenderChanged ? {} as ShippersCardType : oneShipper,
                idRecipient: isConsigneeChanged ? '' : oneConsignee.idRecipient,
                recipient: isConsigneeChanged ? {} as ConsigneesCardType : oneConsignee,
                route: '',
                distance: 0,
            }))
            // выводим ошибку
            dispatch(globalModalStoreActions.setTextMessage(e + ''))
        }

        dispatch(requestStoreActions.setCurrentDistanceIsFetching(false))
    }
