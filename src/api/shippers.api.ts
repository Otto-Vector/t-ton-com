import {InfoResponseType, instanceBack} from './back-instance.api';


export type ShippersApiType = {
    idUser: string
    idSender: string
    title: string
    innNumber: string
    organizationName: string
    kpp: string
    ogrn: string
    address: string
    shipperFio: string
    shipperTel: string
    description: string
    coordinates: string
    city: string
}

export type CreateShippersApiType = Omit<ShippersApiType, 'idSender'>


export const shippersApi = {

    // запрос списка всех грузоотправителей
    getAllShippers() {
        return instanceBack.get<ShippersApiType[]>('/api/sender/')
            .then(response => response.data)
    },
    // запрос на одного выбранного грузоотправителя
    getOneShipperById( { idSender }: { idSender: string } ) {
        return instanceBack.patch<InfoResponseType | ShippersApiType[]>('/api/sender/', { idSender })
            .then(response => response.data)
    },
    // создать одного грузоотправителя
    createOneShipper( requestData: CreateShippersApiType ) {
        return instanceBack.post<InfoResponseType>('/api/sender/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ одного грузоотправителя
    modifyOneShipper( requestData: ShippersApiType ) {
        return instanceBack.put<InfoResponseType>('/api/sender/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ одного грузоотправителя
    deleteOneShipper( { idSender }: { idSender: string } ) {
        return instanceBack.put<InfoResponseType>('/api/sender/', { idSender })
            .then(response => response.data)
    },
}

