import axios from 'axios'

const { REACT_APP_DEPLOY_MODE } = process.env

// https://server.t-ton.com/admin/
// 89876543210
// Aa123456
// ssh root@185.46.11.30
// d%9ViyW=p!?E
// /etc/nginx/sites-available/default

export const instanceBack = axios.create({
    baseURL: REACT_APP_DEPLOY_MODE === 'true' ? 'https://server.t-ton.com' : undefined,
    withCredentials: true,
})
// Глобальные ответы на 200
// {"message": "Error, login please"}
// {'message': 'Error, account deleted'}

export type InfoResponseType = {
    success?: string
    status?: string
    userid?: string
    password?: string
    failed?: string
    message?: string
    error?: string
}
// для возвращаемого объекта в cach
export type TtonErrorType<T extends object = {}> = { response?: { data?: InfoResponseType & T } } | Error | any