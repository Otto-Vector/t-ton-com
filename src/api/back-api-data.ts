import axios from 'axios';
// import {createProxyMiddleware} from 'http-proxy-middleware';

export const instanceBack = axios.create({
    baseURL: 'http://185.46.11.30:8000/api/',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
    },

    // proxy: createProxyMiddleware({ target: 'https://www.api.com', changeOrigin: true})
    // mode: 'no-cors',
    // crossdomain: true,
    // credentials: 'same-origin'
})


export type InfoResponseType = {
    message?: string
    success?: string
    failed?: string
    status?: string
}