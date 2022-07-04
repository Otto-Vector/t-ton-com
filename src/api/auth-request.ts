import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://185.46.11.30:8000/',
    // withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Authorization': 'Basic ' + base64.encode(REACT_APP_AVTODISPETCHER_KEY as string),
    },
})

export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string,
    phoneCode: string,
}

export type AuthRecoveryRequestType = {
    phone: string,
    phoneCode: string,
}

export const authAPI = {

    // отправка запроса на код по номеру телефона
    sendCodeToPhone( { phone }: AuthRequestType ) {
        return instance.put<{}>('codesend/', { phone })
            .then(response => response.data)
    },
    // отправка кода на валидацию входа
    sendCodeToValidate( { phone, phoneCode }: AuthValidateRequestType ) {
        return instance.put<{}>('codevalidate/', { phone, phoneCode })
            .then(response => response.data)
    },
    // вход по паролю
    login( { phone, phoneCode }: AuthValidateRequestType ) {
        return instance.post<{}>('login/', { phone, phoneCode })
            .then(response => response.data)
    },
    // выход
    logout( { phone }: AuthRequestType ) {
        return instance.post<{}>('logout/', { phone })
            .then(response => response.data)
    },
    // запрос на сброс пароля
    passwordRecoveryRequest( { phone }: AuthRequestType ) {
        return instance.put<{}>('passwordrecoverysend/', { phone })
            .then(response => response.data)
    },
    // изменение пароля
    passwordRecovery({ phone, phoneCode }: AuthValidateRequestType ) {
        return instance.put<{}>('passwordrecovery/', { phone, phoneCode })
            .then(response => response.data)
    },
}


