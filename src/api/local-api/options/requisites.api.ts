import {InfoResponseType, instanceBack} from '../back-instance.api';
import {CompanyRequisitesApiType} from '../../../types/form-types';
import {ExactlyOne} from '../../../types/ts-utils'


export const requisitesApi = {

    // отправка запроса на данные ВСЕХ пользователей • GET /api/personality/
    getPersonalDataList() {
        return instanceBack.get<InfoResponseType & CompanyRequisitesApiType[]>('/api/personality/')
            .then(response => response.data)
        // 1.	code 200, models: PersonalResponseType
        // 2.	code 520, {"message": "Error"}
    },

    // добавление персональных данных • POST/api/personality/
    // СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ, но он [пользователь] возможно не будет работать ;)
    setPersonalData( requisites: CompanyRequisitesApiType ) {
        return instanceBack.post<InfoResponseType>('/api/personality/', requisites)
            .then(response => response.data)
        // 1.	code 200, {"success": "Personals '{}' created successfully".format(new_user.phone)}
        // 2.	code 422, {'failed':'Пользователь уже создан'}
        // 3.	code 520, {"message": "Error"}
    },

    // запрос данных по Id пользователя • PATCH /api/personality/
    // один id или через запятую без пробелов (innNumber - аналогично)
    getPersonalDataFromId( idUser: ExactlyOne<{ idUser: string , innNumber: string}> ) {
        return instanceBack.patch<InfoResponseType & CompanyRequisitesApiType[]>('/api/personality/', idUser)
            .then(response => response.data)
        // 1.	code 200, models: PersonalResponseType
        // 2.	code 520, {"message": "Error"}
    },

    // изменение персональных данных • PUT /api/personality/
    changePersonalData( requisites: CompanyRequisitesApiType ) {
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
