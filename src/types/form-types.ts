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
    cash: T
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

export const propertyRights = [ 'Собственность', 'Cовместная собственность супругов',  'Аренда', 'Лизинг', 'Безвозмездное пользование' ] as const
export type PropertyRightsType = typeof propertyRights[number]

// на транспорт
export type TransportCardType<T = DefaultFormType> = {
    idTransport: string // идентификатор
    transportNumber: T // Гос. номер авто
    transportTrademark: T // Марка авто
    transportModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoTypeType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRightsType // Право собственности
    transportImage: T // Фото транспорта
}

// на прицеп
export type TrailerCardType<T = DefaultFormType> = {
    idTrailer: string // идентификатор
    trailerNumber: T // Гос. номер авто
    trailerTrademark: T // Марка авто
    trailerModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoTypeType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRightsType // Право собственности
    trailerImage: T // Фото транспорта
}

// на добавление отклика на заявку
export type ResponseToRequestCardType<T = DefaultFormType> = {
    responseId: T, // уникальный id отклика на заявку
    requestNumber: T, // номер заявки, к которой привязана форма
    requestCarrierId: T, // привязывается id пользователя при создании отклика

    idEmployee: T, // id водителя (из карточки водителя)
    idTransport: T, // id транспорта (из карточки транспорт / изначальное значение из карточки водителя)
    idTrailer: T, // id прицепа (из карточки прицеп / изначальное значение из карточки водителя)

    cargoWeight: T, // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика)

    responseStavka: T, // тариф ставки перевозки 1 тонны на 1 км
    responsePrice: T, // подсчитанная сумма (считается на фронте)
    responseTax: T, // система налогообложения (ОСН, УСН, ЕСХН, ПСН, НПД и т.д.)
}

// ЗАЯВКА
export type OneRequestType = {
    // эти два поля создаются автоматически на бэке при запросе на создание
    // далее заявка ТОЛЬКО редактируется или УДАЛЯЕТСЯ

    // уникальный номер заявки (числовой номер/каждая новая заявка создаётся с номером+1 от предыдущей на бэке)
    requestNumber: undefined | number
    // дата создания заявки
    requestDate: undefined | Date

    // вид груза
    cargoComposition: undefined | string
    // дата погрузки
    shipmentDate: undefined | Date
    // тип груза (заведомо известный набор типов)
    cargoType: undefined | CargoTypeType

    // заказчик (совпадает с id пользователя (потому как данные по ИНН/КПП и счетам будут браться оттуда)
    idUserCustomer: undefined | string
    idCustomer?: string

    // грузоотправитель
    idSender: undefined | string
    idUserSender?: string,
    sender: ShippersCardType,

    // грузополучатель
    idRecipient: undefined | string
    idUserRecipient?: string,
    recipient: ConsigneesCardType,

    // расстояние (высчитывается автоматически при выборе грузоотправитель+грузополучатель)
    distance: undefined | number
    // маршрут для карты
    route?: string
    // примечание
    note: undefined | string
    // видимость для таблицы (используется только на фронте)
    visible?: boolean
    // выделение для таблицы (используется только на фронте)
    marked?: boolean

    // БЛОК СТАТУСОВ ЗАЯВКИ

    // глобальный статус заявки
    globalStatus: 'новая заявка' | 'в работе' | 'завершена' | 'отменена' | undefined
    // локальный статус заявки
    localStatus: {
        // Оплату передал
        paymentHasBeenTransferred: boolean | undefined
        // Оплату получил
        paymentHasBeenReceived: boolean | undefined
        // Груз передан
        cargoHasBeenTransferred: boolean | undefined
        // Груз получен
        cargoHasBeenReceived: boolean | undefined
    }
    // количество ответов от водителей // массив с айдишками
    answers: string[] | undefined

    /* поля, заполняемые ПРИ/ПОСЛЕ принятия ответа на заявку */
    /* НЕИЗМЕНЯЕМЫЕ*/

    // привязывается id пользователя при создании отклика
    requestUserCarrierId?: string
    // привязывается id карточки
    requestCarrierId: undefined | string
    // id водителя (из карточки отклика)
    idEmployee: undefined | string
    // id транспорта (из карточки отклика)
    idTransport: undefined | string
    // id прицепа (из карточки отклика)
    idTrailer: undefined | string
    // тариф ставки перевозки 1 тонны на 1 км (из карточки отклика)
    responseStavka: undefined | string
    // система налогообложения (ОСН, УСН, ЕСХН, ПСН, НПД и т.д.) (из карточки отклика)
    responseTax: undefined | string

    // поля вкладки ДОКУМЕНТЫ
    // подсчитанная сумма (считается на фронте) (из карточки отклика)
    responsePrice: undefined | string
    // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика)
    cargoWeight?: number | string

    // ИЗМЕНЯЕМЫЕ
    // Время погрузки (устанавливается автоматически после нажатия кнопки "Груз у водителя"(сайт) или "Груз получил"(приложение на тел.)
    uploadTime: Date | undefined | string

    documents: DocumentsRequestType // блок с документами
}

// выделенный в отдельный блок РАБОТА С ДОКУМЕНТАМИ
export type DocumentsRequestType = {
    proxyWay: {
        header: string | undefined // Транспортные документы Сторон (Заголовок / ТОЛЬКО ФРОНТ)
        proxyFreightLoader: undefined | string // Доверенность Грузовладельцу (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        proxyDriver: undefined | string // Доверенность на Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
        waybillDriver: undefined | string // Путевой Лист Водителя (ГЕНЕРИРУЕТСЯ на БЭКЕ, содержит строку с путём)
    },

    cargoDocuments: string | undefined | File // Документы груза (содержит строку с путём) (File НА ОТГРУЗ)

    ttnECP: {
        header: string | undefined // ТТН или ЭТрН с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload: string | undefined // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload: File | undefined // участвует ТОЛЬКО при редактировании формы

        // статусы подписания документа (хранятся на бэке, редактируются фронтом)
        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
        consigneeIsSubscribe: boolean | string // Грузополучатель загрузил, подписал и выгрузил подписанный док
    },

    contractECP: {
        header: string | undefined // Договор оказания транспортных услуг с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload: string | undefined // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload: File | undefined // участвует ТОЛЬКО при редактировании формы

        // статусы подписания документа (хранятся на бэке, редактируются фронтом)
        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
    },

    updECP: {
        header: string | undefined // УПД от Перевозчика для Заказчика с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload: string | undefined // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload: File | undefined // участвует ТОЛЬКО при редактировании формы

        customerIsSubscribe: boolean | string // Заказчик загрузил, подписал и выгрузил подписанный док
        carrierIsSubscribe: boolean | string // Перевозчик загрузил, подписал и выгрузил подписанный док
    },

    customerToConsigneeContractECP: {
        header: string | undefined // Документы от Заказчика для Получателя с ЭЦП (Заголовок / ТОЛЬКО ФРОНТ)

        documentDownload: string | undefined // строка со ссылкой на сгенерированный БЭКОМ документ
        // (!!! заменяется на сгенерированный ???)
        documentUpload: File | undefined // участвует ТОЛЬКО при редактировании формы

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
