import {InfoResponseType, instanceBack} from './back-instance.api';
// 0905
// '+7 (950) 051-05-20' password: '7701'
export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string,
    password: string,
}

export type NewUserRequestType = {
    inn: string,
    kpp: string,
    phone: string
}

export const authApi = {

    // отправка запроса на данные пользователя
    autoLogin() {
        return instanceBack.post<{ userid?: string, message?: string }>('/api/me/', )
            .then(response => response.data)
    },

    // отправка запроса на код по номеру телефона
    sendCodeToPhone( { phone, inn, kpp }: NewUserRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/codesend/', { phone, innNumber: inn, kpp })
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


