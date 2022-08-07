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

    // запрос списка ПРИЦЕПОВ
    getAllTrailer() {
        return instanceBack.get<TrailerApiType[]>('/api/trailer/')
            .then(response => response.data)
    },
    // запрос списка всех ПРИЦЕПОВ созданных данным пользователем
    getAllTrailerByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<TrailerApiType[]>('/api/traileruser/', { ...idUser })
            .then(response => response.data)
    },
    // запрос на один ПРИЦЕП по id
    getOneTrailerById( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.patch<InfoResponseType | TrailerApiType[]>('/api/trailer/', { idTrailer })
            .then(response => response.data)
    },
    // создать один ПРИЦЕП
    createOneTrailer( { idTrailer, ...requestData }: TrailerApiType, image: File | undefined ) {
        let formData = new FormData();
        formData.append('idUser', requestData.idUser);
        formData.append('trailerNumber', requestData.trailerNumber);
        formData.append('trailerTrademark', requestData.trailerTrademark);
        formData.append('trailerModel', requestData.trailerModel);
        formData.append('pts', requestData.pts);
        formData.append('dopog', requestData.dopog);
        formData.append('cargoType', requestData.cargoType);
        formData.append('propertyRights', requestData.propertyRights);
        formData.append('cargoWeight', requestData.cargoWeight);
        if (image) {
            formData.append('trailerImage', image, 'trailerImage.jpg');
        }
        return instanceBack.post<InfoResponseType>('/api/trailer/', formData)
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ПРИЦЕП
    modifyOneTrailer( { trailerImage, ...requestData }: TrailerApiType, image: File | undefined ) {
        let formData = new FormData();
        formData.append('idUser', requestData.idUser);
        formData.append('idTrailer', requestData.idTrailer);
        formData.append('trailerNumber', requestData.trailerNumber);
        formData.append('trailerTrademark', requestData.trailerTrademark);
        formData.append('trailerModel', requestData.trailerModel);
        formData.append('pts', requestData.pts);
        formData.append('dopog', requestData.dopog);
        formData.append('cargoType', requestData.cargoType);
        formData.append('propertyRights', requestData.propertyRights);
        formData.append('cargoWeight', requestData.cargoWeight);
        if (image) {
            formData.append('trailerImage', image, 'trailerImage.jpg' );
        }
        console.log('-----------API---------------')
        console.log(`compressedFile name: ${ image?.name } `);
        console.log(`compressedFile type: ${ image?.type } `);
        return instanceBack.put<InfoResponseType>('/api/trailer/', formData)
            .then(response => response.data)
    },
    // УДАЛИТЬ один ПРИЦЕП
    deleteOneTrailer( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/trailer/', { data: { idTrailer } })
            .then(response => response.data)
    },
}

