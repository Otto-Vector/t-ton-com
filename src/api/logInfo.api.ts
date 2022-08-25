import {InfoResponseType, instanceBack} from './back-instance.api';

export type LogInfoRequestType = {
    idLog: string,
    idUser: string,
    idObject: string,
    typeObject: string,
    Message: string,
    Time: string
}


export const logInfoApi = {

    //Запрос всего списка логов GET /api/logs/
    getLogInfo() {
        return instanceBack.get<InfoResponseType & LogInfoRequestType>('/api/logs/')
            .then(response => response.data)
        // 1.	Code 200, Models: LogInfoRequestType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос логов пользователя PATCH /api/logs/
    getLogInfoByIdUser( idUser: { idUser: string } ) {
        // список отправляется сплошным текстом, разделённый знаком '|'
        return instanceBack.patch<LogInfoRequestType[]>('/api/logs/', { ...idUser })
            .then(response => response.data)
        // 1.	Code 200, Models: LogInfoRequestType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать запись POST /api/logs/
    addOneInfoLog( { idLog, Time, ...addInfoLog }: LogInfoRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/logs/', addInfoLog)
            .then(response => response.data)
        // 1.	Code 200, {"success": "Log '{}' created successfully".format(new_Log.idLog)}
        // 2.	Code 520, {"message":"Error"}
    },

    // изменить одну запись PUT /api/logs/
    modifyOneInfoLog( { Time, ...changeInfoLog }: LogInfoRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/logs/', changeInfoLog)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "Log is not updated"}
        // 2.	Code 200, {"success": "Log '{}' updated successfully".format(Logs_saved.idLog)}
    },

    // удалить ВЕСЬ список DELETE /api/cargo/
    deleteOneInfoLog( idLog: { idLog: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/logs/', { data: idLog })
            .then(response => response.data)
        // 1. Code 200, {"message": "Log with id `{}` has been deleted.".format(request.data['idLog'])}
        // 2. Code 449, {'error':'Неправильно указаны аргументы'}
    },
}