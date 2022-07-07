import axios from 'axios';

export const instanceBack = axios.create({
    baseURL: 'http://185.46.11.30:8000/api/',
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
}