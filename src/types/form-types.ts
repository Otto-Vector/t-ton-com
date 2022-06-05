// на валидаторы для форм
export type ValidateType = undefined | ( ( val: string ) => string | undefined )
export type ParserType = undefined | ( ( val: string | undefined ) => string )
// на поля для форм
type DefaultFormType = string | undefined

// на форму авторизации
export type phoneSubmitType<T = DefaultFormType> = {
    innNumber: T
    phoneNumber: T
    sms: T
}

// на форму с реквизитами
export type CompanyRequisitesType<T = DefaultFormType> = {
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    taxMode: T // Вид налогов
    kpp: T // КПП
    ogrn: T // ОГРН
    okpo: T // бюджет??
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
}
// на форму с реквизитами *//


// на сотрудника
export type EmployeesCardType<T = DefaultFormType> = {
    id: number // идентификатор
    employeeFIO: T // ФИО сотрудника
    employeePhoneNumber: T // Телефон сотрудника
    passportSerial: T // Серия, № паспорта
    passportImage: T // Скан паспорта
    passportFMS: T // Кем выдан паспорт
    passportDate: T // Когда выдан
    drivingLicenseNumber: T // Номер водительского удостоверения
    drivingLicenseImage: T // Скан водительского удостоверения
    drivingCategory: T // Водительские категории
    personnelNumber: T // Табельный номер
    garageNumber: T // Гаражный номер
    mechanicFIO: T // ФИО механика
    dispatcherFIO: T // ФИО диспетчера
    photoFace: T // Добавить фотографию сотрудника
    rating: T // Рейтинг
}

// на грузоПОЛУЧАТЕЛЯ
export type ConsigneesCardType<T = DefaultFormType> = {
    id: number // идентификатор
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
    id: number // идентификатор
    title: T // укороченное название
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    kpp: T // КПП
    ogrn: T // ОГРН
    address: T // Юридический адрес
    shipperFio: T // ФИО отправителя
    shipperTel: T // Телефон отправителя
    description: T // Доп. данные для ТТН
    coordinates: T // Местоположение в координатах
    city: T // город (присваивается автоматически)
}

/////////////////////////////////////////////////////////////////////////////
export const cargoTypeType = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ] as const
export type CargoType = typeof cargoTypeType[number]

export const propertyRights = [ 'Собственность', 'Аренда', 'Лизинг' ] as const
export type PropertyRightsType = typeof propertyRights[number]

// на транспорт
export type TransportCardType<T = DefaultFormType> = {
    id: number // идентификатор
    transportNumber: T // Гос. номер авто
    transportTrademark: T // Марка авто
    transportModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRightsType // Право собственности
    transportImage: T // Фото транспорта
}

// на прицеп
export type TrailerCardType<T = DefaultFormType> = {
    id: number // идентификатор
    trailerNumber: T // Гос. номер авто
    trailerTrademark: T // Марка авто
    trailerModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRightsType // Право собственности
    trailerImage: T // Фото транспорта
}

// на добавление водителя
export type AddDriverCardType<T = DefaultFormType> = {
    driverFIO: T, // фио водителя (из карточки водителя)
    driverTransport: T, // транспорт (из карточки транспорт)
    driverTrailer: T, // прицеп (из карточки прицеп)
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
    cargoType: undefined | CargoType, // тип груза
    customer: undefined | number, // заказчик
    shipper: undefined | number, // грузоотправитель
    consignee: undefined | number, // грузополучатель
    carrier: undefined | number, // перевозчик
    driver: undefined | number, // водитель
    distance: undefined | number, // расстояние
    note: undefined | string, // примечание
    answers: number[] | undefined // количество ответов от водителей // что-то вроде массива с айдишками
    driverPrice: number | undefined // стоимость перевозки
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
