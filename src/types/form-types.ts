// на валидаторы для форм
export type ValidateType = undefined | ( ( val: string ) => string | undefined )
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
}

/////////////////////////////////////////////////////////////////////////////
export const cargoType = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ] as const
export type CargoType = typeof cargoType[number]

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

export type AddDriverCardType<T = DefaultFormType> = {
    driverFIO: T,
    driverTransport: T,
    driverTrailer: T,
    driverStavka: T,
    driverSumm: T,
    driverRating: T,
    driverTax: T,
    driverPhoto: T,
    driverTransportPhoto: T,
    driverTrailerPhoto: T,
}