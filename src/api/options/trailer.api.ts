import {InfoResponseType, instanceBack} from '../back-instance.api';


export type TrailerApiType = {
    idUser: string
    idTrailer: string
    trailerNumber: string
    trailerTrademark: string
    trailerModel: string
    pts: string
    dopog: string
    cargoType: string
    cargoWeight: string
    propertyRights: string
    trailerImage: string
}


export const trailerApi = {

    // запрос ВСЕГО списка ПРИЦЕПОВ • GET /api/trailer/
    getAllTrailer() {
        return instanceBack.get<TrailerApiType[]>('/api/trailer/')
            .then(response => response.data)
        // 1.	Code 200, {"message": "Transport with id `{}` has been deleted.".format(request.data['idTransport]}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },

    // запрос списка всех ПРИЦЕПОВ созданных данным пользователем • PATCH /api/traileruser/
    getAllTrailerByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<TrailerApiType[]>('/api/traileruser/', idUser)
            .then(response => response.data)
        // 1.	Code 200, models: TrailerApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // запрос на один ПРИЦЕП по id • PATCH /api/trailer/
    getOneTrailerById( idTrailer: { idTrailer: string } ) {
        return instanceBack.patch<InfoResponseType | TrailerApiType[]>('/api/trailer/', idTrailer)
            .then(response => response.data)
        // 1.	Code 200, models: TrailerApiType[]
        // 2.	Code 520, {"message":"Error"}
    },

    // создать один ПРИЦЕП • POST /api/trailer/
    createOneTrailer( { idTrailer, trailerImage, ...requestData }: TrailerApiType, image: File | undefined ) {
        let formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('trailerImage', image, 'trailerImage.jpg')
        }
        return instanceBack.post<InfoResponseType>('/api/trailer/', formData)
            .then(response => response.data)
        // 1.	Code 422, {'failed': Трейлер уже создан'}
        // 2.	Code 200, {"success": "Trailer '{}' created successfully".format(new_Trailer.idTrailer)}
        // 3.	Code 520, {"message":"Error"}
    },

    // ИЗМЕНИТЬ один ПРИЦЕП • PUT /api/trailer/
    modifyOneTrailer( { trailerImage, ...requestData }: TrailerApiType, image: File | undefined ) {
        let formData = new FormData()
        Object.entries(requestData).map(( [ key, value ] ) => formData.append(key, value))
        if (image) {
            formData.append('trailerImage', image, 'trailerImage.jpg')
        }
        return instanceBack.put<InfoResponseType>('/api/trailer/', formData)
            .then(response => response.data)
        // 1.	Code 449, {'failed': " Trailer is not updated"}
        // 2.	Code 200, "success": "Trailer {}' updated successfully".format(Trailer _saved.idTrailer)
    },

    // УДАЛИТЬ один ПРИЦЕП • DELETE /api/trailer/
    deleteOneTrailer( idTrailer: { idTrailer: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/trailer/', { data: idTrailer })
            .then(response => response.data)
        // 1.	Code 200, {"message": "Trailer with id `{}` has been deleted.".format(request.data['idTrailer]}
        // 2.	Code 449, {'error':'Неправильно указаны аргументы'}
    },
}

