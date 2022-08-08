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

    tarifs: { //тарифы на оплату (отображаются в инфо-секции, используются везде, редактируются админом)
        create: T, // тариф на создание заявки (по умолчанию 100)
        acceptShortRoute: T, // тариф на принятие заявки на короткие расстояния (по умолчанию 100)
        acceptLongRoute: T, // тариф на принятие заявки на Дальние расстояиня (по умолчанию 100)
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
    rating: T // количество успешно завершённых заказов (считатется автоматически) // как считать, пока хз на бэке или чз фронт...
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

// на добавление водителя
export type AddDriverCardType<T = DefaultFormType> = {
    requestId: T, // номер заявки, к которой привязана форма
    driverFIO: T, // id водителя (из карточки водителя)
    driverTransport: T, // id транспорта (из карточки транспорт)
    driverTrailer: T, // id прицепа (из карточки прицеп)
    driverStavka: T,
    driverSumm: T,
    driverRating: T,
    driverTax: T,
    driverPhoto: T,
    driverTransportPhoto: T,
    driverTrailerPhoto: T,
}


export type OneRequestType = {
    id: number | undefined,
    requestNumber: number | undefined, // номер заявки
    requestDate: undefined | Date, // дата создания заявки
    cargoComposition: undefined | string, // вид груза
    shipmentDate: undefined | Date, // дата погрузки
    cargoType: undefined | CargoTypeType, // тип груза
    customer: undefined | string, // заказчик
    shipper: undefined | string, // грузоотправитель
    consignee: undefined | string, // грузополучатель
    carrier: undefined | string, // перевозчик
    driver: undefined | string, // водитель
    distance: undefined | number, // расстояние
    note: undefined | string, // примечание
    answers: number[] | undefined // количество ответов от водителей // что-то вроде массива с айдишками
    driverPrice: number | undefined // стоимость перевозки
    driverTax: number | undefined // ставка тн.км.
    visible: boolean // видимость для таблицы
    documents: DocumentsRequestType
}

export type DocumentsRequestType = {
    proxyWay: {
        label: string | undefined // Транспортные документы Сторон
        proxyFreightLoader: boolean | string // Доверенность Грузовладельцу
        proxyDriver: boolean | string // Доверенность на Водителя
        waybillDriver: boolean | string // Путевой Лист Водителя
    },
    uploadTime: Date | undefined | string // Время погрузки
    cargoWeight: number | string // Вес груза, в тн.
    cargoDocuments: string | undefined // Документы груза
    cargoPrice: number | string // Цена по Заявке
    addedPrice: number | string // Доп. Услуги
    finalPrice: number | string // Итоговая Цена
    ttnECP: {
        label: string | undefined // ТТН или ЭТрН с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        consignee: boolean | string // Грузополучатель
    },
    contractECP: {
        label: string | undefined // Договор оказания транспортных услуг с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        uploadDocument: string | undefined // Загрузить
    },
    updECP: {
        label: string | undefined // УПД от Перевозчика для Заказчика с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        uploadDocument: string | undefined // Загрузить
    },
    customerToConsigneeContractECP: {
        label: string | undefined // Документы от Заказчика для Получателя с ЭЦП
        customer: boolean | string // Заказчик
        consignee: boolean | string // Грузополучатель
        uploadDocument: string | undefined // Загрузить
    },
    paymentHasBeenTransferred: string | undefined // Оплату передал
    paymentHasBeenReceived: boolean | string // Оплату получил
    completeRequest: boolean | string // Закрыть заявку
}
