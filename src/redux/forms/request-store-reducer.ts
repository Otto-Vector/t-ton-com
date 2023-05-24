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
import {syncValidators} from '../../utils/validators'
import {getRouteFromAvtodispetcherApi} from '../../api/external-api/avtodispetcher.api'
import {oneRequestApi} from '../../api/local-api/request-response/request.api'
import {addNDay, apiToISODateFormat, yearMmDdFormat, yearMmDdFormatISO} from '../../utils/date-formats'
import {textAndActionGlobalModal} from '../utils/global-modal-store-reducer'
import {
    getOneEmployeeFromAPI,
    modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest,
    modifyOneEmployeeSoftToAPI,
} from '../options/employees-store-reducer'
import {AllNestedKeysToType, GetActionsTypes} from '../../types/ts-utils'
import {TtonErrorType} from '../../api/local-api/back-instance.api'
import {requestDocumentsApi} from '../../api/local-api/request-response/request-documents.api'
import {getListOrganizationRequisitesByInn} from '../options/requisites-store-reducer'
import {requisitesApi} from '../../api/local-api/options/requisites.api'
import {toNumber} from '../../utils/parsers'
import {boldWrapper} from '../../utils/html-rebuilds'
import {employeesApi} from '../../api/local-api/options/employee.api'
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api'


