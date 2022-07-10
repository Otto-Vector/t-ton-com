import {InfoResponseType, instanceBack} from './back-api-data';

export type PersonalResponseType = {
    idUser: string,
    nnNumber: string,
    organizationName: string,
    taxMode: string,
    kpp: string,
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
    cash: string,
    requestActiveCount: string,
    maxRequests: string,
    tarifCreate: string,
    tarifAcceptShortRoute: string,
    tarifAcceptLongRoute: string,
    tarifPaySafeTax: string,
}

export const requisitesAPI = {

    // отправка запроса на данные пользователя
    getPersonalAuthData() {
        return instanceBack.post<PersonalResponseType>('/api/me/', {})
            .then(response => response.data)
    },
    // отправка запроса на данные пользователя
    getPersonalDataList() {
        return instanceBack.get<PersonalResponseType>('personality/')
            .then(response => response.data)
    },
    // добавление персональных данных
    setPersonalData() {
        return instanceBack.post<InfoResponseType>
        ('personality/', {} as PersonalResponseType)
            .then(response => response.data)
    },
    // запрос данных по Id пользователя
    getPersonalDataFromId() {
        return instanceBack.patch<PersonalResponseType>('personality/', { idUser: '' })
            .then(response => response.data)
    },
    // изменение персональных данных
    changePersonalData() {
        return instanceBack.put<InfoResponseType>('personality/', {} as PersonalResponseType)
            .then(response => response.data)
    },
}
