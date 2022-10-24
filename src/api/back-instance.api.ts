import axios from 'axios'

const { REACT_APP_DEPLOY_MODE } = process.env

// https://server.t-ton.com/admin/
// 89876543210
// Aa123456

export const instanceBack = axios.create({
    baseURL: REACT_APP_DEPLOY_MODE === 'true' ? 'https://server.t-ton.com' : undefined,
    withCredentials: true,
})


export type InfoResponseType = {
    message?: string
    success?: string
    failed?: string
    status?: string
    userid?: string
    password?: string
    error?: string
}
