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
    getOneTransportById( { idTransport }: { idTransport: string } ) {
        return instanceBack.patch<InfoResponseType | TransportApiType[]>('/api/transport/', { idTransport })
            .then(response => response.data)
    },
    // создать один ТРАНСПОРТ
    createOneTransport( { idTransport, transportImage, ...requestData }: TransportApiType, image: File | undefined ) {
        let formData = new FormData()
        for (let [ key, value ] of Object.entries(requestData)) {
            formData.append(key, value)
        }
        if (image) {
            formData.append('transportImage', image, 'transportImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/transport/', formData)
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ТРАНСПОРТ
    modifyOneTransport( { transportImage, ...requestData }: TransportApiType, image: File | undefined ) {
        let formData = new FormData()
        for (let [ key, value ] of Object.entries(requestData)) {
            formData.append(key, value)
        }
        if (image) {
            formData.append('transportImage', image, 'transportImage.jpg')
        }
        return instanceBack.put<InfoResponseType>('/api/transport/', formData)
            .then(response => response.data)
    },
    // УДАЛИТЬ один ТРАНСПОРТ
    deleteOneTransport( { idTransport }: { idTransport: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/transport/', { data: { idTransport } })
            .then(response => response.data)
    },
}

