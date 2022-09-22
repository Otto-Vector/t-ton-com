import {InfoResponseType, instanceBack} from '../back-instance.api';
import {OneRequestApiType} from '../../types/form-types';


export const oneRequestApi = {

    // запрос списка ВСЕХ Заявок GET /api/onerequesttype/
    getAllRequests() {
        return instanceBack.get<OneRequestApiType[]>('/api/onerequesttype/')
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },
    // запрос на одну Заявку PATCH /api/onerequesttype/
    getOneRequestById( { requestNumber }: { requestNumber: number } ) {
        return instanceBack.patch<OneRequestApiType[]>('/api/onerequesttype/', { requestNumber })
            .then(response => response.data)
        // 1.	Code 200, Models: OneRequestApiType[]
        // 2.	Code 520, {"message":"Error"}
    },
    // создать одну Заявку POST /api/onerequesttype/
    createOneRequest( { idUserCustomer }: { idUserCustomer: string } ) {
        return instanceBack.post<{ success: string, Number: string, Date: string, message?: string }>('/api/onerequesttype/', { idUserCustomer })
            .then(response => response.data)
        // 1.	Code 200, {"success": "OneRequestType '{}' created successfully".format(new_Request. requestNumber),
        // "Number": new_Request.requestNumber,
        // "Date": new_Request.requestDate }
        // 2.	Code 520, {"message":"Error"}
    },
    // ИЗМЕНИТЬ одну Заявку PUT /api/onerequesttype/
    modifyOneRequest( responseToRequest: OneRequestApiType ) {
        return instanceBack.put<InfoResponseType>('/api/onerequesttype/', responseToRequest)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "OneRequestType is not updated"}
        // 2.	Code 200, {"success": "OneRequestType '{}' updated successfully".format(OneRequestApiType_saved.responseId)}
    },
    // УДАЛИТЬ одну Заявку DELETE /api/onerequesttype/
    deleteOneRequest( requestNumber: string ) {
        return instanceBack.delete<InfoResponseType>('/api/onerequesttype/', { data: { requestNumber } })
            .then(response => response.data)
        // 1.	Code 200, {"message": "OneRequestType with id `{}` has been deleted.".format(request.data['requestNumber'])}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}

