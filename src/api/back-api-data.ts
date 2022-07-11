import axios from 'axios'


export const instanceBack = axios.create({
    // baseURL: 'https://server.t-ton.com',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
})


export type InfoResponseType = {
    message?: string
    success?: string
    failed?: string
    status?: string
}