const initialState = {
    requestIsFetching: false,
    // для отрисовки ожидания построения маршрута при создании заявки
    currentDistanceIsFetching: false,
    label: {
        // Номер заявки
        requestNumber: 'Номер заявки',
        // Дата создания заявки
        requestDate: 'Дата создания заявки',
        // Вид груза
        cargoComposition: 'Вид груза',
        // Дата погрузки
        shipmentDate: 'Дата погрузки',
        // Расстояние, км.
        distance: 'Расстояние, км.',
        // Тип груза
        cargoType: 'Тип груза',
        // Заказчик
        idCustomer: 'Заказчик',
        // Грузоотправитель
        idSender: 'Грузоотправитель',
        // Грузополучатель
        idRecipient: 'Грузополучатель',
        // Перевозчик
        requestCarrierId: 'Перевозчик',
        // Водитель
        idEmployee: 'Водитель',
        // Примечание
        note: 'Примечание',
        // Пломбы для груза
        cargoStamps: 'Пломбы для груза',

        /* ПОЛЯ НА ВКЛАДКУ ДОКУМЕНТЫ */

        // Время погрузки
        uploadTime: 'Время погрузки',
        // Вес груза, в тн.
        cargoWeight: 'Вес груза, в тн.',
        // Цена по Заявке
        responsePrice: 'Цена по Заявке',
        localStatus: {
            // Оплату передал
            paymentHasBeenTransferred: 'Оплату передал',
            // Оплату получил
            paymentHasBeenReceived: 'Оплату получил',
            // Груз передан
            cargoHasBeenTransferred: 'Груз передан',
            // Закрыть заявку
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
        idCustomer: 'Наименование организации Заказчика',
        idSender: 'Наименование организации Владельца груза',
        idRecipient: 'Наименование организации Грузополучателя',
        requestCarrierId: 'Наименование организации Перевозчика',
        idEmployee: 'ФИО, Марка авто, Марка прицепа, тн',
        note: 'дополнительные данные',
        cargoStamps: 'Пломбы для груза',
    } as Record<keyof OneRequestType, string | undefined>,

    validators: {
        requestNumber: undefined,
        requestDate: syncValidators.required,
        cargoComposition: syncValidators.required,
        shipmentDate: syncValidators.required,
        distance: undefined,
        cargoType: syncValidators.required,
        idCustomer: syncValidators.required,
        idSender: syncValidators.required,
        idRecipient: syncValidators.required,
        requestCarrierId: undefined,
        idEmployee: undefined,
        note: syncValidators.textMax,
        cargoStamps: syncValidators.textMiddle,
    } as Record<keyof OneRequestType, ValidateType>,

    defaultInitialStateValues: {} as OneRequestType,

    initialValues: {
        requestNumber: 0,
    } as OneRequestType,

    // загружаем сюда заявки
    contentByDate: [] as OneRequestType[],
    contentByUser: [] as OneRequestType[],

    labelDocumentsRequestValues: {

        proxyWay: {
            header: 'Транспортные документы',
            proxyFreightLoader: 'Доверенность Грузовладельцу',
            proxyDriver: 'Доверенность на Водителя',
            waybillDriver: 'Путевой Лист Водителя',
            itineraryList: 'Маршрутный Лист Водителя',
        },

        cargoDocuments: 'Документы груза + ТН, паспорт, прочее',

        ttnECP: {
            header: 'Товарно-Транспортная Накладная',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            consigneeIsSubscribe: 'Грузополучатель',
            documentDownload: 'Загрузить',
        },
        contractECP: {
            header: 'Договор оказания транспортных услуг',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            documentDownload: 'Загрузить',
        },
        updECP: {
            header: 'УПД от Перевозчика для Заказчика',
            customerIsSubscribe: 'Заказчик',
            carrierIsSubscribe: 'Перевозчик',
            documentDownload: 'Загрузить',
        },

        customerToConsigneeContractECP: {
            header: 'Документы от Заказчика для ГрузоПолучателя',
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
        shipmentDate: [ 'Дата погрузки по доверенности.', 'При создании заявки вводится дата от сегодняшнего дня до +14 дней' ],
        uploadTime: [
            '<b>Время погрузки</b> устанавливается во время передачи груза водителю.',
            '<b>Время разгрузки</b> устанавливается во время передачи груза грузополучателю.',
            '<b>Время в пути</b> появляется и меняется щелчком мыши при условии что груз доставлен.',
        ],
        distance: 'Расчет производится автоматически на основании координат мест Погрузки и Разгрузки. Плюс коэффициэнт:',
        cargoType: 'Укажите тип прицепа или сцепки, для осуществления верного поиска транспорта.',
        customer: 'Ваша организация или сторонняя организация использующая Агентов для оказания собственных услуг перевозки. Получает права владельца Заявки после создания Заявки.',
        shipper: 'Юридические владельцы груза. НЕ получает права на просмотр данной Заявки, предоставляет местоположение и контактный телефон представителя для сбора груза.',
        consignee: 'Юридические получатели груза. Получает права на просмотр созданной Заявки, отслеживание транспорта, просмотр контактных и прочих данных указанных в Заявке.',
        carrier: 'Перевозчики Вашего груза от Отправителя до Получателя. НЕ видит информацию о Заказчике, Грузоотправителе и Грузополучателе, до окончательного принятия Заявки. Требуется проверка Перевозчика до момента передачи груза!',
        driver: 'Сотрудник Перевозчика и данные транспорта. При использовании мобильного приложения, отображается маршрут на карте, может звонить всем сторонам Заявки и предоставлять сканы документов.',
        note: 'Дополнительная информация доступная До принятия Заявки, для указания особенностей транспортировки или погрузочно-разгрузочных работ.',
        cargoStamps: 'Пломбы для груза, через запятую',
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
        case 'request-store-reducer/SET-CONTENT-BY-DATE': {
            return {
                ...state,
                contentByDate: action.contentByDate,
            }
        }
        case 'request-store-reducer/SET-CONTENT-BY-USER': {
            return {
                ...state,
                contentByUser: action.contentByUser,
            }
        }
        case 'request-store-reducer/SET-TOGGLE-REQUEST-BY-DATE-VISIBLE': {
            return {
                ...state,
                contentByDate: [ ...state.contentByDate.map(( oneRequest ) =>
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
        case 'request-store-reducer/SET-KOEFFICIENT-TO-INFO': {
            return {
                ...state,
                infoTextModals: {
                    ...state.infoTextModals,
                    distance: state.infoTextModals.distance + (
                        !state.infoTextModals?.distance?.includes('<b>') ? ` <b>${ action.koef * 100 - 100 }%</b>` : ''
                    ),
                },
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
    setContentByDate: ( contentByDate: OneRequestType[] ) => ( {
        type: 'request-store-reducer/SET-CONTENT-BY-DATE',
        contentByDate,
    } as const ),
    setContentByUser: ( contentByUser: OneRequestType[] ) => ( {
        type: 'request-store-reducer/SET-CONTENT-BY-USER',
        contentByUser,
    } as const ),
    setCurrentDistanceIsFetching: ( isFetching: boolean ) => ( {
        type: 'request-store-reducer/SET-CURRENT-DISTANCE-IS-FETCHING',
        isFetching,
    } as const ),
    setKoefficientToInfo: ( koef: number ) => ( {
        type: 'request-store-reducer/SET-KOEFFICIENT-TO-INFO',
        koef,
    } as const ),
    setToggleRequestVisible: ( requestNumber: number ) => ( {
        type: 'request-store-reducer/SET-TOGGLE-REQUEST-BY-DATE-VISIBLE',
        requestNumber,
    } as const ),
}

// адаптируем заявку от сервера в локальную модель данных
const parseRequestFromAPI = ( {
                                  idUser,
                                  innNumber,
                                  kpp,
                              }: { idUser: string, innNumber: string, kpp: string } ) => ( elem: OneRequestApiType ): OneRequestType => ( {
    requestNumber: +elem.requestNumber,
    requestDate: elem.requestDate ? new Date(apiToISODateFormat(elem.requestDate)) : undefined,
    cargoComposition: elem.cargoComposition,
    shipmentDate: elem.shipmentDate ? new Date(elem.shipmentDate) : undefined,
    cargoType: elem.cargoType as CargoTypeType,
    addedPrice: elem.addedPrice,

    distance: Number(elem.distance),
    // toDo: убрать эту дибильную проверку на '-', когда он исправит поле на необязательное
    route: elem?.route || '' + ( elem?.routePlus ? ( ( elem.routePlus !== '-' ) ? elem.routePlus : '' ) : '' ),
    note: elem.note,
    cargoStamps: elem.cargoStamps,
    visible: true,
    marked: false,

    acceptedUsers: elem.acceptedUsers?.split(', ').filter(v => v),
    answers: elem.answers?.split(', ').filter(v => v),

    /* МАРКЕРЫ ОТМЕНЫ ЗАЯВКИ */
    isCanceledDate: elem.isCanceledDate,
    isCanceledReason: elem.isCanceledReason,

    /* СТАТУСЫ */
    globalStatus: elem.globalStatus as OneRequestType['globalStatus'],
    roleStatus: { // вычисляем отношение к заявке не только по idUser
        isCustomer: idUser === elem.idUserCustomer || ( innNumber === elem.innNumberCustomer && kpp === elem.kppCustomer ),
        isCarrier: idUser === elem.requestUserCarrierId || ( innNumber === elem.innNumberCarrier && kpp === elem.kppCarrier ),
        isRecipient: idUser === elem.idUserRecipient || ( innNumber === elem.innNumberRecipient && kpp === elem.kppRecipient ),
        isSender: idUser === elem.idUserSender || ( innNumber === elem.innNumberSender && kpp === elem.kppSender ),
    },
    localStatus: {
        paymentHasBeenTransferred: elem.localStatuspaymentHasBeenTransferred,
        paymentHasBeenReceived: elem.localStatuspaymentHasBeenReceived,
        cargoHasBeenTransferred: elem.localStatuscargoHasBeenTransferred,
        cargoHasBeenReceived: elem.localStatuscargoHasBeenReceived,
    },
    /* ЗАКАЗЧИК */
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
    /* ГРУЗООТПРАВИТЕЛЬ */
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

    // ГРУЗОПОЛУЧАТЕЛЬ
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

    // ПЕРЕВОЗЧИК
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
    // ВОДИТЕЛЬ
    idEmployee: elem.idEmployee,
    responseEmployee: {
        idEmployee: elem.idEmployee,
        employeeFIO: elem.responseEmployeeFIO,
        employeePhoneNumber: elem.responseEmployeePhoneNumber,
        passportSerial: elem.responseEmployeepassportSerial,
        passportFMS: elem.responseEmployeepassportFMS,
        passportDate: elem.responseEmployeepassportDate,
        drivingLicenseNumber: elem.responseEmployeedrivingLicenseNumber,
        photoFace: elem.responseEmployeePhotoFace,
    },
    // ТРАНСПОРТ
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
        transportImage: elem.responseTransportImage,
    },
    // ПРИЦЕП
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
        trailerImage: elem.responseTrailerImage,
    },

    responseStavka: elem.responseStavka,
    responseTax: elem.responseTax,
    responsePrice: elem.responsePrice,
    cargoWeight: elem.cargoWeight,

    uploadTime: elem.uploadTime && new Date(elem.uploadTime),
    unloadTime: elem.unloadTime && new Date(elem.unloadTime),

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

export type RequestStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, RequestStoreActionsType>

// запрос списка всех заявок из бэка
export const getAllRequestsAPI = (): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        try {
            dispatch(requestStoreActions.setKoefficientToInfo(getState().baseStoreReducer.distanceCoefficient))
            // получить список ВООБЩЕ ВСЕХ заявок
            // const responseAllRequests = await oneRequestApi.getAllRequests()
            // toDo: вернуть эту строку, убрать следующую
            const shipmentDate = yearMmDdFormat(addNDay(new Date(), -1)) + 'T00:00'
            // const shipmentDate = yearMmDdFormat(new Date('2023-01-26')) + 'T00:00'
            // список заявок по дате
            const responseAllRequestsByDate = await oneRequestApi.getAllRequestByDate({ shipmentDate })

            const idUserCustomer = getState().authStoreReducer.authID
            const { innNumber = '', kpp = '' } = getState().requisitesStoreReducer.storedValues
            const parseRequestWithDataToRoleStatus = parseRequestFromAPI({ idUser: idUserCustomer, innNumber, kpp })

            if (responseAllRequestsByDate.length > 0) {
                dispatch(requestStoreActions.setContentByDate(responseAllRequestsByDate.map(parseRequestWithDataToRoleStatus)))
            }

            // списко заявок, где пользователь является создателем заявки
            const responseAllRequestsByUser = await oneRequestApi.getAllRequestByUser({ idUserCustomer })
            if (responseAllRequestsByUser.length > 0) {
                dispatch(requestStoreActions.setContentByUser(responseAllRequestsByUser.map(parseRequestWithDataToRoleStatus)))
            }

        } catch (e: TtonErrorType) {
            dispatch(requestStoreActions.setIsFetching(false))
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// забрать данные одной СОЗДАННОЙ заявки от сервера
export const getOneRequestsAPI = ( requestNumber: number, giveMeDriver = false ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))

        const idUser = getState().authStoreReducer.authID
        const { innNumber = '', kpp = '' } = getState().requisitesStoreReducer.storedValues
        const parseRequestWithDataToRoleStatus = parseRequestFromAPI({ idUser, innNumber, kpp })

        try {
            const response = await oneRequestApi.getOneRequestById({ requestNumber })
            if (response.length > 0) {
                dispatch(requestStoreActions.setInitialValues(parseRequestWithDataToRoleStatus(response[0])))
                // подгружаем также водителя, для обновления координат
                if (giveMeDriver && response[0].idEmployee) {
                    await dispatch(getOneEmployeeFromAPI(response[0].idEmployee))
                }
            } else {
                dispatch(textAndActionGlobalModal({
                    text: [
                        'НЕ УДАЛОСЬ ЗАГРУЗИТЬ ЗАЯВКУ №' + requestNumber,
                        ( response.message ? 'Причина ' + response.message : '' ),
                    ],
                }))
            }
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
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
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// акцептировать текущую заявку и присвоить ей статус "в работе" ПРИ САМОВЫВОЗЕ
export const addAcceptedResponseToRequestOnCreate = (
    {
        addDriverValues,
        oneEmployee: employeeValues,
        oneTransport: transportValues,
        oneTrailer: trailerValues,
        idCustomer,
        cargoWeight,
    }
        : {
        addDriverValues: ResponseToRequestCardType<string>,
        oneEmployee: EmployeeCardType<string>
        oneTransport: TransportCardType<string>
        oneTrailer: TrailerCardType<string>
        idCustomer: string,
        cargoWeight: string,
    } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        const idUser = getState().authStoreReducer.authID
        const requestCarrierData = getState().requisitesStoreReducer.storedValues
        // данные из локальной карточки
        const customerCardPhone = getState().shippersStoreReducer.content
            .find(( { idSender } ) => idSender === idCustomer)?.shipperTel
        try {
            const response = await oneRequestApi.modifyOneRequest({
                requestNumber: addDriverValues.requestNumber,
                globalStatus: 'в работе',
                responseStavka: addDriverValues.responseStavka,
                responseTax: addDriverValues.responseTax,
                responsePrice: addDriverValues.responsePrice,
                cargoWeight,
                requestUserCarrierId: idUser,

                /* ПЕРЕВОЗЧИК */
                innNumberCarrier: requestCarrierData.innNumber,
                organizationNameCarrier: requestCarrierData.organizationName,
                taxModeCarrier: requestCarrierData.taxMode,
                kppCarrier: requestCarrierData.kpp,
                ogrnCarrier: requestCarrierData.ogrn,
                okpoCarrier: requestCarrierData.okpo,
                legalAddressCarrier: requestCarrierData.legalAddress,
                // сюда запишу номер телефона из карточки заказчика
                descriptionCarrier: customerCardPhone || requestCarrierData.description,
                postAddressCarrier: requestCarrierData.postAddress,
                phoneDirectorCarrier: requestCarrierData.phoneDirector,
                phoneAccountantCarrier: requestCarrierData.phoneAccountant,
                emailCarrier: requestCarrierData.email,
                bikBankCarrier: requestCarrierData.bikBank,
                nameBankCarrier: requestCarrierData.nameBank,
                checkingAccountCarrier: requestCarrierData.checkingAccount,
                korrAccountCarrier: requestCarrierData.korrAccount,
                mechanicFIOCarrier: requestCarrierData.mechanicFIO,
                dispatcherFIOCarrier: requestCarrierData.dispatcherFIO,
                /* СОТРУДНИК */
                idEmployee: employeeValues.idEmployee,
                responseEmployeeFIO: employeeValues.employeeFIO,
                responseEmployeePhoneNumber: employeeValues.employeePhoneNumber,
                responseEmployeepassportSerial: employeeValues.passportSerial,
                responseEmployeepassportFMS: employeeValues.passportFMS,
                responseEmployeepassportDate: employeeValues.passportDate as string,
                responseEmployeedrivingLicenseNumber: employeeValues.drivingLicenseNumber,
                responseEmployeePhotoFace: employeeValues.photoFace,
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
                responseTransportImage: transportValues.transportImage,
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
                responseTrailerImage: trailerValues.trailerImage,
            })

            if (response.success) {
                // добавляем Id пользователя к заявке (возможно это излишне)
                await oneRequestApi.addOneUserAcceptRequest({ requestNumber: addDriverValues.requestNumber, idUser })
                // применяем статус 'на заявке' водителю и удаляем все ответы на заявки
                await dispatch(modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest({
                    idEmployee: employeeValues.idEmployee,
                    addedToResponses: employeeValues.addedToResponse,
                    requestNumber: addDriverValues.requestNumber,
                }))
                // перезаливаем все заявки
                await dispatch(getAllRequestsAPI())
            }

        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }
    }

// акцептировать текущую заявку и присвоить ей статус "в работе" ПРИ ВЫБОРЕ ВОДИТЕЛЯ
export const addAcceptedResponseToRequestOnAcceptDriver = (
    {
        oneResponse,
        oneEmployee: employeeValues,
        oneTransport: transportValues,
        oneTrailer: trailerValues,
    }
        : {
        oneResponse: ResponseToRequestCardType<string>,
        oneEmployee: EmployeeCardType<string>
        oneTransport: TransportCardType<string>
        oneTrailer?: TrailerCardType<string>
    } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {

        try {
            // Загружаем данные пользователя, ответчика по заявке
            const requestCarrierDataFromApi = await requisitesApi.getPersonalDataFromId({ idUser: oneResponse.requestCarrierId })
            if (Array.isArray(requestCarrierDataFromApi)) {
                const requestCarrierData = requestCarrierDataFromApi[0]
                const response = await oneRequestApi.modifyOneRequest({
                    requestNumber: oneResponse.requestNumber,
                    globalStatus: 'в работе',
                    responseStavka: oneResponse.responseStavka,
                    responseTax: oneResponse.responseTax,
                    responsePrice: oneResponse.responsePrice,
                    requestUserCarrierId: oneResponse.requestCarrierId,
                    cargoWeight: oneResponse.cargoWeight,

                    /* ПЕРЕВОЗЧИК */
                    innNumberCarrier: requestCarrierData?.nnNumber || 'null',
                    organizationNameCarrier: requestCarrierData?.organizationName || 'null',
                    taxModeCarrier: requestCarrierData?.taxMode || 'null',
                    kppCarrier: requestCarrierData?.kpp || 'null',
                    ogrnCarrier: requestCarrierData?.ogrn || 'null',
                    okpoCarrier: requestCarrierData?.okpo || 'null',
                    legalAddressCarrier: requestCarrierData?.legalAddress || 'null',
                    // сюда запишу номер телефона из карточки заказчика
                    descriptionCarrier: requestCarrierData?.description || 'null',
                    postAddressCarrier: requestCarrierData?.postAddress || 'null',
                    phoneDirectorCarrier: requestCarrierData?.phoneDirector || 'null',
                    phoneAccountantCarrier: requestCarrierData?.phoneAccountant || 'null',
                    emailCarrier: requestCarrierData?.email || 'null',
                    bikBankCarrier: requestCarrierData?.bikBank || 'null',
                    nameBankCarrier: requestCarrierData?.nameBank || 'null',
                    checkingAccountCarrier: requestCarrierData?.checkingAccount || 'null',
                    korrAccountCarrier: requestCarrierData?.korrAccount || 'null',
                    mechanicFIOCarrier: requestCarrierData?.mechanicFIO || 'null',
                    dispatcherFIOCarrier: requestCarrierData?.dispatcherFIO || 'null',
                    /* СОТРУДНИК */
                    idEmployee: employeeValues.idEmployee,
                    responseEmployeeFIO: employeeValues.employeeFIO,
                    responseEmployeePhoneNumber: employeeValues.employeePhoneNumber,
                    responseEmployeepassportSerial: employeeValues.passportSerial,
                    responseEmployeepassportFMS: employeeValues.passportFMS,
                    responseEmployeepassportDate: employeeValues.passportDate as string,
                    responseEmployeedrivingLicenseNumber: employeeValues.drivingLicenseNumber,
                    responseEmployeePhotoFace: employeeValues.photoFace,
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
                    responseTransportImage: transportValues.transportImage,
                    /* ПРИЦЕП */
                    idTrailer: trailerValues?.idTrailer || 'null',
                    responseTrailertrailerNumber: trailerValues?.trailerNumber || 'null',
                    responseTrailerTrademark: trailerValues?.trailerTrademark || 'null',
                    responseTrailerModel: trailerValues?.trailerModel || 'null',
                    responseTrailerPts: trailerValues?.pts || 'null',
                    responseTrailerDopog: trailerValues?.dopog || 'null',
                    responseTrailerCargoType: trailerValues?.cargoType,
                    responseTrailerCargoWeight: trailerValues?.cargoWeight || 'null',
                    responseTrailerPropertyRights: trailerValues?.propertyRights,
                    responseTrailerImage: trailerValues?.trailerImage,
                })
                if (response.success) {
                    await oneRequestApi.addOneUserAcceptRequest({
                        requestNumber: oneResponse.requestNumber,
                        idUser: oneResponse.requestCarrierId,
                    })
                    // применяем статус 'на заявке' для водителя
                    await dispatch(modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest({
                        idEmployee: employeeValues.idEmployee,
                        addedToResponses: employeeValues.addedToResponse,
                        requestNumber: oneResponse.requestNumber,
                    }))
                    // перезаливаем все заявки
                    await dispatch(getAllRequestsAPI())
                }
            }


        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }
    }

// изменить текущую заявку ПРИ СОЗДАНИИ
export const changeCurrentRequestOnCreate = ( submitValues: OneRequestType ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setIsFetching(true))
        try {
            const userId = getState().authStoreReducer.authID
            // данные из локальной карточки
            const customerCard = getState().shippersStoreReducer.content
                .find(( { idSender } ) => idSender === submitValues.idCustomer)
            // механика выяснения какому пользователю какой инн
            await dispatch(getListOrganizationRequisitesByInn([
                customerCard?.innNumber,
                submitValues.sender.innNumber,
                submitValues.recipient.innNumber,
            ].filter(x => x).join(',')))
            const filteredContent = await getState().requisitesStoreReducer.filteredContent
            // подгрузка данных созданных пользователей
            const userCustomer = filteredContent?.find(( { innNumber } ) => innNumber === customerCard?.innNumber)
            const userSender = filteredContent?.find(( { innNumber } ) => innNumber === submitValues.sender.innNumber)
            const userRecipient = filteredContent?.find(( { innNumber } ) => innNumber === submitValues.recipient.innNumber)
            const acceptedUsers = [ userCustomer?.idUser || userId, userSender?.idUser, userRecipient?.idUser ].filter(x => x).join(', ')
            // делим длинный polyline на две части (ограничения на сервере на 70000 символов
            const route = submitValues?.route?.substring(0, 69999)
            const routePlus = submitValues?.route?.substring(69999) || 'null'
            const requestNumber = submitValues.requestNumber?.toString() || '0'
            const placeholder = 'null'

            const response = await oneRequestApi.modifyOneRequest({
                    requestNumber,
                    globalStatus: 'новая заявка',
                    acceptedUsers,
                    cargoComposition: submitValues.cargoComposition,
                    shipmentDate: yearMmDdFormatISO(submitValues.shipmentDate),
                    cargoType: submitValues.cargoType,
                    distance: submitValues.distance?.toString(),
                    route,
                    routePlus,
                    note: submitValues.note,
                    cargoStamps: submitValues.cargoStamps,
                    /* ЗАКАЗЧИК - ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (ЕСЛИ ЕСТЬ) */
                    idCustomer: submitValues.idCustomer,
                    idUserCustomer: userCustomer?.idUser || userId,
                    innNumberCustomer: userCustomer?.innNumber || customerCard?.innNumber,
                    organizationNameCustomer: userCustomer?.organizationName || customerCard?.organizationName,
                    taxModeCustomer: userCustomer?.taxMode,
                    kppCustomer: userCustomer?.kpp || customerCard?.kpp,
                    ogrnCustomer: userCustomer?.ogrn || customerCard?.ogrn,
                    okpoCustomer: userCustomer?.okpo,
                    legalAddressCustomer: userCustomer?.legalAddress || customerCard?.address,
                    descriptionCustomer: customerCard?.shipperTel || customerCard?.description,
                    postAddressCustomer: userCustomer?.postAddress || customerCard?.address,
                    phoneDirectorCustomer: userCustomer?.phoneDirector,
                    phoneAccountantCustomer: userCustomer?.phoneAccountant,
                    emailCustomer: userCustomer?.email,
                    bikBankCustomer: userCustomer?.bikBank,
                    nameBankCustomer: userCustomer?.nameBank,
                    checkingAccountCustomer: userCustomer?.checkingAccount,
                    korrAccountCustomer: userCustomer?.korrAccount,
                    mechanicFIOCustomer: userCustomer?.mechanicFIO,
                    dispatcherFIOCustomer: userCustomer?.dispatcherFIO,
                    /* ГРУЗООТПРАВИТЕЛЬ - КАРТОЧКА */
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
                    /* ГРУЗООТПРАВИТЕЛЬ - ДАННЫЕ ПОЛЬЗОВАТЕЛЯ */
                    idUserSender: userSender?.idUser,
                    taxModeSender: userSender?.taxMode,
                    okpoSender: userSender?.okpo,
                    legalAddressSender: userSender?.legalAddress,
                    postAddressSender: userSender?.postAddress,
                    phoneDirectorSender: userSender?.phoneDirector,
                    phoneAccountantSender: userSender?.phoneAccountant,
                    emailSender: userSender?.email,
                    bikBankSender: userSender?.bikBank,
                    nameBankSender: userSender?.nameBank,
                    checkingAccountSender: userSender?.checkingAccount,
                    korrAccountSender: userSender?.korrAccount,
                    mechanicFIOSender: userSender?.mechanicFIO,
                    dispatcherFIOSender: userSender?.dispatcherFIO,
                    /* ГРУЗОПОЛУЧАТЕЛЬ - КАРТОЧКА */
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
                    /* ГРУЗОПОЛУЧАТЕЛЬ - ДАННЫЕ ПОЛЬЗОВАТЕЛЯ */
                    idUserRecipient: userRecipient?.idUser,
                    taxModeRecipient: userRecipient?.taxMode,
                    okpoRecipient: userRecipient?.okpo,
                    legalAddressRecipient: userRecipient?.legalAddress,
                    postAddressRecipient: userRecipient?.postAddress,
                    phoneDirectorRecipient: userRecipient?.phoneDirector,
                    phoneAccountantRecipient: userRecipient?.phoneAccountant,
                    emailRecipient: userRecipient?.email,
                    bikBankRecipient: userRecipient?.bikBank,
                    nameBankRecipient: userRecipient?.nameBank,
                    checkingAccountRecipient: userRecipient?.checkingAccount,
                    korrAccountRecipient: userRecipient?.korrAccount,
                    mechanicFIORecipient: userRecipient?.mechanicFIO,
                    dispatcherFIORecipient: userRecipient?.dispatcherFIO,
                },
            )
            if (response.success) {
                await dispatch(getAllRequestsAPI())
            }
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }
        dispatch(requestStoreActions.setIsFetching(false))
    }

// внести незначительные изменения в заявку (без обновления подгрузки заявки)
export const changeSomeValuesOnCurrentRequest = ( values: Partial<OneRequestApiType> & { requestNumber: string } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.modifyOneRequest(values)
            if (response.success) {
                console.log(response.success)
            }
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e?.response?.data?.message),
            }))
        }
    }

// скорректировать вес груза и пересчитать стоимость
export const changeCargoWeightValuesOnCurrentRequestAndActivateDocs = ( {
                                                                            cargoWeight,
                                                                            addedPrice,
                                                                        }: { cargoWeight: number, addedPrice: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const { requestNumber } = getState().requestStoreReducer.initialValues
        await dispatch(changeSomeValuesOnCurrentRequest({
            requestNumber: requestNumber + '',
            cargoWeight: cargoWeight + '',
            uploadTime: yearMmDdFormatISO(new Date()),
            addedPrice,
            localStatuscargoHasBeenTransferred: true,
        }))
        await dispatch(createDriverListApi({ requestNumber }))
        await dispatch(getOneRequestsAPI(requestNumber))
    }

// создать ДОВЕРЕННОСТЬ НА ВОДИТЕЛЯ
export const createDriverListApi = ( props: { requestNumber: number, validUntil?: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await requestDocumentsApi.createDriverList(props)
            console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: '<b>Ошибка создания документа ДОВЕРЕННОСТЬ ВОДИТЕЛЮ: </b><br/>' + JSON.stringify(e?.response?.data?.message),
            }))
        }
    }

// по событию "груз у получателя"
export const cargoHasBeenRecievedOnCurrentRequest = ( requestNumber: string ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        await dispatch(changeSomeValuesOnCurrentRequest({
            requestNumber,
            localStatuscargoHasBeenReceived: true,
            unloadTime: yearMmDdFormatISO(new Date()),
        }))
        await dispatch(getOneRequestsAPI(toNumber(requestNumber)))
    }

// удаляем заявку по её номеру
export const deleteCurrentRequestAPI = ( requestNumber: { requestNumber: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.deleteOneRequest(requestNumber)
            console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e?.response?.data?.message),
            }))
        }
        await dispatch(getAllRequestsAPI())
    }


