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
        // 'x-requested-with': 'https://arcane-retreat-35947.herokuapp.com/',
        // 'Origin': 'http://localhost:3000',
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
        // 'Authorization': 'd08F9Xg3XnCK:RzMm4Nt9ns2t',

        'Authorization': 'Basic '+ base64.encode('d08F9Xg3XnCK:RzMm4Nt9ns2t'),
        // 'Referer': 'http://localhost:3000',
    },
})

// https://github.com/antongunov/favicongrabber.com

export type GetAvtodispetcherRouteType = {
    from: string,
    to: string
}

//стандартно возвращаемый тип с подстановкой
export type ResponseApiType<DataIs = {}> = {
    data: DataIs
    messages: string[]
}


// запрос на сервер
export const getRouteFromAvtodispetcherApi = ( { from, to }: GetAvtodispetcherRouteType ) => {
// создаём объект для query,

    // меняем значение с процентного на нормальный запрос
    const decodedQuery = qsNormalize({
        from: parseNoSpace(from),
        // from: parseNoSpace('52.587329,85.168558'),
        to: parseNoSpace(to),
    }, false, false)

    // instance.get<{ kilometers: string }>(`route?${ qsNormalize({ from, to }) }`)
    // return instance.get<{ kilometers: string }>(`route?from=${from}&to=${to}) }`)
    return instance.get<{ kilometers: string }>(`route?${ decodedQuery }`)
        .then(response => response.data)
}
