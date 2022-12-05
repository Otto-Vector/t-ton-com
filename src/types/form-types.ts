// на валидаторы для форм
export type ValidateType = undefined | ( ( val: string ) => string | undefined )
export type ParserType = undefined | ( ( val: string | undefined ) => string )

// на поля для форм
type DefaultFormType = string | undefined

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
        create: T,
        // тариф на принятие заявки на короткие расстояния (по умолчанию 100)
        acceptShortRoute: T,
        // тариф на принятие заявки на Дальние расстояния (по умолчанию 100)
        acceptLongRoute: T,
        // процент на безопасную сделку (по умолчанию 3) (будем прикручивать в будущем)
        paySafeTax: T,
    },
}
// на форму с реквизитами - возврат с бэка
export type CompanyRequisitesApiType = {
    idUser: string,
    innNumber: string,
    nnNumber: string,
    organizationName: string,
    taxMode: string,
    kpp?: string,
    ogrn: string,
    okpo: string,
    legalAddress: string,
    description: string,
    postAddress: string,
    phoneDirector: string,
    phoneAccountant: string,
    email: string,
    bikBank: string,
    nameBank: string,
    checkingAccount: string,
    korrAccount: string,
    is_staff: boolean,
    is_active: boolean,
    phone: string,
    phoneCode: string,
    phoneValidate: boolean,
    password: string,
    role: string,
    cash: number,
    requestActiveCount: string,
    maxRequests: string,
    tarifCreate: string,
    tarifAcceptShortRoute: string,
    tarifAcceptLongRoute: string,
    tarifPaySafeTax: string,
    mechanicFIO?: string,
    dispatcherFIO?: string,
}
///////////////////////////////////////////////////////////
// на сотрудника
export type EmployeesCardType<T = DefaultFormType> = {
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
    passportDate: T | Date
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
    // количество успешно завершённых заказов (считается автоматически)
    rating: T
    // координаты местоположения водителя
    coordinates: T
    // статус водителя
    status?: 'на заявке' | 'свободен' | 'ожидает принятия' | 'в отпуске' | 'уволен'
    // прикреплённый транспорт
    idTransport: T
    // прикреплённый прицеп
    idTrailer: T
    // список ответок, к которым привязан водитель
    responseToRequest: T
}
// на сотрудника - ответка из бэка
export type EmployeesApiType = EmployeesCardType<string> & { passportDate: string }
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

export type RequestGlobalStatusType = 'новая заявка' | 'в работе' | 'завершена' | 'отменена'

// ЗАЯВКА
export type OneRequestType = {
    /* эти два поля создаются автоматически на бэке при запросе на создание,
    далее заявка ТОЛЬКО редактируется или УДАЛЯЕТСЯ */

    // уникальный номер заявки (числовой номер/каждая новая заявка создаётся с номером+1 от предыдущей на бэке)
    requestNumber?: number
    // дата создания заявки
    requestDate?: Date

    // вид груза
    cargoComposition?: string
    // дата погрузки
    shipmentDate?: Date
    // тип груза (заведомо известный набор типов)
    cargoType?: CargoTypeType

    // заказчик (совпадает с id пользователя (потому как данные по ИНН/КПП и счетам будут браться оттуда)
    idUserCustomer?: string
    idCustomer?: string

    // грузоотправитель
    idSender?: string
    idUserSender?: string,
    sender: ShippersCardType,

    // грузополучатель
    idRecipient?: string
    idUserRecipient?: string,
    recipient: ConsigneesCardType,

    // расстояние (высчитывается автоматически при выборе грузоотправитель+грузополучатель)
    distance?: number
    // маршрут для карты
    route?: string
    // примечание
    note?: string
    // видимость для таблицы (используется только на фронте)
    visible?: boolean
    // выделение для таблицы (используется только на фронте)
    marked?: boolean

    // БЛОК СТАТУСОВ ЗАЯВКИ

    // глобальный статус заявки
    globalStatus?: RequestGlobalStatusType
    // локальный статус заявки
    localStatus: {
        // Оплату передал
        paymentHasBeenTransferred?: boolean
        // Оплату получил
        paymentHasBeenReceived?: boolean
        // Груз передан
        cargoHasBeenTransferred?: boolean
        // Груз получен
        cargoHasBeenReceived?: boolean
    }
    // количество ответов от водителей // массив с айдишками
    answers?: string[]
    // заявки, доступ к которым оплачен данным пользователем /*чтобы он по каким-либо причинам не слетел с неё*/
    acceptedUsers?: string[]
    /* поля, заполняемые ПРИ/ПОСЛЕ принятия ответа на заявку */
    /* НЕИЗМЕНЯЕМЫЕ*/

    // привязывается id пользователя при создании отклика
    requestUserCarrierId?: string
    // привязывается id карточки
    requestCarrierId?: string
    // id водителя (из карточки отклика)
    idEmployee?: string
    responseEmployee?: Partial<EmployeesCardType>
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

    // поля вкладки ДОКУМЕНТЫ
    // подсчитанная сумма (считается на фронте) (из карточки отклика)
    responsePrice?: string
    // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика)
    cargoWeight?: number | string

    // ИЗМЕНЯЕМЫЕ
    // Время погрузки (устанавливается автоматически после нажатия кнопки "Груз у водителя"(сайт) или "Груз получил"(приложение на тел.)
    uploadTime?: Date | string

    documents: DocumentsRequestType // блок с документами
}

