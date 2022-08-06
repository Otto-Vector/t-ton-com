import {InfoResponseType, instanceBack} from '../back-instance.api';


export type TransportApiType = {
    idUser: string
    idTransport: string
    transportNumber: string
    transportTrademark: string
    transportModel: string
    pts: string
    dopog: string
    cargoType: string
    cargoWeight: string
    propertyRights: string
    transportImage: string
}

export type CreateTransportApiType = Omit<TransportApiType, 'idTransport'>


export const transportApi = {

    // запрос списка ТРАНСПОРТА
    getAllTransport() {
        return instanceBack.get<TransportApiType[]>('/api/transport/')
            .then(response => response.data)
    },
    // запрос списка всего ТРАНСПОРТА созданного данным пользователем
    getAllTransportByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<TransportApiType[]>('/api/transportuser/', { ...idUser })
            .then(response => response.data)
    },
    // запрос на один ТРАНСПОРТ
    getOneTranstportById( { idTransport }: { idTransport: string } ) {
        return instanceBack.patch<InfoResponseType | TransportApiType[]>('/api/transport/', { idTransport })
            .then(response => response.data)
    },
    // создать один ТРАНСПОРТ
    createOneTranstport( requestData: CreateTransportApiType ) {
        return instanceBack.post<InfoResponseType>('/api/transport/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ТРАНСПОРТ
    modifyOneTranstport( {transportImage,...requestData}: TransportApiType ) {
        return instanceBack.put<InfoResponseType>('/api/transport/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ один ТРАНСПОРТ
    deleteOneTranstport( { idTransport }: { idTransport: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/transport/', { data: { idTransport } })
            .then(response => response.data)
    },
}

