// на валидаторы для форм
export type ValidateType = undefined | ( ( val: string ) => string | undefined )
export type ParserType = undefined | ( ( val: string | undefined ) => string )

// на поля для форм
type DefaultFormType = string | undefined

// на установочные данные
export type PreAuthGlobalDataType = {
    /* ЗНАЧИМЫЕ НА БЭКЕ */
    // максимальное количество активных заявок пользователя
    maxRequests: number
    // тариф на создание заявки
    tarifCreate: number
    // тариф на принятие заявки на короткие расстояния
    tarifAcceptShortRoute: number
    // тариф на принятие заявки на Дальние расстояния
    tarifAcceptLongRoute: number
    // процент на безопасную сделку
    tarifPaySafeTax: number

    /* КЛЮЧЕВЫЕ */
    // ключ на апи авторизации
    telPhoneKey: string
    // ключ яндекса
    yandex: string
    // ключ dadata
    dadata: string
    // ключ автодиспетчера
    autodispetcher: string

    /* ИНФОРМАЦИОННЫЕ */
    // телефон на главном экране
    globalPhone: string
    // ссылки на сторонние ресурсы справа экрана
    linkDomainOne: string
    linkTitleTwo: string
    linkDomainTwo: string
    linkTitleThree: string
    linkDomainThree: string
    linkTitleFour: string
    linkDomainFour: string
    linkTitleFive: string
    linkDomainFive: string
    linkTitleSix: string
    linkDomainSix: string
    linkTitleSeven: string
    linkDomainSeven: string
    linkTitleEight: string
    linkDomainEight: string
    linkTitleNine: string
    linkDomainNine: string
    linkTitleTen: string
    linkDomainTen: string
    linkTitleOne: string

    /* ПОДНАСТРОЕЧНЫЕ */
    // ссылка на офер
    linkToOfer: string
    // путь до сервера
    serverURL: string,
    // путь до стандартной страницы
    baseURL: string,
    // форматы грузов
    cargoFormats: string,
    // форматы прав на собственность
    propertyRights: string,
    // процент, на который надо помножить
    distanceCoefficient: number,
}

