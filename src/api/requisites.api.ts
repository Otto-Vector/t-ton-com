import {InfoResponseType, instanceBack} from './back-instance.api';

export type PersonalResponseType = {
    idUser: string | undefined,
    innNumber: string | undefined,
    nnNumber: string | undefined,
    organizationName: string,
    taxMode: string | undefined | null,
    kpp: string | undefined,
    ogrn: string | undefined,
    okpo: string | undefined,
    legalAddress: string | undefined,
    description: string | undefined,
    postAddress: string | undefined,
    phoneDirector: string | undefined,
    phoneAccountant: string | undefined,
    email: string | undefined,
    bikBank: string | undefined,
    nameBank: string | undefined,
    checkingAccount: string | undefined,
    korrAccount: string | undefined,
    is_staff: boolean | undefined,
    is_active: boolean | undefined,
    phone: string | undefined,
    phoneCode: string | undefined,
    phoneValidate: boolean | undefined,
    password: string | undefined,
    role: string | undefined,
    cash: string | undefined,
    requestActiveCount: string | undefined,
    maxRequests: string | undefined,
    tarifCreate: string | undefined,
    tarifAcceptShortRoute: string | undefined,
    tarifAcceptLongRoute: string | undefined,
    tarifPaySafeTax: string | undefined,
}

export const requisitesApi = {

    // отправка запроса на данные пользователя
    getPersonalAuthData() {
        return instanceBack.post<{ userid?: string, message?: string }>('/api/me/', {})
            .then(response => response.data)
    },
    // отправка запроса на данные пользователя
    getPersonalDataList() {
        return instanceBack.get<PersonalResponseType>('/api/personality/')
            .then(response => response.data)
    },
    // добавление персональных данных
    setPersonalData(requisites: PersonalResponseType) {
        return instanceBack.post<InfoResponseType>
        ('/api/personality/', requisites)
            .then(response => response.data)
    },
    // запрос данных по Id пользователя
    getPersonalDataFromId( { idUser }: { idUser: string } ) {
        return instanceBack.patch<PersonalResponseType[]>('/api/personality/', { idUser })
            .then(response => response.data)
    },
    // изменение персональных данных
    changePersonalData(requisites: PersonalResponseType) {
        return instanceBack.put<InfoResponseType>('/api/personality/', requisites)
            .then(response => response.data)
    },
}
