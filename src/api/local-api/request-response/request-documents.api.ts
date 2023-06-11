import {InfoResponseType, instanceBack} from '../back-instance.api'


// документы для работы с заявкой
export const requestDocumentsApi = {
    // загрузка доп.документов на груз PUT /api/loadcargo/
    getLoadCargo( { requestNumber, cargoDocuments }: { requestNumber: number, cargoDocuments: File } ) {
        const formData = new FormData()
        formData.append('requestNumber', requestNumber + '')
        formData.append('cargoDocuments', cargoDocuments)

        return instanceBack.put<InfoResponseType>('/api/loadcargo/', formData)
            .then(response => response.data)
        // 1.	Code 200, {"message": "Изменения применены."}
        // 2.	Code 400, {'message': 'Вес файла составляет больше 5-ти МБ'}
    },
    // запрос на создание документа "Доверенность Водителю" PATCH /api/generateDriverLis/
    createDriverList( { requestNumber, validUntil = 30 }: {
        requestNumber: number,
        // доверенность действительна столько-то дней (по умолчанию = 30)
        validUntil?: number
    } ) {

        return instanceBack.patch<InfoResponseType>('/api/generateDriverLis/', { requestNumber, validUntil })
            .then(response => response.data)
        // 1.	Code 200, {"message": "Документ ДОВЕРЕННОСТЬ НА ВОДИТЕЛЯ сгенерирован."}
        // 2.	Code 401, {'message': 'Заявка номер ${requestNumber} не существует'}
    },
    // запрос на создание документа "УПД от Перевозчика для Закзчика"
    createUPDdocument( { requestNumber }: { requestNumber: number } ) {

        return instanceBack.patch<InfoResponseType>('/api/generateUPDdoc/', { requestNumber })
            .then(response => response.data)
        // 1.	Code 200, { "message": "Документ УПД от Перевозчика для Заказчика сгенерирован.",
        //                      "url": "https://server.t-ton.com/temp_documents/*********.pdf" }
        // 2.	Code 401, {'message': 'Заявка номер ${requestNumber} не существует'}
    },
}