// загрузка километража и прорисовка пути в карту
export const getRouteFromAPI = ( {
                                     oneShipper,
                                     oneConsignee,
                                 }: { oneShipper: ShippersCardType, oneConsignee: ConsigneesCardType } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(requestStoreActions.setCurrentDistanceIsFetching(true))
        const initialValues = getState().requestStoreReducer.initialValues
        const distanceCoefficient = getState().baseStoreReducer.distanceCoefficient
        try {
            // отправляем запрос на маршрут
            const response = await getRouteFromAvtodispetcherApi({
                from: oneShipper.coordinates || '',
                to: oneConsignee.coordinates || '',
            })

            // конвертируем дистанцию с учетом коэффициэнта и округляем до целого
            const distance = +( +response.kilometers * distanceCoefficient ).toFixed(0)

            // максимальное количество символов, которые мы можем у себя сохранить
            if (response.polyline) {
                if (response.polyline.length > 139990) {
                    // уходим в ошибку
                    throw new Error(`Слишком длинный маршрут (${ distance }км), выберите другого грузоотправителя или грузополучателя`)
                }
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

        } catch (e: TtonErrorType) {
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
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e),
            }))
        }

        dispatch(requestStoreActions.setCurrentDistanceIsFetching(false))
    }

// деньги за заявку получены
export const paymentHasBeenRecievedToRequest = ( requestNumber: number ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await oneRequestApi.modifyOneRequest({
                requestNumber: requestNumber + '',
                localStatuspaymentHasBeenReceived: true,
            })
            console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e?.response?.data?.message || e?.response?.data),
            }))
        }
        await dispatch(getOneRequestsAPI(toNumber(requestNumber)))
    }


