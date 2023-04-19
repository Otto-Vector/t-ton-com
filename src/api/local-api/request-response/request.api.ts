import {InfoResponseType, instanceBack} from '../back-instance.api'
import {OneRequestApiType} from '../../../types/form-types'


export const oneRequestApi = {

    // запрос списка ВСЕХ Заявок GET /api/onerequesttype/
    getAllRequests() {
        return instanceBack.get<OneRequestApiType[]>('/api/onerequesttype/')
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос списка всех заявок созданных данным пользователем PATCH /api/onerequesttypeuser/
    getAllRequestByUser( idUserCustomer: { idUserCustomer: string } ) {
        return instanceBack.patch<OneRequestApiType[]>('/api/onerequesttypeuser/', idUserCustomer)
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос списка заявок начиная от такой-то даты (включительно) PATCH /api/onerequesttypedate/
    getAllRequestByDate( shipmentDate: { shipmentDate: string } ) {
        return instanceBack.patch<OneRequestApiType[]>('/api/onerequesttypedate/', shipmentDate)
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на одну Заявку PATCH /api/onerequesttype/
    getOneRequestById( requestNumber: { requestNumber: number } ) {
        return instanceBack.patch<InfoResponseType & OneRequestApiType[]>('/api/onerequesttype/', requestNumber)
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать одну Заявку POST /api/onerequesttype/
    createOneRequest( idUserCustomer: { idUserCustomer: string } ) {
        return instanceBack.post<{ success: string, Number: string, Date: string, message?: string }>('/api/onerequesttype/', idUserCustomer)
            .then(response => response.data)
        // 1.	Code 200, {
        //          "success": "OneRequestType '{}' created successfully".format(new_Request. requestNumber),
        //          "Number": new_Request.requestNumber,
        //          "Date": new_Request.requestDate
        //      }
        // 2.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ одну Заявку PUT /api/onerequesttype/
    modifyOneRequest( modifiedRequest: Partial<OneRequestApiType> & { requestNumber: string } ) {
        return instanceBack.put<InfoResponseType>('/api/onerequesttype/', modifiedRequest)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "OneRequestType is not updated"}
        // 2.	Code 200, {"success": "OneRequestType '{}' updated successfully".format(OneRequestApiType_saved.responseId)}
        // 3.   Code 404, {"detail": "Not found."}
    },

    // УДАЛИТЬ одну Заявку DELETE /api/onerequesttype/
    deleteOneRequest( requestNumber: { requestNumber: number } ) {
        return instanceBack.delete<InfoResponseType>('/api/onerequesttype/', { data: requestNumber })
            .then(response => response.data)
        // 1.	Code 200, {"message": "OneRequestType with id `{}` has been deleted.".format(request.data['requestNumber'])}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },

    /*-----------------------------------------------*/

    // ДОБАВИТЬ доступ пользователя к Заявке PUT /api/onerequesttypeacceptuser/
    // (изменяет поле acceptedUsers в OneRequestApiType)
    addOneUserAcceptRequest( userToRequest: { requestNumber: string, idUser: string } ) {
        return instanceBack.put<InfoResponseType>('/api/onerequesttypeacceptuser/', userToRequest)
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200, {'message': 'Пользователю '+request.data['idUser']+' предоставлен доступ к просмотру заявки ' + request.data['requestNumber']}
        // 3.	Code 400, {'message':'Добавить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"} // также возвращает его если id не существует

    },

    // УДАЛИТЬ доступ пользователя к Заявке DELETE /api/onerequesttypeacceptuser/
    // (изменяет поле acceptedUsers в OneRequestApiType)
    deleteOneUserAcceptRequest( userDeleteFromRequest: { requestNumber: number, idUser: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/onerequesttypeacceptuser/', { data: userDeleteFromRequest })
            .then(response => response.data)
        // 1.	Code 200, {'message': 'Error, login please'}
        // 2.	Code 200 {'message': 'Пользователю '+request.data['idUser']+' закрыт доступ к просмотру заявки ' + request.data['requestNumber']}
        // 3.	Code 400, {'message':'Удалить не удалось,  Заявка № '+str(request.data['requestNumber'])+' не существует'}
        // 4.	Code 520, {"message":"Error"} // также возвращает его если id не существует

    },
}
