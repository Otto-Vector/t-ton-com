import axios from 'axios'

const instance = axios.create( {
    baseURL: 'https://www.google.com/s2/',
} )

export type GetIconsType = {
    domain: string
    sz?: number
}

// запрос на сервер
export const getIconsFromApi = ( { domain, sz = 64 }: GetIconsType ) => {

    return instance.get<string>( `favicons?domain=${domain}&sz=${sz}` )
        .then( response => response.data )
}
