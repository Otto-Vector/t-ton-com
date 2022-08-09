import {InfoResponseType, instanceBack} from './back-instance.api';

export type CargoRequestType = {
    text: string,
}


export const cargoEditableSelectorApi = {
    // отправка запроса на список GET /api/cargo/
    getCargoComposition() {
        return instanceBack.get<InfoResponseType>('/api/cargo/')
            .then(response => response.data)
            // 1.	Code 200, Models: { "text": "string" }
            // 2.	Code 520, {"message":"Error"}
    },

    // создать список заново POST /api/cargo/
    createCargoComposition( { text }: CargoRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/cargo/', { text })
            .then(response => response.data)
            // 1.	Code 200, {"success": "Запись создана"}
            // 2.	Code 520, {"message":"Error"}
    },

    // изменить список PUT /api/cargo/
    modifyCargoComposition( { text }: CargoRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/cargo/', { text })
            .then(response => response.data)
            // 1.	Code 200, {"success": "Список изменен"}
            // 2.	Code 449, {'failed': " Trailer is not updated"}
    },

    // удалить список DELETE /api/cargo/
    deleteCargoCompositon( { text }: CargoRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/cargo/', { text })
            .then(response => response.data)
            // 1.	Code 200, {"success": "Список удалён"}
            // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}