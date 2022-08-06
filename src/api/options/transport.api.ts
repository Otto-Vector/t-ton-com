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
    createOneTranstport( requestData: CreateTransportApiType, image: File | undefined ) {
        return instanceBack.post<InfoResponseType>('/api/transport/', { ...requestData, transportImage: image })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ТРАНСПОРТ
    modifyOneTranstport( { transportImage, ...requestData }: TransportApiType, image: File | undefined ) {
        let formData = new FormData();
        formData.append('idUser', requestData.idUser);
        formData.append('transportNumber', requestData.transportNumber);
        formData.append('transportTrademark', requestData.transportTrademark);
        formData.append('transportModel', requestData.transportModel);
        formData.append('pts', requestData.pts);
        formData.append('dopog', requestData.dopog);
        formData.append('cargoType', requestData.cargoType);
        formData.append('propertyRights', requestData.propertyRights);
        formData.append('cargoWeight', requestData.cargoWeight);
        if (image) {
            formData.append('transportImage', image);
        }

        // debugger
        // formData.append("image", fs.createReadStream(URL.createObjectURL(image)));
        // console.log('form:', formData.get('transportImage'))
        // console.log('file:', image)
        return instanceBack.put<InfoResponseType>('/api/transport/', formData
            // { ...requestData, formData }
        )
            .then(response => response.data)
    },
    // УДАЛИТЬ один ТРАНСПОРТ
    deleteOneTranstport( { idTransport }: { idTransport: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/transport/', { data: { idTransport } })
            .then(response => response.data)
    },
}

