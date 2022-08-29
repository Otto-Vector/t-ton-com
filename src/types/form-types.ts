// на валидаторы для форм
export type ValidateType = undefined | ( ( val: string ) => string | undefined )
export type ParserType = undefined | ( ( val: string | undefined ) => string )

// на поля для форм
type DefaultFormType = string | undefined | null

// на форму авторизации
export type phoneSubmitType<T = DefaultFormType> = {
    innNumber: T
    phoneNumber: T
    kppNumber: T
    sms: T
}

// на форму с реквизитами
export type CompanyRequisitesType<T = DefaultFormType> = {
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    taxMode: T // Вид налогов
    kpp: T // КПП
    ogrn: T // ОГРН
    okpo: T // OKПО
    legalAddress: T // Юридический адрес
    description: T // доп. информация

    postAddress: T // почтовый адрес
    phoneDirector: T // телефон директора
    phoneAccountant: T // телефон бухгалтера
    email: T // электронная почта
    bikBank: T // БИК Банка
    nameBank: T // Наименование Банка
    checkingAccount: T // Расчётный счёт
    korrAccount: T // Корреспондентский счёт

    mechanicFIO: T // ФИО механика
    dispatcherFIO: T // ФИО диспетчера

    cash: T // количество денег на счету
    requestActiveCount: T // количество активных заявок
    maxRequests: T // максимальное количество заявок (редактируется админом)

    tariffs: { //тарифы на оплату (отображаются в инфо-секции, используются везде, редактируются админом)
        create: T, // тариф на создание заявки (по умолчанию 100)
        acceptShortRoute: T, // тариф на принятие заявки на короткие расстояния (по умолчанию 100)
        acceptLongRoute: T, // тариф на принятие заявки на Дальние расстояния (по умолчанию 100)
        paySafeTax: T, // процент на безопасную сделку (по умолчанию 3) (будем прикручивать в будущем)
    },
}

// на сотрудника
export type EmployeesCardType<T = DefaultFormType> = {
    idEmployee: string // идентификатор
    employeeFIO: T // ФИО сотрудника
    employeePhoneNumber: T // Телефон сотрудника
    passportSerial: T // Серия, № паспорта
    passportFMS: T // Кем выдан паспорт
    passportDate: T // Когда выдан
    drivingLicenseNumber: T // Номер водительского удостоверения
    drivingCategory: T // Водительские категории
    personnelNumber: T // Табельный номер
    garageNumber: T // Гаражный номер
    photoFace: T // Добавить фотографию сотрудника
    rating: T // количество успешно завершённых заказов (считается автоматически) // как считать, пока хз на бэке или чз фронт...
    coordinates: T // координаты местоположения водителя
    status: T // статус водителя
    idTransport: T // прикреплённый транспорт
    idTrailer: T // прикреплённый прицеп
}

