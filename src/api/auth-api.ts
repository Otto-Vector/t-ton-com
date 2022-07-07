import axios from 'axios'
import {InfoResponseType, instanceBack} from './back-api-data';


export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string,
    password: string,
}


export const authAPI = {

    // отправка запроса на код по номеру телефона
    sendCodeToPhone( { phone }: AuthRequestType ) {
        return instanceBack.put<InfoResponseType>('codesend/', { phone })
            .then(response => response.data)
    },
    // вход по паролю
    login( { phone, password }: AuthValidateRequestType ) {
        return instanceBack.post<InfoResponseType>('login/', { phone, password })
            .then(response => response.data)
    },
    // выход
    logout( { phone }: AuthRequestType ) {
        return instanceBack.post<InfoResponseType>('logout/', { phone })
            .then(response => response.data)
    },
    // запрос на сброс пароля
    passwordRecovery( { phone }: AuthRequestType ) {
        return instanceBack.put<InfoResponseType>('passwordrecoverysend/', { phone })
            .then(response => response.data)
    },
}


