import {InfoResponseType, instanceBack} from '../back-instance.api';
import {ResponseToRequestCardType} from '../../types/form-types';


export const responseToRequestApi = {

    // запрос списка ВСЕХ Ответов на Заявки GET /api/responsetorequestcardtype/
    getAllResponseToRequests() {
        return instanceBack.get<ResponseToRequestCardType[]>('/api/responsetorequestcardtype/')
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },
    // запрос на один Ответ на Заявку PATCH /api/responsetorequestcardtype/
    getOneResponseToRequestById( { requestId }: { requestId: string } ) {
        return instanceBack.patch<InfoResponseType | ResponseToRequestCardType[]>('/api/responsetorequestcardtype/', { requestId })
            .then(response => response.data)
        // 1.	Code 200, Models: ResponseToRequestCardType[]
        // 2.	Code 520, {"message":"Error"}
    },
    // создать один Ответ на Заявку POST /api/responsetorequestcardtype/
    createOneResponseToRequest( { responseId, ...responseToRequest} : ResponseToRequestCardType) {
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
}

