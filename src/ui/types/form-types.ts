
// на форму с реквизитами

export type companyRequisitesType<T = string | null> = {
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    taxMode: T // Вид налогов
    kpp: T // КПП
    ogrn: T // ОГРН
    okpo: T // бюджет??
    address: T // Юридический адрес
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

// на валидаторы для форм
export type validateType = undefined | ((val: string) => string | undefined)