// на форму авторизации
export type PhoneSubmitType<T = DefaultFormType> = {
    innNumber: T
    phoneNumber: T
    kppNumber: T
    sms: T
}
///////////////////////////////////////////////////////////
// на форму с реквизитами
export type CompanyRequisitesType<T = DefaultFormType> = {
    idUser: T
    // ИНН
    innNumber: T
    // Наименование организации
    organizationName: T
    // Вид налогов
    taxMode: T
    // КПП
    kpp: T
    // ОГРН
    ogrn: T
    // OKПО
    okpo: T
    // Юридический адрес
    legalAddress: T
    // доп. информация
    description: T

    // почтовый адрес
    postAddress: T
    // телефон директора
    phoneDirector: T
    // телефон бухгалтера
    phoneAccountant: T
    // электронная почта
    email: T
    // БИК Банка
    bikBank: T
    // Наименование Банка
    nameBank: T
    // Расчётный счёт
    checkingAccount: T
    // Корреспондентский счёт
    korrAccount: T

    // ФИО механика
    mechanicFIO: T
    // ФИО диспетчера
    dispatcherFIO: T

    // количество денег на счету
    cash?: number
    // количество активных заявок
    requestActiveCount: T
    // максимальное количество заявок (редактируется админом)
    maxRequests: T

    // тарифы на оплату (отображаются в инфо-секции, используются везде, редактируются админом)
    tariffs: {
        // тариф на создание заявки (по умолчанию 100)
        create?: number,
        // тариф на принятие заявки на короткие расстояния (по умолчанию 100)
        acceptShortRoute?: number,
        // тариф на принятие заявки на Дальние расстояния (по умолчанию 100)
        acceptLongRoute?: number,
        // процент на безопасную сделку (по умолчанию 3) (будем прикручивать в будущем)
        paySafeTax?: number,
    },
}
// на форму с реквизитами - возврат с бэка
export type CompanyRequisitesApiType = {
    idUser: string
    // innNumber: string
    nnNumber: string
    organizationName: string
    taxMode: string
    kpp?: string
    ogrn: string
    okpo: string
    legalAddress: string
    description: string
    postAddress: string
    phoneDirector: string
    phoneAccountant: string
    email: string
    bikBank: string
    nameBank: string
    checkingAccount: string
    korrAccount: string
    is_staff: boolean,
    is_active: boolean,
    phone: string
    phoneCode: string
    phoneValidate: boolean,
    password: string
    role: string
    cash: number,
    requestActiveCount: string
    maxRequests: string
    tarifCreate: number
    tarifAcceptShortRoute: number
    tarifAcceptLongRoute: number
    tarifPaySafeTax: number
    mechanicFIO?: string
    dispatcherFIO?: string
}
///////////////////////////////////////////////////////////
export type EmployeeStatusType = 'на заявке' | 'свободен' | 'ожидает принятия' | 'в отпуске' | 'уволен'
// на сотрудника
export type EmployeeCardType<T = DefaultFormType> = {
    idUser: T
    // идентификатор
    idEmployee: string
    // ФИО сотрудника
    employeeFIO: T
    // Телефон сотрудника
    employeePhoneNumber: T
    // Серия, № паспорта
    passportSerial: T
    // Кем выдан паспорт
    passportFMS: T
    // Когда выдан
    passportDate: T
    // Номер водительского удостоверения
    drivingLicenseNumber: T
    // Водительские категории
    drivingCategory: T
    // Табельный номер
    personnelNumber: T
    // Гаражный номер
    garageNumber: T
    // Добавить фотографию сотрудника
    photoFace: T
    // Рэйтинг (рудимент) Integer
    rating: T
    // координаты местоположения водителя
    coordinates: T
    // статус водителя
    status: EmployeeStatusType
    // прикреплённый транспорт
    idTransport: T
    // прикреплённый прицеп
    idTrailer: T
    // список ответок, к которым привязан водитель
    addedToResponse: T
    // номер активной заявки, на которой сейчас данный водитель
    onCurrentRequest: T
    // номер следующей активной заявки, на которой акцептирован данный водитель (пока он заканчивает с предыдущей)
    onNextRequest: T
}
// на сотрудника - ответка из бэка
export type EmployeesApiType = EmployeeCardType<string>
///////////////////////////////////////////////////////////
// на грузоПОЛУЧАТЕЛЯ
export type ConsigneesCardType<T = DefaultFormType> = {
    idUser: T
    // идентификатор
    idRecipient: string
    // укороченное название
    title: T
    // ИНН
    innNumber: T
    // Наименование организации
    organizationName: T
    // КПП
    kpp: T
    // ОГРН
    ogrn: T
    // Юридический адрес
    address: T
    // ФИО получателя
    consigneesFio: T
    // Телефон получателя
    consigneesTel: T
    // Доп. данные для ТТН
    description: T
    // Местоположение в координатах
    coordinates: T
    // присваивается автоматически
    city: T
}
// на грузоПОЛУЧАТЕЛЯ - ответка из бэка
export type ConsigneesApiType = ConsigneesCardType<string>

// на грузоотправителя
export type ShippersCardType<T = DefaultFormType> = {
    idUser: T
    // идентификатор
    idSender: string
    // укороченное название
    title: T
    // ИНН
    innNumber: T
    // Наименование организации
    organizationName: T
    // КПП
    kpp: T
    // ОГРН
    ogrn: T
    // Юридический адрес
    address: T
    // ФИО отправителя
    shipperFio: T
    // Телефон отправителя
    shipperTel: T
    // Доп. данные для ТТН
    description: T
    // Местоположение в координатах
    coordinates: T
    // город (присваивается автоматически)
    city: T
}
// на грузоотправителя - ответка из бэка
export type ShippersApiType = ShippersCardType<string>

/////////////////////////////////////////////////////////////////////////////
export const cargoConstType = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ] as const
export type CargoTypeType = typeof cargoConstType[number]