// выделенный в отдельный блок РАБОТА С ДОКУМЕНТАМИ
export type DocumentsRequestType = {
    proxyWay: {
        header?: string // Транспортные документы Сторон (Заголовок / ТОЛЬКО ФРОНТ)
        proxyFreightLoader?: string // Доверенность Грузовладельцу (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        proxyDriver?: string // Доверенность на Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        waybillDriver?: string // Путевой Лист Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
    },

    cargoDocuments?: string | File // Документы груза (содержит строку с путём) (File НА ОТГРУЗ)

    ttnECP: {
        header?: string // ТТН или ЭТрН с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        // статусы подписания документа (хранятся на бэке, редактируются фронтом)
        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
        consigneeIsSubscribe: boolean | string // Грузополучатель загрузил, подписал и выгрузил подписанный док
    },

    contractECP: {
        header?: string // Договор оказания транспортных услуг с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        // статусы подписания документа (хранятся на бэке, редактируются фронтом)
        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
    },

    updECP: {
        header?: string // УПД от Перевозчика для Заказчика с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
    },

    customerToConsigneeContractECP: {
        header?: string // Документы от Заказчика для Получателя с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload?: string // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload?: File // участвует ТОЛЬКО при редактировании формы

        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        consigneeIsSubscribe: boolean | string // Грузополучатель загрузил, подписал и выгрузил подписанный док
    },
}

