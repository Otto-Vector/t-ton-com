import {InfoResponseType, instanceBack} from './back-instance.api';


export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string,
    password: string,
}


export const authApi = {

    // отправка запроса на код по номеру телефона
    sendCodeToPhone( { phone, innNumber }: { innNumber: string, phone: string } ) {
        return instanceBack.put<InfoResponseType>('/api/codesend/', { phone, innNumber })
            .then(response => response.data)
    },
    // вход по паролю
    login( { phone, password }: AuthValidateRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/login/', { phone, password })
            .then(response => response.data)
    },
    // выход
    logout( { phone }: AuthRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/logout/', { phone })
            .then(response => response.data)
    },
    // запрос на сброс пароля
    passwordRecovery( { phone }: AuthRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/passwordrecoverysend/', { phone })
            .then(response => response.data)
    },
}


