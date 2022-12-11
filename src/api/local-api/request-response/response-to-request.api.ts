import {InfoResponseType, instanceBack} from '../back-instance.api';
import {ResponseToRequestCardType} from '../../../types/form-types';
import {ExactlyOne} from '../../../types/ts-utils';

// одно обязательное поле из трёх
export type ExatlyOnOfThree = ExactlyOne<{ requestNumber: string , responseId: string , idEmployee: string }>

export const responseToRequestApi = {

    // запрос списка ВСЕХ Ответов на Заявки GET /api/responsetorequestcardtype/
    getAllResponseToRequests() {
        return instanceBack.get<ResponseToRequestCardType[]>('/api/responsetorequestcardtype/')
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на один Ответ на Заявку PATCH /api/responsetorequestcardtype/
    getOneResponseToRequest( data: ExatlyOnOfThree) {
        // самопроверка на "дурака"
        if (Object.entries(data).length > 1) {
            throw new Error('Должно быть ОДНО поле: requestNumber || responseId || idEmployee')
        }
        return instanceBack.patch<InfoResponseType | ResponseToRequestCardType[]>('/api/responsetorequestcardtype/', data)
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать один Ответ на Заявку POST /api/responsetorequestcardtype/
    createOneResponseToRequest( { responseId, ...responseToRequest }: ResponseToRequestCardType ) {
        return instanceBack.post<InfoResponseType & {prevResponseToRequest: string}>('/api/responsetorequestcardtype/', responseToRequest)
            .then(response => response.data)
        // 1.	Code 200, {"success": "ResponseToRequestCardType '{}' created successfully".format(new_Response.responseId)}
        // 2.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ один Ответ на Заявку PUT /api/responsetorequestcardtype/
    modifyOneResponseToRequest( responseToRequest: ResponseToRequestCardType ) {
        return instanceBack.put<InfoResponseType>('/api/responsetorequestcardtype/', responseToRequest)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "ResponseToRequestCardType is not updated"}
        // 2.	Code 200, {"success": "ResponseToRequestCardType '{}' updated successfully".format(ResponseToRequestCardType_saved.responseId)}
    },

    // УДАЛИТЬ один Ответ на Заявку DELETE /api/responsetorequestcardtype/
    // также удаляет все id-шки по списку в поле responseId чз ', '
    deleteSomeResponseToRequest( data: ExatlyOnOfThree ) {
        // самопроверка на "дурака"
        if (Object.entries(data).length > 1) {
            throw new Error('Должно быть ОДНО поле: requestNumber || responseId || idEmployee')
        }
        return instanceBack.delete<InfoResponseType>('/api/responsetorequestcardtype/', { data })
            .then(response => response.data)
        // 1.	Code 200, {"message": "ResponseToRequestCardType with id `{}` has been deleted.".format(request.data['responseId'])}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },

    /*-----------------------------------------------*/

    // ПРИВЯЗАТЬ Ответ к заявке PUT /api/onerequesttyperesponses/
    // (изменяет поле answers в OneRequestApiType)
    addReponseToRequest( addResponseToRequest: { requestNumber: string, responseId: string } ) {
        return instanceBack.put<InfoResponseType>('/api/onerequesttyperesponses/', addResponseToRequest)
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200, {'message': 'Ответ '+str(request.data['responseId'])+' прикреплен к заявке ' + str(request.data['requestNumber'])}
        // 3.	Code 400, {'message':'Удалить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"}
    },

    // отВЯЗАТЬ Ответ от заявки DELETE /api/onerequesttyperesponses/
    // (изменяет поле answers в OneRequestApiType)
    removeReponseFromRequest( removeResponseFromRequest: { requestNumber: string, responseId: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/onerequesttyperesponses/', { data: removeResponseFromRequest })
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200 {'message': 'Ответ '+request.data['responseId']+' откреплен от заявки ' + request.data['requestNumber']}
        // 3.	Code 400, {'message':'Удалить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"}
    },
}

