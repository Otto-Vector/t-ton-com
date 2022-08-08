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

    // запрос списка всех грузополучателей
    getAllConsignees() {
        return instanceBack.get<ConsigneesApiType[]>('/api/recipient/')
            .then(response => response.data)
    },
    // запрос списка всех грузополучателей созданных данным пользователем
    getAllConsigneesByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<ConsigneesApiType[]>('/api/recipientuser/', { ...idUser })
            .then(response => response.data)
    },
    // запрос на одного выбранного грузополучателя
    getOneConsigneeById( { idRecipient }: { idRecipient: string } ) {
        return instanceBack.patch<InfoResponseType | ConsigneesApiType[]>('/api/recipient/', { idRecipient })
            .then(response => response.data)
    },
    // создать одного грузополучателя
    createOneConsignee( {idRecipient, ...requestData}: ConsigneesApiType ) {
        return instanceBack.post<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного грузополучателя
    modifyOneConsignee( requestData: ConsigneesApiType ) {
        return instanceBack.put<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ одного грузополучателя
    deleteOneConsignee( { idRecipient }: { idRecipient: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/recipient/', { data: { idRecipient } })
            .then(response => response.data)
    },
}
