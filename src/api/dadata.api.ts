import axios from 'axios'
import {DaDataResponseAPIType} from '../types/api-types';


const { REACT_APP_DADATA_KEY, REACT_APP_DEPLOY_MODE } = process.env

const instance = axios.create({
    baseURL: REACT_APP_DEPLOY_MODE === 'true' ? 'https://suggestions.dadata.ru' : undefined,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + REACT_APP_DADATA_KEY,
    },
})

export type GetOrganizationByInnDaDataType = {
    inn: number,
}

export type GetOrganizationByInnKPPDaDataType = {
    inn: number,
    kpp: number
}

type localResponseType = {
    suggestions: DaDataResponseAPIType[]
}

// запрос на сервер
export const getOrganizationByInnDaDataAPI = ( { inn }: GetOrganizationByInnDaDataType ) => {
    return instance.post<localResponseType>('/suggestions/api/4_1/rs/findById/party', {
        query: inn,
        count: 100,
        // branch_type: 'MAIN', // только головная организация
    }).then(response => response.data.suggestions)
}

export const getOrganizationByInnKPPDaDataAPI = ( { inn, kpp }: GetOrganizationByInnKPPDaDataType ) => {
    return instance.post<localResponseType>('/suggestions/api/4_1/rs/findById/party', {
        query: inn,
        kpp,
    }).then(response => response.data.suggestions)
}