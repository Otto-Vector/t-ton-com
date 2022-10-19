import {InfoResponseType, instanceBack} from './back-instance.api';
// 0905 - 9386930727
// +7 (938) 693-07-78' был отправлен пароль.ПАРОЛЬ: 0864
// +7 (938) 693-08-79' был отправлен пароль.ПАРОЛЬ: 8929
// "На номер '+7 (938) 693-77-77' был отправлен пароль.", password: '2283'

export type AuthRequestType = {
    phone: string,
}

export type AuthValidateRequestType = {
    phone: string
    password: string
}

export type NewUserRequestType = {
    phone: string
    innNumber: string
    kpp: string
    organizationName?: string
    taxMode?: string
    ogrn?: string
    okpo?: string
    legalAddress?: string
    postAddress?: string
    email?: string
}

export const authApi = {

    // отправка запроса на данные пользователя • POST /api/me/
    autoLogin() {
        return instanceBack.post<{ userid?: string, message?: string }>('/api/me/')
            .then(response => response.data)
        // 1.	code 200, 'userId': userId
        // 2.   code 401, 'message: "Куки не авторизованы"
    },

    // отправка запроса на код по номеру телефона • PUT /api/codesend/
    sendCodeToPhone( props: NewUserRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/codesend/', props)
            .then(response => response.data)
        // 1.	code 200, "success": "На номер '{}' был отправлен пароль.".format(saved_personal.phone)
        // 2.	code 200, 'message': 'Следующая отправка доступна только через минуту'
        // 3.	code 200, 'message': 'Подозрение на спам, для восстановления доступа обратитесь к администратору'
        // 4.	code 400, 'message': 'Такой ИНН/КПП уже существует'
        // 5.	code 422, "message": "API error"
        // 6.	code 449, "failed": "Code is not sent to '{}'".format(saved_personal.phone)
        // 7.	code 422, 'message': "Аккаунт уже создан"
    },

    // вход по паролю • POST /api/login/
    login( { phone, password }: AuthValidateRequestType ) {
        return instanceBack.post<InfoResponseType>('/api/login/', { phone, password })
            .then(response => response.data)
        // 1.	code 200, {   "success": "Вы авторизованы!", "userid": userId }
        // 2.	code 401, 'message': "Ваши логин и пароль не соответствуют."
    },

    // выход • POST /api/logout/
    logout( { phone }: AuthRequestType ) { // phone : необязательный параметр
        return instanceBack.post<InfoResponseType>('/api/logout/', { phone })
            .then(response => response.data)
        // 1.	code 200, "status": "Вы вышли."
    },

    // запрос на сброс пароля • PUT /api/passwordrecoverysend/
    passwordRecovery( { phone }: AuthRequestType ) {
        return instanceBack.put<InfoResponseType>('/api/passwordrecoverysend/', { phone })
            .then(response => response.data)
        // 1.	code 200, "success": "На номер '{}' был отправлен пароль.".format(saved_personal.phone)
        // 2.	code 449, "failed": "Code is not sent to '{}'".format(saved_personal.phone)
    },
}


