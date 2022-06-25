import axios from 'axios'
import {qsNormalize} from '../utils/norm-query';
import {parseNoSpace} from '../utils/parsers';
import base64 from 'base-64'

const instance = axios.create({
    baseURL: 'https://api.avtodispetcher.ru/v1/',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic '+ base64.encode('d08F9Xg3XnCK:RzMm4Nt9ns2t'),
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

    return instance.get<AvtodispetcherResponseType>(`route?${ decodedQuery }`)
        .then(response => response.data)
}
