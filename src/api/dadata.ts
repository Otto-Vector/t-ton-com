import axios from 'axios'
import {qsNormalize} from '../utils/norm-query'
import {DaDataResponseAPIType} from '../types/api-types';


const { REACT_APP_DADATA_KEY } = process.env

const instance = axios.create({
    baseURL: 'https://suggestions.dadata.ru/suggestions/',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + REACT_APP_DADATA_KEY,
    },
})

export type GetOrganizationByInnDaDataType = {
    inn: number,
}


// запрос на сервер
export const getOrganizationByInnDaDataAPI = ( { inn }: GetOrganizationByInnDaDataType ) => {

    return instance.post<DaDataResponseAPIType>('/suggestions/api/4_1/rs/findById/party', {
        query: inn,
        branch_type: 'MAIN', // только головная организация
    } )
        .then(response => response.data.suggestions)
}

