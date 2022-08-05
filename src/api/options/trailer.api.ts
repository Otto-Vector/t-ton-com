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

export type CreateTrailerApiType = Omit<TrailerApiType, 'idTrailer'>


export const trailerApi = {

    // запрос списка ПРИЦЕПОВ
    getAllTrailer() {
        return instanceBack.get<TrailerApiType[]>('/api/trailer/')
            .then(response => response.data)
    },
    // запрос списка всеx ПРИЦЕПОВ созданных данным пользователем
    getAllTrailerByUserId( idUser: { idUser: string } ) {
        return instanceBack.patch<TrailerApiType[]>('/api/traileruser/', { ...idUser })
            .then(response => response.data)
    },
    // запрос на один ПРИЦЕП
    getOneConsigneeById( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.patch<InfoResponseType | TrailerApiType[]>('/api/trailer/', { idTrailer })
            .then(response => response.data)
    },
    // создать один ПРИЦЕП
    createOneConsignee( requestData: CreateTrailerApiType ) {
        return instanceBack.post<InfoResponseType>('/api/trailer/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ПРИЦЕП
    modifyOneConsignee( requestData: TrailerApiType ) {
        return instanceBack.put<InfoResponseType>('/api/trailer/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ один ПРИЦЕП
    deleteOneConsignee( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.delete<InfoResponseType>('/api/trailer/', { data: { idTrailer } })
            .then(response => response.data)
    },
}

