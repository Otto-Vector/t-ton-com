import {InfoResponseType, instanceBack} from './back-instance.api';

export type CargoRequestType = {
    id: number,
    text: string,
}[]


export const cargoEditableSelectorApi = {
    // отправка запроса на список GET /api/cargo/
    getCargoComposition() {
        return instanceBack.get<InfoResponseType & CargoRequestType>('/api/cargo/')
            .then(response => response.data)
        // 1.	Code 200, Models: { "text": "string" }
        // 2.	Code 520, {"message":"Error"}
    },

    // создать список заново PUT /api/cargo/
    createCargoComposition( allPositionsInText: string ) {
        // список отправляется сплошным текстом, разделённый знаком '|'
        return instanceBack.put<InfoResponseType>('/api/cargo/', { text: allPositionsInText })
            .then(response => response.data)
        // 1.	Code 200, {"success": "Запись создана"}
        // 2.	Code 520, {"message":"Error"}
    },

    // изменить список POST /api/cargo/
    addOneCargoComposition( oneAddedPosition: string ) {
        return instanceBack.post<InfoResponseType>('/api/cargo/', { text: oneAddedPosition })
            .then(response => response.data)
        // 1.	Code 200, {"success": "Список изменен"}
        // 2.	Code 449, {'failed': " Trailer is not updated"}
    },

    // удалить ВЕСЬ список DELETE /api/cargo/
    deleteCargoCompositon() {
        return instanceBack.delete<InfoResponseType>('/api/cargo/')
            .then(response => response.data)
        // 1.	Code 200, {"success": "Список удалён"}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}