///////////////////////////РАБОТА С ДОКУМЕНТАМИ//////////////////////////////////////////////

// подгрузка дополнительного документа
export const addRewriteCargoDocumentRequestAPI = ( props: { requestNumber: number, cargoDocuments: File } ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await requestDocumentsApi.getLoadCargo(props)
            console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: JSON.stringify(e?.response?.data?.message || e?.response?.data),
            }))
        }
        await dispatch(getOneRequestsAPI(props.requestNumber))
    }

// закрываем заявку и "освобождаем" водителя
export const closeRequestAndUpdateDriverStatus = ( {
                                                       requestNumber,
                                                       idEmployee,
                                                       employeeOnNextRequest,
                                                       employeeAddedToResponse,
                                                   }: {
    requestNumber: string, idEmployee: string, employeeOnNextRequest: string, employeeAddedToResponse: string
} ): RequestStoreReducerThunkActionType =>
    async ( dispatch ) => {
        await dispatch(changeSomeValuesOnCurrentRequest({
            requestNumber,
            globalStatus: 'завершена',
        }))

        const onNextRequest = toNumber(employeeOnNextRequest)
        await dispatch(modifyOneEmployeeSoftToAPI({
            idEmployee,
            status: !!onNextRequest ? 'на заявке' : !!employeeAddedToResponse ? 'ожидает принятия' : 'свободен',
            onCurrentRequest: !!onNextRequest ? onNextRequest + '' : 'null',
            onNextRequest: 'null',
        }))

    }
