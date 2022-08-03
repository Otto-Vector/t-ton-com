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

    // запрос списка ТРАНСПОРТА
    getAllTrailer() {
        return instanceBack.get<TrailerApiType[]>('/api/trailer/')
            .then(response => response.data)
    },
    // запрос на один ТРАНСПОРТ
    getOneConsigneeById( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.patch<InfoResponseType | TrailerApiType[]>('/api/trailer/', { idTrailer })
            .then(response => response.data)
    },
    // создать один ТРАНСПОРТ
    createOneConsignee( requestData: CreateTrailerApiType ) {
        return instanceBack.post<InfoResponseType>('/api/trailer/', { ...requestData })
            .then(response => response.data)
    },
    // ИЗМЕНИТЬ один ТРАНСПОРТ
    modifyOneConsignee( requestData: TrailerApiType ) {
        return instanceBack.put<InfoResponseType>('/api/trailer/', { ...requestData })
            .then(response => response.data)
    },
    // УДАЛИТЬ один ТРАНСПОРТ
    deleteOneConsignee( { idTrailer }: { idTrailer: string } ) {
        return instanceBack.put<InfoResponseType>('/api/trailer/', { idTrailer })
            .then(response => response.data)
    },
}