export const propertyRights = [ 'Собственность', 'Cовместная собственность супругов', 'Аренда', 'Лизинг', 'Безвозмездное пользование' ] as const
export type PropertyRightsType = typeof propertyRights[number]

// статусы самой заявки
export type RequestGlobalStatusType = 'новая заявка' | 'в работе' | 'завершена' | 'отменена'

// типы относительности пользователя к заявке
export type RoleModesType = {
    // заказчик
    isCustomer: boolean
    // грузоотправитель
    isSender: boolean
    // получатель
    isRecipient: boolean
    // перевозчик
    isCarrier: boolean
}
// на транспорт
export type TransportCardType<T = DefaultFormType> = {
    idUser: T
    // идентификатор
    idTransport: string
    // Гос. номер авто
    transportNumber: T
    // Марка авто
    transportTrademark: T
    // Модель авто
    transportModel: T
    // ПТС
    pts: T
    // ДОПОГ
    dopog: T
    // Тип груза
    cargoType?: CargoTypeType
    // Вес груза
    cargoWeight: T
    // Право собственности
    propertyRights?: PropertyRightsType
    // Фото транспорта
    transportImage: T
}
// на транспорт - ответка из бэка
export type TransportApiType = TransportCardType<string>

// на прицеп
export type TrailerCardType<T = DefaultFormType> = {
    idUser: T
    // идентификатор
    idTrailer: string
    // Гос. номер авто
    trailerNumber: T
    // Марка трейлера
    trailerTrademark: T
    // Модель трейлера
    trailerModel: T
    // ПТС трейлера
    pts: T
    // ДОПОГ трейлера
    dopog: T
    // Тип груза трейлера
    cargoType?: CargoTypeType
    // Вес груза трейлера
    cargoWeight: T
    // Право собственности трейлера
    propertyRights?: PropertyRightsType
    // Фото трейлера
    trailerImage: T
}

export type TrailerApiType = TrailerCardType<string>

// на добавление отклика на заявку
export type ResponseToRequestCardType<T = DefaultFormType> = {
    // уникальный id отклика на заявку
    responseId: T,
    // номер заявки, к которой привязана форма
    requestNumber: T,
    // привязывается id пользователя при создании отклика
    requestCarrierId: T,

    // id водителя (из карточки водителя)
    idEmployee: T,
    // id транспорта (из карточки транспорт / изначальное значение из карточки водителя)
    idTransport: T,
    // id прицепа (из карточки прицеп / изначальное значение из карточки водителя)
    idTrailer: T,

    // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика)
    cargoWeight: T,

    // тариф ставки перевозки 1 тонны на 1 км
    responseStavka: T,
    // подсчитанная сумма (считается на фронте)
    responsePrice: T,
    // система налогообложения (ОСН, УСН, ЕСХН, ПСН, НПД и т.д.)
    responseTax: T,
}


