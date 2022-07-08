import axios from 'axios';
// import {createProxyMiddleware} from 'http-proxy-middleware';

export const instanceBack = axios.create({
    baseURL: 'http://185.46.11.30:8000/api/',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Headers': "Cookie",
        // 'Cookie': 'session=79386930727; sessionid=t7wxneki0syaiyq5wqd94jxefefrhuhu; userid=30672918-39e6-44f9-b8be-eedfa9c99fc7'
        // 'Access-Control-Allow-Origin': '*',
    },
// "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="D:\chrome\temp"
//     proxy: createProxyMiddleware({ target: 'https://www.api.com', changeOrigin: true})
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