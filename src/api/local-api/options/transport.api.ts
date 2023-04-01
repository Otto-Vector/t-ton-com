import {InfoResponseType, instanceBack} from '../back-instance.api';
import {TransportApiType} from '../../../types/form-types';

export const transportApi = {

    // запрос ВСЕГО списка ТРАНСПОРТА • GET /api/transport/
    getAllTransport() {
        return instanceBack.get<TransportApiType[]>('/api/transport/')
            .then(response => response.data)
        // 1.	Code 200, Models: TransportApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос списка всего ТРАНСПОРТА созданного ДАННЫМ пользователем • PATCH /api/transportuser/
    getAllTransportByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<InfoResponseType & TransportApiType[]>('/api/transportuser/', idUser)
            .then(response => response.data)
        // 1.	Code 200, Models: TransportApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на один ТРАНСПОРТ • PATCH /api/transport/
    // один id или через запятую без пробелов
    getOneOrMoreTransportById( idTransport: { idTransport: string } ) {
        return instanceBack.patch<InfoResponseType & TransportApiType[]>('/api/transport/', idTransport)
            .then(response => response.data)
        // 1.	Code 200, Models: TransportApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать один ТРАНСПОРТ • POST /api/transport/
    createOneTransport( { idTransport, transportImage, ...requestData }: TransportApiType, image: File | undefined ) {
        let formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('transportImage', image, 'transportImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/transport/', formData)
            .then(response => response.data)
        // 1.	Code 422, {'failed': Транспорт уже создан'}
        // 2.	Code 200, {"success": "Transport '{}' created successfully".format(new_Transport.idTransport)}
        // 3.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ один ТРАНСПОРТ • PUT /api/transport/
    modifyOneTransport( { transportImage, ...requestData }: TransportApiType, image: File | undefined ) {
        let formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('transportImage', image, 'transportImage.jpg')
        }
        return instanceBack.put<InfoResponseType>('/api/transport/', formData)
            .then(response => response.data)
        // 1.	Code 449, {'failed': " Transport is not updated"}
        // 2.	Code 200, "success": "Transport {}' updated successfully".format(Transport _saved.idTransport)

    },

    // УДАЛИТЬ один ТРАНСПОРТ • DELETE /api/transport/
    deleteOneTransport( idTransport: { idTransport: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/transport/', { data: idTransport })
            .then(response => response.data)
        // 1.	Code 200, {"message": "Transport with id `{}` has been deleted.".format(request.data['idTransport]}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}