//////////////////////////// ЗАЯВКА ///////////////////////////////////////////////////////////////////
export type OneRequestType = {
    /* эти два поля создаются автоматически на бэке при запросе на создание,
    далее заявка ТОЛЬКО редактируется или УДАЛЯЕТСЯ */

    // уникальный номер заявки (числовой номер/каждая новая заявка создаётся с номером+1 от предыдущей на бэке)
    requestNumber: number
    // дата создания заявки
    requestDate?: Date

    // вид груза
    cargoComposition?: string
    // дата погрузки
    shipmentDate?: Date
    // тип груза (заведомо известный набор типов)
    cargoType?: CargoTypeType

    // заказчик
    idCustomer?: string
    // id пользователя заказчика
    idUserCustomer?: string
    // данные пользователя заказчика
    customerUser?: Partial<CompanyRequisitesType>

    // грузоотправитель
    idSender?: string
    // id пользователя отправителя
    idUserSender?: string
    // данные грузополучателя из карточки
    sender: ShippersCardType,
    // данные пользователя грузоотправителя
    senderUser?: Partial<CompanyRequisitesType>

    // грузополучатель
    idRecipient?: string
    // id пользователя грузополучателя
    idUserRecipient?: string
    // данные грузополучателя из карточки
    recipient: ConsigneesCardType
    // данные пользователя грузополучателя
    recipientUser?: Partial<CompanyRequisitesType>

    // расстояние (высчитывается автоматически при выборе грузоотправитель+грузополучатель)
    distance?: number
    // маршрут для карты
    route?: string
    // окночательная цена
    addedPrice?: number
    // штампы груза
    cargoStamps?: string
    // примечание
    note?: string
    // видимость для таблицы (используется только на фронте)
    visible?: boolean
    // выделение для таблицы (используется только на фронте)
    marked?: boolean

    /* БЛОК СТАТУСОВ ЗАЯВКИ */

    // глобальный статус заявки
    globalStatus?: RequestGlobalStatusType
    // локальный статус заявки
    localStatus: {
        // Оплату передал (от грузополучателя/заказчика --> водителю/перевозчику)
        paymentHasBeenTransferred?: boolean
        // Оплату получил (водитель/перевозчик получил(и) оплату)
        paymentHasBeenReceived?: boolean
        // Груз передан | Груз у водителя
        cargoHasBeenTransferred?: boolean
        // Груз получен | Груз у грузополучателя
        cargoHasBeenReceived?: boolean
    }
    // статус отношения пользователя к заявке (применяется только на фронте)
    roleStatus: RoleModesType,

    // количество ответов от водителей // массив с айдишками
    answers?: string[]
    // пользователи, имеющие доступ к данной заявке
    acceptedUsers?: string[]



    /* поля, заполняемые ПРИ/ПОСЛЕ принятия ответа на заявку */
    /* НЕИЗМЕНЯЕМЫЕ*/

    // привязывается id пользователя при создании отклика
    requestUserCarrierId?: string
    // привязывается id карточки
    requestCarrierId?: string
    // данные грузоотправителя
    requestCarrierUser?: Partial<CompanyRequisitesType>

    // id водителя (из карточки отклика)
    idEmployee?: string
    responseEmployee?: Partial<EmployeeCardType>
    // id транспорта (из карточки отклика)
    idTransport?: string
    responseTransport?: Partial<TransportCardType>
    // id прицепа (из карточки отклика)
    idTrailer?: string
    responseTrailer?: Partial<TrailerCardType>
    // тариф ставки перевозки 1 тонны на 1 км (из карточки отклика)
    responseStavka?: string
    // система налогообложения (ОСН, УСН, ЕСХН, ПСН, НПД и т.д.) (из карточки отклика)
    responseTax?: string

    /* поля вкладки ДОКУМЕНТЫ */
    // подсчитанная сумма (считается на фронте) (из карточки отклика)
    responsePrice?: string
    // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика) и после принятия груза
    cargoWeight?: number | string

    // ИЗМЕНЯЕМЫЕ
    // Время погрузки (устанавливается автоматически после нажатия кнопки "Груз у водителя"(сайт) или "Груз получил"(приложение на тел.)
    uploadTime?: Date | string
    // Время разгрузки (устанавливается автоматически после нажатия кнопки "Груз у получателя"(сайт) или "Груз передал"(приложение на тел.)
    unloadTime?: Date | string

    // время оплаты
    paymentDate?: Date | string
    // время подтверждения получения оплаты
    successPaymentDate?: Date | string
    // время, когда заявку закрыли (по правилам)
    isClosedDate?: Date | string

    /* БЛОК ОТМЕНЫ */
    // дата/время отмены заявки
    isCanceledDate?: Date | string
    // причины отмены заявки
    isCanceledReason?: string

    // блок с документами
    documents: DocumentsRequestType
}