// поля, которые возвращаются из бэка
export type OneRequestApiType = {
    requestNumber: string
    requestDate?: string
    idUserCustomer: string
    idCustomer?: string

    cargoComposition?: string
    shipmentDate?: string
    cargoType?: string

    idSender?: string
    idUserSender?: string,
    titleSender?: string,
    innNumberSender?: string,
    organizationNameSender?: string,
    kppSender?: string,
    ogrnSender?: string,
    addressSender?: string,
    shipperFioSender?: string,
    shipperTelSender?: string,
    descriptionSender?: string,
    coordinatesSender?: string,
    citySender?: string,

    idRecipient?: string,
    idUserRecipient?: string,
    titleRecipient?: string,
    innNumberRecipient?: string,
    organizationNameRecipient?: string,
    kppRecipient?: string,
    ogrnRecipient?: string,
    addressRecipient?: string,
    consigneesFioRecipient?: string,
    consigneesTelRecipient?: string,
    descriptionRecipient?: string,
    coordinatesRecipient?: string,
    cityRecipient?: string,
    route?: string,
    addedPrice?: number,

    distance?: string
    note?: string
    visible?: string
    marked?: string

    globalStatus?: RequestGlobalStatusType
    localStatuspaymentHasBeenTransferred?: boolean
    localStatuscargoHasBeenTransferred?: boolean
    localStatuspaymentHasBeenReceived?: boolean
    localStatuscargoHasBeenReceived?: boolean

    // ответы на заявки от перевозчиков (псевдо-массив строка id чз ', ')
    answers?: string
    // заявки, доступ к которым оплачен данным пользователем (псевдо-массив строка id чз ', ')
    acceptedUsers?: string

    /* Привязанные данные из карточки ответа на заявку =НАЧАЛО= */

    // id Пользователя, в принятом ответе на заявку (перевозчик)
    requestUserCarrierId?: string
    // id ответа на заявку (перевозчик)
    requestCarrierId?: string

    /* СОТРУДНИК */
    idEmployee?: string
    // ФИО сотрудника
    responseEmployeeFIO?: string
    // Телефон сотрудника
    responseEmployeePhoneNumber?: string
    // Серия, № паспорта
    responseEmployeepassportSerial?: string
    // Кем выдан паспорт
    responseEmployeepassportFMS?: string
    // Когда выдан
    responseEmployeepassportDate?: string
    // Номер водительского удостоверения
    responseEmployeedrivingLicenseNumber?: string

    /* ТРАНСПОРТ */
    idTransport?: string
    // Гос. номер авто
    responseTransportNumber?: string
    // Марка авто
    responseTransportTrademark?: string
    // Модель авто
    responseTransportModel?: string
    // ПТС авто
    responseTransportPts?: string
    // ДОПОГ авто
    responseTransportDopog?: string
    // Тип груза авто
    responseTransportCargoType?: CargoTypeType
    // Вес груза авто
    responseTransportCargoWeight?: string
    // Право собственности авто
    responseTransportPropertyRights?: PropertyRightsType

    /* ПРИЦЕП */
    idTrailer?: string
    // Гос. номер прицепа
    responseTrailertrailerNumber?: string
    // Марка прицепа
    responseTrailerTrademark?: string
    // Модель прицепа
    responseTrailerModel?: string
    // ПТС прицепа
    responseTrailerPts?: string
    // ДОПОГ прицепа
    responseTrailerDopog?: string
    // Тип груза прицепа
    responseTrailerCargoType?: CargoTypeType
    // Вес груза прицепа
    responseTrailerCargoWeight?: string
    // Права собственности прицепа
    responseTrailerPropertyRights?: PropertyRightsType

    responseStavka?: string
    responseTax?: string
    responsePrice?: string
    /* Привязанные данные из карточки ответа на заявку =КОНЕЦ= */

    cargoWeight?: string
    uploadTime?: string

    proxyFreightLoader?: string
    proxyDriver?: string
    proxyWaybillDriver?: string
    cargoDocuments?: string
    ttnECPdocumentDownload?: string
    ttnECPdocumentUpload?: string
    ttnECPcustomerIsSubscribe?: string
    ttnECPcarrierIsSubscribe?: string
    ttnECPconsigneeIsSubscribe?: string
    contractECPdocumentDownload?: string
    contractECPdocumentUpload?: string
    contractECPcustomerIsSubscribe?: string
    contractECPcarrierIsSubscribe?: string
    updECPdocumentDownload?: string
    updECPdocumentUpload?: string
    updECPcustomerIsSubscribe?: string
    updECPcarrierIsSubscribe?: string
    customerToConsigneeContractECPdocumentDownload?: string
    customerToConsigneeContractECPdocumentUpload?: string
    customerToConsigneeContractECPcustomerIsSubscribe?: string
    customerToConsigneeContractECPconsigneeIsSubscribe?: string
}

// для полей в таблице
export type OneRequestTableType = {
    requestNumber?: number
    cargoType?: string
    shipmentDate?: string
    distance?: number
    route?: string
    answers?: number
    price?: number
    globalStatus?: RequestGlobalStatusType
    responseEmployee?: string
}