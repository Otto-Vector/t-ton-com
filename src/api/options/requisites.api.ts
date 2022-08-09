import {InfoResponseType, instanceBack} from '../back-instance.api';

export type PersonalResponseType = {
    idUser: string,
    // innNumber: string,
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
    mechanicFIO: string,
    dispatcherFIO: string,
}

export const requisitesApi = {

    // отправка запроса на данные пользователя
    getPersonalDataList() {
        return instanceBack.get<PersonalResponseType>('/api/personality/')
            .then(response => response.data)
    },
    // добавление персональных данных
    setPersonalData( requisites: PersonalResponseType ) {
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
    changePersonalData( requisites: PersonalResponseType ) {
        return instanceBack.put<InfoResponseType>('/api/personality/', requisites)
            .then(response => response.data)
    },
}