// пометка заявки как удалённой и отвязка всех водителей и т.п.
export const cancelRequestOnDeleteButton = ( { requestNumber }: { requestNumber: number } ): RequestStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        try {
            const response = await oneRequestApi.getOneRequestById({ requestNumber })

            if (response.length > 0) {
                const { idEmployee, answers } = response[0]
                // если привязан водитель, то отвязываем его по всем правилам
                if (idEmployee) {
                    const employee = await employeesApi.getOneOrMoreEmployeeById({ idEmployee })
                    if (employee.length) {
                        const { onNextRequest = 0, addedToResponse } = employee[0]
                        await dispatch(modifyOneEmployeeSoftToAPI({
                            idEmployee,
                            status: !!onNextRequest ? 'на заявке' : !!addedToResponse ? 'ожидает принятия' : 'свободен',
                            onCurrentRequest: !!onNextRequest ? onNextRequest + '' : 'null',
                            onNextRequest: 'null',
                        }))
                    }
                }
                // если есть ответы на заявку, то удаляем ответы
                if (!!answers?.split(', ')?.length) {
                    await responseToRequestApi.deleteSomeResponseToRequest({ responseId: answers })
                }
                // и при любых вариантах, меняем статус заявки на 'отменена'
                await dispatch(changeSomeValuesOnCurrentRequest({
                    requestNumber: requestNumber + '',
                    globalStatus: 'отменена',
                    // toDo: задать бэку запрос на "удаление" через команду
                    isCanceledDate: yearMmDdFormatISO(new Date()),
                    isCanceledReason: 'Удалена по причине отсутствия причин'
                }))

            }
        } catch (e: TtonErrorType) {
            dispatch(textAndActionGlobalModal({
                text: [ 'Не удалось удалить заявку.',
                    boldWrapper('Причина: ') +
                    JSON.stringify(e?.response?.data?.message || e?.response?.data),
                ],
            }))
        }
        // после удаления(т.е. изменения статуса на "отменена") прогружаем список заново
        await dispatch(getAllRequestsAPI())
    }