// выделенный в отдельный блок РАБОТА С ДОКУМЕНТАМИ
export type DocumentsRequestType = {
    proxyWay: {
        // Транспортные документы Сторон (Заголовок / ТОЛЬКО ФРОНТ)
        header?: string
        // Доверенность Грузовладельцу (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        proxyFreightLoader?: string
        // Доверенность на Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        proxyDriver?: string
        // Путевой Лист Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        waybillDriver?: string
        // Маршрутный лист Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        itineraryList?: string
    },

    // Документы груза (содержит строку с путём) (File НА ОТГРУЗ)
    cargoDocuments?: string

    ttnECP: {
        // ТТН или ЭТрН с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)
        header?: string

        // строка со ссылкой на сгенерированный БЭКОМ документ
        documentDownload?: string
        // участвует ТОЛЬКО при редактировании формы
        documentUpload?: File

        /* статусы подписания документа (хранятся на бэке, редактируются фронтом)*/

        // Заказчик загрузил, подписал и выгрузил подписанный док
        customerIsSubscribe?: boolean
        // Перевозчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe?: boolean
        // Грузополучатель загрузил, подписал и выгрузил подписанный док
        consigneeIsSubscribe?: boolean
    },

    contractECP: {
        // Договор оказания транспортных услуг с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)
        header?: string

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        /* статусы подписания документа (хранятся на бэке, редактируются фронтом)*/
        // Заказчик загрузил, подписал и выгрузил подписанный док
        customerIsSubscribe?: boolean
        // Перевозчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe?: boolean
    },

    updECP: {
        // УПД от Перевозчика для Заказчика с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)
        header?: string

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        // Заказчик загрузил, подписал и выгрузил подписанный док
        customerIsSubscribe?: boolean
        // Перевозчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe?: boolean
    },

    customerToConsigneeContractECP: {
        // Документы от Заказчика для Получателя с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)
        header?: string

        // строка со ссылкой на сгенерированный БЭКОМ документ
        documentDownload?: string
        // (!!! заменяется на сгенерированный ???)
        // участвует ТОЛЬКО при редактировании формы
        documentUpload?: File

        // Заказчик загрузил, подписал и выгрузил подписанный док
        customerIsSubscribe?: boolean
        // Грузополучатель загрузил, подписал и выгрузил подписанный док
        consigneeIsSubscribe?: boolean
    },
}

