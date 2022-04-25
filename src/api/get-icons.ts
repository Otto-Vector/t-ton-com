import axios from 'axios'
import {qsNormalize} from '../utils/normQuery'

const instance = axios.create( {
    baseURL: 'https://www.google.com/s2/',
} )

// https://github.com/antongunov/favicongrabber.com

export type GetIconsType = {
    domain: string
    sz?: number
}

// запрос на сервер
export const getIconsFromApi = ( { domain, sz = 64 }: GetIconsType ) => {

    return instance.get<string>( `favicons?${qsNormalize({domain,sz})}` )
        .then( response => response.data )
}
