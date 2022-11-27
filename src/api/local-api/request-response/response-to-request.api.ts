import {InfoResponseType, instanceBack} from '../back-instance.api';
import {ResponseToRequestCardType} from '../../../types/form-types';


export type addResponseToRequestType = { requestNumber: string, responseId: string }

export const responseToRequestApi = {

    // запрос списка ВСЕХ Ответов на Заявки GET /api/responsetorequestcardtype/
    getAllResponseToRequests() {
        return instanceBack.get<ResponseToRequestCardType[]>('/api/responsetorequestcardtype/')
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на один Ответ на Заявку PATCH /api/responsetorequestcardtype/
    getOneResponseToRequestById( requestId: { requestId: string } ) {
        return instanceBack.patch<InfoResponseType | ResponseToRequestCardType[]>('/api/responsetorequestcardtype/', requestId)
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать один Ответ на Заявку POST /api/responsetorequestcardtype/
    createOneResponseToRequest( { responseId, ...responseToRequest }: ResponseToRequestCardType ) {
        return instanceBack.post<InfoResponseType>('/api/responsetorequestcardtype/', responseToRequest)
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
    deleteOneResponseToRequest( responseId: string ) {
        return instanceBack.delete<InfoResponseType>('/api/responsetorequestcardtype/', { data: { responseId } })
            .then(response => response.data)
        // 1.	Code 200, {"message": "ResponseToRequestCardType with id `{}` has been deleted.".format(request.data['responseId'])}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },

    // ПРИВЯЗАТЬ Ответ к заявке PUT /api/onerequesttyperesponses/
    // (изменяет поле answers в OneRequestApiType)
    addReponseToRequest( addReponseToRequest: addResponseToRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/onerequesttyperesponses/', addReponseToRequest)
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200, {'message': 'Ответ '+str(request.data['responseId'])+' прикреплен к заявке ' + str(request.data['requestNumber'])}
        // 3.	Code 400, {'message':'Удалить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"}
    },

    // отВЯЗАТЬ Ответ от заявки DELETE /api/onerequesttyperesponses/
    // (изменяет поле answers в OneRequestApiType)
    removeReponseFromRequest( removeReponseFromRequest: addResponseToRequestType ) {
        return instanceBack.delete<InfoResponseType>('/api/onerequesttyperesponses/', { data: removeReponseFromRequest })
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200 {'message': 'Ответ '+request.data['responseId']+' откреплен от заявки ' + request.data['requestNumber']}
        // 3.	Code 400, {'message':'Удалить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"}
    },
}

