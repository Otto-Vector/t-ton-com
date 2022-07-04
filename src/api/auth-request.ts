import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://185.46.11.30:8000/api/',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
})


export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string,
    phoneCode: string,
}

export type AuthResponseType = {
    message?: string
}

export const authAPI = {

    // отправка запроса на код по номеру телефона
    sendCodeToPhone( { phone }: AuthRequestType ) {
        return instance.put<AuthResponseType>('codesend/', { phone })
            .then(response => response.data)
    },
    // вход по паролю
    login( { phone, phoneCode }: AuthValidateRequestType ) {
        return instance.post<AuthResponseType>('login/', { phone, phoneCode })
            .then(response => response.data)
    },
    // выход
    logout( { phone }: AuthRequestType ) {
        return instance.post<AuthResponseType>('logout/', { phone })
            .then(response => response.data)
    },
    // запрос на сброс пароля
    passwordRecovery( { phone }: AuthRequestType ) {
        return instance.put<AuthResponseType>('passwordrecoverysend/', { phone })
            .then(response => response.data)
    },
}


