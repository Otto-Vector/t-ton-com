import axios from 'axios'
import {qsNormalize} from '../utils/norm-query'
import {parseNoSpace} from '../utils/parsers'
import base64 from 'base-64'


const { REACT_APP_AVTODISPETCHER_KEY, REACT_APP_DEPLOY_MODE } = process.env

const instance = axios.create({
    baseURL: REACT_APP_DEPLOY_MODE === 'true' ? 'https://api.avtodispetcher.ru/v1/' : undefined,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + base64.encode(REACT_APP_AVTODISPETCHER_KEY as string),
    },
})


export type GetAvtodispetcherRouteType = {
    from: string,
    to: string
}

//стандартно возвращаемый тип с подстановкой
// export type ResponseApiType<DataIs = {}> = {
//     data: DataIs
//     messages: string[]
// }

export type AvtodispetcherResponseType = {
    kilometers: string
    polyline: string
}

// запрос на сервер
export const getRouteFromAvtodispetcherApi = ( { from, to }: GetAvtodispetcherRouteType ) => {

    // меняем значение с процентного на нормальный запрос
    const decodedQuery = qsNormalize({
        from: parseNoSpace(from),
        to: parseNoSpace(to),
    }, false, false)

    return instance.get<AvtodispetcherResponseType>(`/v1/route?${ decodedQuery }`)
        .then(response => response.data)
}
