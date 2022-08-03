import {InfoResponseType, instanceBack} from './back-instance.api';


export type ConsigneesApiType = {
    idUser: string
    idSender: string
    title: string
    innNumber: string
    organizationName: string
    kpp: string
    ogrn: string
    address: string
    consigneeFio: string
    consigneeTel: string
    description: string
    coordinates: string
    city: string
}

export type CreateConsigneesApiType = Omit<ConsigneesApiType, 'idSender'>


export const consigneesApi = {

    // запрос списка всех грузополучателей
    getAllConsignees() {
        return instanceBack.get<ConsigneesApiType[]>('/api/recipient/')
            .then(response => response.data)
    },
    // запрос на одного выбранного грузополучателя
    getOneConsigneeById( { idSender }: { idSender: string } ) {
        return instanceBack.patch<InfoResponseType | ConsigneesApiType[]>('/api/recipient/', { idSender })
            .then(response => response.data)
    },
    // создать одного грузополучателя
    createOneConsignee( requestData: CreateConsigneesApiType ) {
        return instanceBack.post<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного грузополучателя
    modifyOneConsignee( requestData: ConsigneesApiType ) {
        return instanceBack.put<InfoResponseType>('/api/recipient/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ одного грузополучателя
    deleteOneConsignee( { idSender }: { idSender: string } ) {
        return instanceBack.put<InfoResponseType>('/api/recipient/', { idSender })
            .then(response => response.data)
    },
}

