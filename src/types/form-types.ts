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

// на сотрудника
export type EmployeesCardType<T = DefaultFormType> = {
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
    status: T
    // прикреплённый транспорт
    idTransport: T
    // прикреплённый прицеп
    idTrailer: T
}

// на грузоПОЛУЧАТЕЛЯ
export type ConsigneesCardType<T = DefaultFormType> = {
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

// на грузоотправителя
export type ShippersCardType<T = DefaultFormType> = {
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

/////////////////////////////////////////////////////////////////////////////
export const cargoFormats = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ]
export const cargoConstType = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ] as const
export type CargoTypeType = typeof cargoConstType[number]

export const propertyRights = [ 'Собственность', 'Cовместная собственность супругов', 'Аренда', 'Лизинг', 'Безвозмездное пользование' ] as const
export type PropertyRightsType = typeof propertyRights[number]

// на транспорт
export type TransportCardType<T = DefaultFormType> = {
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
    cargoType: T | CargoTypeType
    // Вес груза
    cargoWeight: T
    // Право собственности
    propertyRights: T | PropertyRightsType
    // Фото транспорта
    transportImage: T
}

// на прицеп
export type TrailerCardType<T = DefaultFormType> = {
    // идентификатор
    idTrailer: string
    // Гос. номер авто
    trailerNumber: T
    // Марка авто
    trailerTrademark: T
    // Модель авто
    trailerModel: T
    // ПТС
    pts: T
    // ДОПОГ
    dopog: T
    // Тип груза
    cargoType: T | CargoTypeType
    // Вес груза
    cargoWeight: T
    // Право собственности
    propertyRights: T | PropertyRightsType
    // Фото транспорта
    trailerImage: T
}

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
    globalStatus?: 'новая заявка' | 'в работе' | 'завершена' | 'отменена'
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

    globalStatus?: string
    localStatuspaymentHasBeenTransferred?: boolean
    localStatuscargoHasBeenTransferred?: boolean
    localStatuspaymentHasBeenReceived?: boolean
    localStatuscargoHasBeenReceived?: boolean

    answers?: string

    // заявки, доступ к которым оплачен данным пользователем
    acceptedUsers?: string
    /*НОВЫЕ ПОЛЯ НА СОТРУДНИКА*/
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

    /*НОВЫЕ ПОЛЯ НА ТРАНСПОРТ*/
    // Гос. номер авто
    responseTransportNumber?: string
    // Марка авто
    responseTransportTrademark?: string
    // Модель авто
    responseTransportModel?: string
    // ПТС
    responseTransportPts?: string
    // ДОПОГ
    responseTransportDopog?: string
    // Тип груза
    responseTransportCargoType?: string
    // Вес груза
    responseTransportCargoWeight?: string
    // Право собственности
    responseTransportPropertyRights?: string

    /*НОВЫЕ ПОЛЯ НА ПРИЦЕП*/
    // Гос. номер прицепа
    responseTrailertrailerNumber?: string
    // Марка прицепа
    responseTrailerTrademark?: string
    // Модель прицепа
    responseTrailerModel?: string
    // ПТС
    responseTrailerPts?: string
    // ДОПОГ
    responseTrailerDopog?: string
    // Тип груза
    responseTrailerCargoType?: string
    // Вес груза
    responseTrailerCargoWeight?: string
    responseTrailerPropertyRights?: string

    requestUserCarrierId?: string
    requestCarrierId?: string
    idEmployee?: string
    idTransport?: string
    idTrailer?: string
    responseStavka?: string
    responseTax?: string
    responsePrice?: string
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