// поля, которые возвращаются из бэка
export type OneRequestApiType<T extends string = ''> = {
    requestNumber: string
    idUserCustomer: string
    requestDate?: string | T
    idCustomer?: string | T

    cargoComposition?: string | T
    shipmentDate?: string | T
    cargoType?: string | T
    /* ГРУЗООТПРАВИТЕЛЬ ИЗ КАРТОЧКИ */
    idSender?: string | T
    idUserSender?: string | T
    titleSender?: string | T
    innNumberSender?: string | T
    organizationNameSender?: string | T
    kppSender?: string | T
    ogrnSender?: string | T
    addressSender?: string | T
    shipperFioSender?: string | T
    shipperTelSender?: string | T
    descriptionSender?: string | T
    coordinatesSender?: string | T
    citySender?: string | T
    /* ГРУЗОПОЛУЧАТЕЛЬ ИЗ КАРТОЧКИ */
    idRecipient?: string | T
    idUserRecipient?: string | T
    titleRecipient?: string | T
    innNumberRecipient?: string | T
    organizationNameRecipient?: string | T
    kppRecipient?: string | T
    ogrnRecipient?: string | T
    addressRecipient?: string | T
    consigneesFioRecipient?: string | T
    consigneesTelRecipient?: string | T
    descriptionRecipient?: string | T
    coordinatesRecipient?: string | T
    cityRecipient?: string | T

    // полилиния маршрута (оганичение на сервере 70000 символов)
    route?: string | T
    // так как полилиния может быть больше 70000, то остальные данные берём отсюда
    routePlus?: string | T
    // окончательная цена
    addedPrice?: number

    distance?: string | T
    cargoStamps?: string | T
    note?: string | T
    visible?: string | T
    marked?: string | T

    globalStatus?: RequestGlobalStatusType
    // деньги переданы (от грузополучателя/заказчика водителю/перевозчику)
    localStatuspaymentHasBeenTransferred?: boolean
    // груз у водителя
    localStatuscargoHasBeenTransferred?: boolean
    // деньги получены
    localStatuspaymentHasBeenReceived?: boolean
    // груз доставлен
    localStatuscargoHasBeenReceived?: boolean

    // ответы на заявки от перевозчиков (псевдо-массив строка id чз ', ')
    answers?: string | T
    // пользователи, имеющие доступ к данной заявке (псевдо-массив строка id чз ', ')
    acceptedUsers?: string | T

    /* Привязанные данные из карточки ответа на заявку =НАЧАЛО= */

    // id Пользователя, в принятом ответе на заявку (перевозчик)
    requestUserCarrierId?: string | T
    // id ответа на заявку (перевозчик)
    requestCarrierId?: string | T
    /* ЗАКАЗЧИК */
    innNumberCustomer?: string | T
    organizationNameCustomer?: string | T
    taxModeCustomer?: string | T
    kppCustomer?: string | T
    ogrnCustomer?: string | T
    okpoCustomer?: string | T
    legalAddressCustomer?: string | T
    descriptionCustomer?: string | T
    postAddressCustomer?: string | T
    phoneDirectorCustomer?: string | T
    phoneAccountantCustomer?: string | T
    emailCustomer?: string | T
    bikBankCustomer?: string | T
    nameBankCustomer?: string | T
    checkingAccountCustomer?: string | T
    korrAccountCustomer?: string | T
    mechanicFIOCustomer?: string | T
    dispatcherFIOCustomer?: string | T
    /* ОТПРАВИТЕЛЬ */
    taxModeSender?: string | T
    okpoSender?: string | T
    legalAddressSender?: string | T
    postAddressSender?: string | T
    phoneDirectorSender?: string | T
    phoneAccountantSender?: string | T
    emailSender?: string | T
    bikBankSender?: string | T
    nameBankSender?: string | T
    checkingAccountSender?: string | T
    korrAccountSender?: string | T
    mechanicFIOSender?: string | T
    dispatcherFIOSender?: string | T
    /* ПОЛУЧАТЕЛЬ */
    taxModeRecipient?: string | T
    okpoRecipient?: string | T
    legalAddressRecipient?: string | T
    postAddressRecipient?: string | T
    phoneDirectorRecipient?: string | T
    phoneAccountantRecipient?: string | T
    emailRecipient?: string | T
    bikBankRecipient?: string | T
    nameBankRecipient?: string | T
    checkingAccountRecipient?: string | T
    korrAccountRecipient?: string | T
    mechanicFIORecipient?: string | T
    dispatcherFIORecipient?: string | T
    /* ПЕРЕВОЗЧИК */
    innNumberCarrier?: string | T
    organizationNameCarrier?: string | T
    taxModeCarrier?: string | T
    kppCarrier?: string | T
    ogrnCarrier?: string | T
    okpoCarrier?: string | T
    legalAddressCarrier?: string | T
    descriptionCarrier?: string | T
    postAddressCarrier?: string | T
    phoneDirectorCarrier?: string | T
    phoneAccountantCarrier?: string | T
    emailCarrier?: string | T
    bikBankCarrier?: string | T
    nameBankCarrier?: string | T
    checkingAccountCarrier?: string | T
    korrAccountCarrier?: string | T
    mechanicFIOCarrier?: string | T
    dispatcherFIOCarrier?: string | T
    /* СОТРУДНИК */
    idEmployee?: string | T
    // ФИО сотрудника
    responseEmployeeFIO?: string | T
    // Телефон сотрудника
    responseEmployeePhoneNumber?: string | T
    // Серия, № паспорта
    responseEmployeepassportSerial?: string | T
    // Кем выдан паспорт
    responseEmployeepassportFMS?: string | T
    // Когда выдан
    responseEmployeepassportDate?: string | T
    // Номер водительского удостоверения
    responseEmployeedrivingLicenseNumber?: string | T
    // ссылка на фото
    responseEmployeePhotoFace?: string | T

    /* ТРАНСПОРТ */
    idTransport?: string | T
    // Гос. номер авто
    responseTransportNumber?: string | T
    // Марка авто
    responseTransportTrademark?: string | T
    // Модель авто
    responseTransportModel?: string | T
    // ПТС авто
    responseTransportPts?: string | T
    // ДОПОГ авто
    responseTransportDopog?: string | T
    // Тип груза авто
    responseTransportCargoType?: CargoTypeType
    // Вес груза авто
    responseTransportCargoWeight?: string | T
    // Право собственности авто
    responseTransportPropertyRights?: PropertyRightsType
    // ссылка на фото
    responseTransportImage?: string | T

    /* ПРИЦЕП */
    idTrailer?: string | T
    // Гос. номер прицепа
    responseTrailertrailerNumber?: string | T
    // Марка прицепа
    responseTrailerTrademark?: string | T
    // Модель прицепа
    responseTrailerModel?: string | T
    // ПТС прицепа
    responseTrailerPts?: string | T
    // ДОПОГ прицепа
    responseTrailerDopog?: string | T
    // Тип груза прицепа
    responseTrailerCargoType?: CargoTypeType
    // Вес груза прицепа
    responseTrailerCargoWeight?: string | T
    // Права собственности прицепа
    responseTrailerPropertyRights?: PropertyRightsType
    // ссылка на фото
    responseTrailerImage?: string | T

    responseStavka?: string | T
    responseTax?: string | T
    // цена в ответе на заявку
    responsePrice?: string | T
    /* Привязанные данные из карточки ответа на заявку =КОНЕЦ= */

    /* ПОГРУЗКА-РАЗГРУЗКА */
    cargoWeight?: string | T
    uploadTime?: string | T
    unloadTime?: string | T

    /* ДОКИ */
    proxyFreightLoader?: string | T
    proxyDriver?: string | T
    proxyWaybillDriver?: string | T
    proxyItineraryList?: string | T
    cargoDocuments?: string | T
    ttnECPdocumentDownload?: string | T
    ttnECPdocumentUpload?: string | T
    ttnECPcustomerIsSubscribe?: boolean
    ttnECPcarrierIsSubscribe?: boolean
    ttnECPconsigneeIsSubscribe?: boolean
    contractECPdocumentDownload?: string | T
    contractECPdocumentUpload?: string | T
    contractECPcustomerIsSubscribe?: boolean
    contractECPcarrierIsSubscribe?: boolean
    updECPdocumentDownload?: string | T
    updECPdocumentUpload?: string | T
    updECPcustomerIsSubscribe?: boolean
    updECPcarrierIsSubscribe?: boolean
    customerToConsigneeContractECPdocumentDownload?: string | T
    customerToConsigneeContractECPdocumentUpload?: string | T
    customerToConsigneeContractECPcustomerIsSubscribe?: boolean
    customerToConsigneeContractECPconsigneeIsSubscribe?: boolean

    /* дата отмены и причина отмены заявки */
    isCanceledDate?: string | T
    isCanceledReason?: string | T

    // время, когда заявку закрыли (по правилам)
    isClosedDate?: string | T
    // время оплаты
    paymentDate?: string | T
    // время подтверждения получения оплаты
    successPaymentDate?: string | T
}

// добавлены служебные слова для обнуления и присвоения серверного времени
export type OneRequestApiToApiType = OneRequestApiType<'null' | 'serverDateTime'>

//////////////////////////*ТИПЫ ДЛЯ ТАБЛИЦЫ*/////////////////////////////////////////////////

// моды отображения таблицы
export type TableModesType = 'search' | 'history' | 'status'

export type TableModesBooleanType = { isSearchTblMode: boolean, isHistoryTblMode: boolean, isStatusTblMode: boolean }

// статусы заявки в таблице
export type TableLocalStatus =
    'водитель выбран'
    | 'груз у водителя'
    | 'груз у получателя'
    | 'нет ответов'
    | 'есть ответы'
    | ''

// для полей в таблице
export type OneRequestTableType = {
    requestNumber: number
    cargoType: string
    shipmentDate: string
    distance: number
    route: string
    answers: number
    price: number
    globalStatus: RequestGlobalStatusType
    responseEmployee: string
    marked: boolean
    localStatus: TableLocalStatus
    roleStatus: RoleModesType
}

// данные в Cell таблицы
export type OneRequestTableTypeReq = Required<OneRequestTableType> & {
    // непосредственное содержимое ячейки (по акцессору)
    value: string
}
