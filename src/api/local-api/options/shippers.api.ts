import {InfoResponseType, instanceBack} from '../back-instance.api';


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

    // запрос списка ВСЕХ грузоотправителей • PATCH /api/sender/
    getAllShippers() {
        return instanceBack.get<ShippersApiType[]>('/api/sender/')
            .then(response => response.data)
        // 1.	Code 200, Models: ShippersApiType[]
        // 2.	Code 520, {"message":"Error"}
        // 3.   code 200, {"message": "Error, login please"}
    },

    // запрос списка ВСЕХ грузополучателей, созданных ДАННЫМ пользователем • PATCH /api/senderuser/
    getAllShippersByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<InfoResponseType & ShippersApiType[]>('/api/senderuser/', idUser)
            .then(response => response.data)
        // 1. code 200, Models: ShippersApiType[]
        // 2. code 200, {"message": "Error, login please"}
        // 3. code 520, {"message":"Error"}
    },

    // запрос на ОДНОГО выбранного грузоотправителя • PATCH /api/sender/
    getOneShipperById( idSender: { idSender: string } ) {
        return instanceBack.patch<InfoResponseType & ShippersApiType[]>('/api/sender/', idSender)
            .then(response => response.data)
        // 1. code 200, Models: ShippersApiType[]
        // 2. code 200, {"message": "Error, login please"}
        // 3. code 520, {"message":"Error"}
    },

    // создать одного грузоотправителя • POST /api/sender/
    createOneShipper( { idSender, ...requestData }: ShippersApiType ) {
        return instanceBack.post<InfoResponseType>('/api/sender/', requestData)
            .then(response => response.data)
        // 1.	Code 422, {'failed': Объект с данным заголовком уже существует, измените название заголовка }
        // 2.	Code 200, {"success": "Senders '{}' created successfully".format(new_Sender.idSender)}
        // 3.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ одного грузоотправителя • PUT /api/sender/
    modifyOneShipper( requestData: ShippersApiType ) {
        return instanceBack.put<InfoResponseType>('/api/sender/', requestData)
            .then(response => response.data)
        // 1.	Code 449, {'failed': "Sender is not updated"}
        // 2.	Code 200, "success": "Sender '{}' updated successfully".format(Sender_saved.idSender)}
    },

    // УДАЛИТЬ одного грузоотправителя • DELETE /api/sender/
    deleteOneShipper( idSender: { idSender: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/sender/', { data: idSender })
            .then(response => response.data)
        // 1.	Code 200, { "message": "Sender with id `{}` has been deleted.".format(request.data['idSender'])}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}
