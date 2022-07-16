import axios from 'axios'

const { REACT_APP_DEPLOY_MODE } = process.env

export const instanceBack = axios.create({
    baseURL: REACT_APP_DEPLOY_MODE === 'true' ? 'https://server.t-ton.com' : undefined,
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
