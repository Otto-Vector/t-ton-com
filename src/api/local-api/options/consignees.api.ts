import {InfoResponseType, instanceBack} from '../back-instance.api';


export type ConsigneesApiType = {
    idUser: string
    idRecipient: string
    title: string
    innNumber: string
    organizationName: string
    kpp: string
    ogrn: string
    address: string
    consigneesFio: string
    consigneesTel: string
    description: string
    coordinates: string
    city: string
}


export const consigneesApi = {

    // запрос списка ВСЕХ грузополучателей сервера GET /api/recipient/
    getAllConsignees() {
        return instanceBack.get<ConsigneesApiType[]>('/api/recipient/')
            .then(response => response.data)
        // 1.  Code 200, Models: ConsigneesApiType[]
        // 2.  Code 520, {"message":"Error"}

    },

    // запрос списка всех грузополучателей созданных данным пользователем PATCH /api/recipientuser/
    getAllConsigneesByUserId( { idUser }: { idUser: string } ) {
        return instanceBack.patch<InfoResponseType & ConsigneesApiType[]>('/api/recipientuser/', { idUser })
            .then(response => response.data)
        // 1.	Code 200, models: ConsigneesApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на одного выбранного грузополучателя PATCH /api/recipient/
    getOneConsigneeById( { idRecipient }: { idRecipient: string } ) {
        return instanceBack.patch<InfoResponseType & ConsigneesApiType[]>('/api/recipient/', { idRecipient })
            .then(response => response.data)
        // 1.	Code 200, models: ConsigneesApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать одного грузополучателя POST /api/recipient/
    createOneConsignee( { idRecipient, ...requestData }: ConsigneesApiType ) {
        return instanceBack.post<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
        // 1.	Code 422, {'failed': 'Объект с данным заголовком уже существует, измените название заголовка'}
        // 2.	Code 200, {"success": "Recipients'{}' created successfully".format(new_Recipient. idRecipient)}
        // 3.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ одного грузополучателя PUT /api/recipient/
    modifyOneConsignee( requestData: ConsigneesApiType ) {
        return instanceBack.put<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
        // 1.	Code 449, {'failed': " Recipient is not updated"}
        // 2.	Code 200, "success": "Recipient '{}' updated successfully".format(Recipient_saved.idRecipient)
    },

    // УДАЛИТЬ одного грузополучателя DELETE /api/recipient/
    deleteOneConsignee( { idRecipient }: { idRecipient: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/recipient/', { data: { idRecipient } })
            .then(response => response.data)
        // 1.	Code 200, {"message": "Recipient with id `{}` has been deleted.".format(request.data['idRecipient']}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}