// на грузоПОЛУЧАТЕЛЯ
export type ConsigneesCardType<T = DefaultFormType> = {
    idRecipient: string // идентификатор
    title: T // укороченное название
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    kpp: T // КПП
    ogrn: T // ОГРН
    address: T // Юридический адрес
    consigneesFio: T // ФИО получателя
    consigneesTel: T // Телефон получателя
    description: T // Доп. данные для ТТН
    coordinates: T // Местоположение в координатах
    city: T // присваивается автоматически
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

export const propertyRights = [ 'Собственность', 'Аренда', 'Лизинг' ] as const
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
    requestNumber: undefined | number, // уникальный номер заявки (числовой номер/каждая новая заявка создаётся с номером+1 от предыдущей на бэке)
    requestDate: undefined | Date, // дата создания заявки

    cargoComposition: undefined | string, // вид груза
    shipmentDate: undefined | Date, // дата погрузки
    cargoType: undefined | CargoTypeType, // тип груза (заведомо известный набор типов)

    idUserCustomer: undefined | string, // заказчик (совпадает с id пользователя (потому как данные по ИНН/КПП и счетам будут браться оттуда)
    idSender: undefined | string, // грузоотправитель
    idRecipient: undefined | string, // грузополучатель

    distance: undefined | number, // расстояние (высчитывается автоматически при выборе грузоотправитель+грузополучатель)
    note: undefined | string, // примечание
    visible?: boolean // видимость для таблицы (используется только на фронте)
    marked?: boolean // выделение для таблицы (используется только на фронте)

    // БЛОК СТАТУСОВ ЗАЯВКИ
    globalStatus: 'новая заявка' | 'в работе' | 'завершена' | 'отменена' | undefined // глобальный статус заявки
    localStatus: { // локальный статус заявки
        paymentHasBeenTransferred: boolean | undefined // Оплату передал
        paymentHasBeenReceived: boolean | undefined // Оплату получил
        cargoHasBeenTransferred: boolean | undefined // Груз передан
        cargoHasBeenReceived: boolean | undefined // Груз получен
    }

    answers: string[] | undefined // количество ответов от водителей // массив с айдишками

    // поля, заполняемые ПРИ/ПОСЛЕ принятия ответа на заявку
    // НЕИЗМЕНЯЕМЫЕ
    requestCarrierId: undefined | string, // привязывается id пользователя при создании отклика
    idEmployee: undefined | string, // id водителя (из карточки отклика)
    idTransport: undefined | string, // id транспорта (из карточки отклика)
    idTrailer: undefined | string, // id прицепа (из карточки отклика)
    responseStavka: undefined | string, // тариф ставки перевозки 1 тонны на 1 км (из карточки отклика)
    responseTax: undefined | string, // система налогообложения (ОСН, УСН, ЕСХН, ПСН, НПД и т.д.) (из карточки отклика)

    // поля вкладки ДОКУМЕНТЫ
    responsePrice: undefined | string, // подсчитанная сумма (считается на фронте) (из карточки отклика)
    cargoWeight?: number | string // Вес груза, в тн. (высчитывается автоматически по тоннажу тягач+прицеп (из карточки отклика)

    // ИЗМЕНЯЕМЫЕ
    uploadTime: Date | undefined | string // Время погрузки (устанавливается автоматически после нажатия кнопки "Груз у водителя"(сайт) или "Груз получил"(приложение на тел.)

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
export type OneRequestApiType = {
        requestNumber: string;
        requestDate: string;
        cargoComposition: string;
        shipmentDate: string;
        cargoType: string;
        idUserCustomer: string;
        idSender: string;
        idRecipient: string;
        distance: string;
        note: string;
        visible: string;
        marked: string;
        globalStatus: string;
        localStatuspaymentHasBeenTransferred: string;
        localStatuscargoHasBeenTransferred: string;
        localStatuspaymentHasBeenReceived: string;
        localStatuscargoHasBeenReceived: string;
        answers: string;
        requestCarrierId: string;
        idEmployee: string;
        idTransport: string;
        idTrailer: string;
        responseStavka: string;
        responseTax: string;
        responsePrice: string;
        cargoWeight: string;
        uploadTime: string;
        proxyFreightLoader: string;
        proxyDriver: string;
        proxyWaybillDriver: string;
        cargoDocuments: string;
        ttnECPdocumentDownload: string;
        ttnECPdocumentUpload: string;
        ttnECPcustomerIsSubscribe: string;
        ttnECPcarrierIsSubscribe: string;
        ttnECPconsigneeIsSubscribe: string;
        contractECPdocumentDownload: string;
        contractECPdocumentUpload: string;
        contractECPcustomerIsSubscribe: string;
        contractECPcarrierIsSubscribe: string;
        updECPdocumentDownload: string;
        updECPdocumentUpload: string;
        updECPcustomerIsSubscribe: string;
        updECPcarrierIsSubscribe: string;
        customerToConsigneeContractECPdocumentDownload: string;
        customerToConsigneeContractECPdocumentUpload: string;
        customerToConsigneeContractECPcustomerIsSubscribe: string;
        customerToConsigneeContractECPconsigneeIsSubscribe: string;
    }
