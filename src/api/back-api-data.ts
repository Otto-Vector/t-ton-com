import axios from 'axios'


export const instanceBack = axios.create({
    // baseURL: 'http://185.46.11.30:8000/api/',
    // baseURL: 'https://server.t-ton.com',
    withCredentials: true,
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Headers': "Cookie",
        // 'Cookie': 'session=79386930727; sessionid=t7wxneki0syaiyq5wqd94jxefefrhuhu; userid=30672918-39e6-44f9-b8be-eedfa9c99fc7'
    },

    // mode: 'no-cors',
    // crossdomain: true,
    // credentials: 'same-origin'
})

//  "proxy": "https://server.t-ton.com",

export type InfoResponseType = {
    message?: string
    success?: string
    failed?: string
    status?: string
}
