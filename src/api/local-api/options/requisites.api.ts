import {InfoResponseType, instanceBack} from '../back-instance.api';

export type PersonalResponseType = {
    idUser: string,
    innNumber: string,
    nnNumber: string,
    organizationName: string,
    taxMode: string,
    kpp?: string,
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
    cash: number,
    requestActiveCount: string,
    maxRequests: string,
    tarifCreate: string,
    tarifAcceptShortRoute: string,
    tarifAcceptLongRoute: string,
    tarifPaySafeTax: string,
    mechanicFIO?: string,
    dispatcherFIO?: string,
}

export const requisitesApi = {

    // отправка запроса на данные ВСЕХ пользователей • GET /api/personality/
    getPersonalDataList() {
        return instanceBack.get<PersonalResponseType>('/api/personality/')
            .then(response => response.data)
        // 1.	code 200, models: PersonalResponseType
        // 2.	code 520, "Error"
    },

    // добавление персональных данных • POST/api/personality/
    setPersonalData( requisites: PersonalResponseType ) {
        return instanceBack.post<InfoResponseType>('/api/personality/', requisites)
            .then(response => response.data)
        // 1.	code 200, {"success": "Personals '{}' created successfully".format(new_user.phone)}
        // 2.	code 422, {'failed':'Пользователь уже создан'}
        // 3.	code 520, "Error"
    },

    // запрос данных по Id пользователя • PATCH /api/personality/
    getPersonalDataFromId( idUser: { idUser: string } ) {
        return instanceBack.patch<InfoResponseType & PersonalResponseType[]>('/api/personality/', idUser)
            .then(response => response.data)
        // 1.	code 200, models: PersonalResponseType
        // 2.	code 520, "Error"
    },

    // изменение персональных данных • PUT /api/personality/
    changePersonalData( requisites: PersonalResponseType ) {
        return instanceBack.put<InfoResponseType>('/api/personality/', requisites)
            .then(response => response.data)
        // 1.	code 200, {"success": "Personals '{}' created successfully".format(new_user.idUser)}
        // 2.	code 449, {'failed': "Personal is not updated"}
    },

    // удаление пользователя • DELETE /api/personality/
    removePersonalData( idUser: { idUser: string } ) { // пока не нужно и думаю не пригодится
        return instanceBack.delete<InfoResponseType>('/api/personality/', { data: idUser })
            .then(response => response.data)
        // 1.	code 200, {"message": "Personals with id `{}` has been deleted.".format(request.data['idUser'])}
        // 2.	code 449, {'error':'Неправильно указаны аргументы'}
    },
}