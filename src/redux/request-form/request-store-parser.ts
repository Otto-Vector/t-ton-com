import {
    CargoTypeType,
    CompanyRequisitesApiType,
    CompanyRequisitesType,
    EmployeeCardType,
    OneRequestApiToApiType,
    OneRequestApiType,
    OneRequestType,
    ResponseToRequestCardType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
} from '../../types/form-types'
import {apiToISODateFormat, yearMmDdFormatISO} from '../../utils/date-formats'
import {toNumber} from '../../utils/parsers'

const placeholderNull = 'null'

// адаптируем заявку от сервера в локальную модель данных
export const parseRequestFromAPI = ( {
                                         idUser,
                                         innNumber,
                                         kpp,
                                     }: { idUser: string, innNumber: string, kpp: string } ) => ( elem: OneRequestApiType ): OneRequestType => ( {
    requestNumber: toNumber(elem.requestNumber),
    requestDate: elem.requestDate ? new Date(apiToISODateFormat(elem.requestDate)) : undefined,
    cargoComposition: elem.cargoComposition,
    shipmentDate: elem.shipmentDate ? new Date(elem.shipmentDate) : undefined,
    cargoType: elem.cargoType as CargoTypeType,
    addedPrice: elem.addedPrice,

    distance: toNumber(elem.distance),
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

    /* МАРКЕРЫ ВРЕМЕНИ */
    isClosedDate: elem.isClosedDate,
    successPaymentDate: elem.successPaymentDate,
    paymentDate: elem.paymentDate,

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

// заполнение данных в заявку при акцептировании водителя в ответе на заявку
export const parseRequestToAPIonAccept = ( {
                                               addDriverValues,
                                               cargoWeight,
                                               requestUserCarrierId,
                                               requestCarrierData,
                                               requestCarrierDataFromApi,
                                               employeeValues,
                                               transportValues,
                                               trailerValues,
                                               customerCardPhone,
                                           }: {
    addDriverValues: ResponseToRequestCardType<string>,
    employeeValues: EmployeeCardType<string>
    transportValues: TransportCardType<string>
    trailerValues?: TrailerCardType<string>
    requestCarrierData?: CompanyRequisitesType,
    requestCarrierDataFromApi?: CompanyRequisitesApiType,
    cargoWeight: string,
    requestUserCarrierId: string,
    customerCardPhone?: string,
} ): OneRequestApiToApiType => ( {
    requestNumber: addDriverValues.requestNumber,
    globalStatus: 'в работе',
    responseStavka: addDriverValues.responseStavka,
    responseTax: addDriverValues.responseTax,
    responsePrice: addDriverValues.responsePrice,
    cargoWeight,
    requestUserCarrierId,

    /* ПЕРЕВОЗЧИК */
    innNumberCarrier: requestCarrierData?.innNumber || requestCarrierDataFromApi?.nnNumber || placeholderNull,
    organizationNameCarrier: requestCarrierData?.organizationName || requestCarrierDataFromApi?.organizationName || placeholderNull,
    taxModeCarrier: requestCarrierData?.taxMode || requestCarrierDataFromApi?.taxMode || placeholderNull,
    kppCarrier: requestCarrierData?.kpp || requestCarrierDataFromApi?.kpp || placeholderNull,
    ogrnCarrier: requestCarrierData?.ogrn || requestCarrierDataFromApi?.ogrn || placeholderNull,
    okpoCarrier: requestCarrierData?.okpo || requestCarrierDataFromApi?.okpo || placeholderNull,
    legalAddressCarrier: requestCarrierData?.legalAddress || requestCarrierDataFromApi?.legalAddress || placeholderNull,
    // сюда запишу номер телефона из карточки заказчика
    descriptionCarrier: customerCardPhone || requestCarrierData?.description || requestCarrierDataFromApi?.description || placeholderNull,
    postAddressCarrier: requestCarrierData?.postAddress || requestCarrierDataFromApi?.postAddress || placeholderNull,
    phoneDirectorCarrier: requestCarrierData?.phoneDirector || requestCarrierDataFromApi?.phoneDirector || placeholderNull,
    phoneAccountantCarrier: requestCarrierData?.phoneAccountant || requestCarrierDataFromApi?.phoneAccountant || placeholderNull,
    emailCarrier: requestCarrierData?.email || requestCarrierDataFromApi?.email || placeholderNull,
    bikBankCarrier: requestCarrierData?.bikBank || requestCarrierDataFromApi?.bikBank || placeholderNull,
    nameBankCarrier: requestCarrierData?.nameBank || requestCarrierDataFromApi?.nameBank || placeholderNull,
    checkingAccountCarrier: requestCarrierData?.checkingAccount || requestCarrierDataFromApi?.checkingAccount || placeholderNull,
    korrAccountCarrier: requestCarrierData?.korrAccount || requestCarrierDataFromApi?.korrAccount || placeholderNull,
    mechanicFIOCarrier: requestCarrierData?.mechanicFIO || requestCarrierDataFromApi?.mechanicFIO || placeholderNull,
    dispatcherFIOCarrier: requestCarrierData?.dispatcherFIO || requestCarrierDataFromApi?.dispatcherFIO || placeholderNull,
    /* СОТРУДНИК */
    idEmployee: employeeValues.idEmployee,
    responseEmployeeFIO: employeeValues.employeeFIO,
    responseEmployeePhoneNumber: employeeValues.employeePhoneNumber,
    responseEmployeepassportSerial: employeeValues.passportSerial,
    responseEmployeepassportFMS: employeeValues.passportFMS,
    responseEmployeepassportDate: employeeValues.passportDate as string,
    responseEmployeedrivingLicenseNumber: employeeValues.drivingLicenseNumber,
    responseEmployeePhotoFace: employeeValues.photoFace || placeholderNull,
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
    responseTransportImage: transportValues.transportImage || placeholderNull,
    /* ПРИЦЕП */
    idTrailer: trailerValues?.idTrailer || placeholderNull,
    responseTrailertrailerNumber: trailerValues?.trailerNumber || placeholderNull,
    responseTrailerTrademark: trailerValues?.trailerTrademark || placeholderNull,
    responseTrailerModel: trailerValues?.trailerModel || placeholderNull,
    responseTrailerPts: trailerValues?.pts || placeholderNull,
    responseTrailerDopog: trailerValues?.dopog || placeholderNull,
    responseTrailerCargoType: trailerValues?.cargoType,
    responseTrailerCargoWeight: trailerValues?.cargoWeight || placeholderNull,
    responseTrailerPropertyRights: trailerValues?.propertyRights,
    responseTrailerImage: trailerValues?.trailerImage || placeholderNull,
} )

// раскладка данных заявки при создании
export const parseRequestToApiOnCreate = ( { userId, oneRequestValues, filteredContent, customerCard }: {
    userId: string
    oneRequestValues: OneRequestType
    customerCard?: ShippersCardType
    filteredContent: Partial<CompanyRequisitesType>[] | null
} ): OneRequestApiToApiType => {
    const requestNumber = oneRequestValues.requestNumber?.toString() || '0'
    // делим длинный polyline на две части (ограничения на сервере на 70000 символов
    const route = oneRequestValues?.route?.substring(0, 69999)
    const routePlus = oneRequestValues?.route?.substring(69999) || placeholderNull

    const userCustomer = filteredContent?.find(
        ( { innNumber, kpp } ) => innNumber === customerCard?.innNumber && kpp === customerCard?.kpp,
    )
    const idUserCustomer = userCustomer?.idUser || userId
    const userSender = filteredContent?.find(
        ( { innNumber, kpp } ) => innNumber === oneRequestValues?.sender?.innNumber && kpp === oneRequestValues?.sender?.kpp,
    )
    const userRecipient = filteredContent?.find(
        ( {
              innNumber,
              kpp,
          } ) => innNumber === oneRequestValues.recipient.innNumber && kpp === oneRequestValues?.recipient?.kpp,
    )
    const acceptedUsers = [ idUserCustomer, userSender?.idUser, userRecipient?.idUser ].filter(x => x).join(', ')

    return {
        requestNumber,
        globalStatus: 'новая заявка',
        acceptedUsers,
        cargoComposition: oneRequestValues.cargoComposition,
        shipmentDate: yearMmDdFormatISO(oneRequestValues.shipmentDate),
        cargoType: oneRequestValues.cargoType,
        distance: oneRequestValues.distance?.toString(),
        route,
        routePlus,
        note: oneRequestValues.note,
        cargoStamps: oneRequestValues.cargoStamps,
        /* ЗАКАЗЧИК - ДАННЫЕ ПОЛЬЗОВАТЕЛЯ (ЕСЛИ ЕСТЬ) */
        idCustomer: oneRequestValues.idCustomer,
        idUserCustomer,
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
        idSender: oneRequestValues.idSender,
        titleSender: oneRequestValues.sender.title,
        innNumberSender: oneRequestValues.sender.innNumber,
        organizationNameSender: oneRequestValues.sender.organizationName,
        kppSender: oneRequestValues.sender.kpp,
        ogrnSender: oneRequestValues.sender.ogrn,
        addressSender: oneRequestValues.sender.address,
        shipperFioSender: oneRequestValues.sender.shipperFio,
        shipperTelSender: oneRequestValues.sender.shipperTel,
        descriptionSender: oneRequestValues.sender.description,
        coordinatesSender: oneRequestValues.sender.coordinates,
        citySender: oneRequestValues.sender.city,
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
        idRecipient: oneRequestValues.idRecipient,
        titleRecipient: oneRequestValues.recipient.title,
        innNumberRecipient: oneRequestValues.recipient.innNumber,
        organizationNameRecipient: oneRequestValues.recipient.organizationName,
        kppRecipient: oneRequestValues.recipient.kpp,
        ogrnRecipient: oneRequestValues.recipient.ogrn,
        addressRecipient: oneRequestValues.recipient.address,
        consigneesFioRecipient: oneRequestValues.recipient.consigneesFio,
        consigneesTelRecipient: oneRequestValues.recipient.consigneesTel,
        descriptionRecipient: oneRequestValues.recipient.description || placeholderNull,
        coordinatesRecipient: oneRequestValues.recipient.coordinates,
        cityRecipient: oneRequestValues.recipient.city,
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
    }
}
