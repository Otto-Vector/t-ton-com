import {InfoResponseType, instanceBack} from '../back-instance.api'


// документы для работы с заявкой
export const requestDocumentsApi = {
    // загрузка доп.документов на груз PUT /api/loadcargo/
    getLoadCargo( { requestNumber, cargoDocuments }: { requestNumber: number, cargoDocuments: File } ) {
        const formData = new FormData()
        formData.append('requestNumber', requestNumber+'')
        formData.append('cargoDocuments', cargoDocuments)

        return instanceBack.put<InfoResponseType>('/api/loadcargo/', formData)
            .then(response => response.data)
        // 1.	Code 200, {"message": "Изменения применены."}
        // 2.	Code 400, {'message': 'Вес файла составляет больше 5-ти МБ'}
    },

}
