import {InfoResponseType, instanceBack} from './back-instance.api';
import {PreAuthGlobalDataType} from '../../types/form-types';

const Passw = '7Zia8qXnIZ3d'

// перед загрузкой основного приложения (основные данные)
export const preAuthApi = {

    // отправка запроса на предустановочные данные • PATCH /api/preauth/
    getGlobalData() {
        return instanceBack.patch<InfoResponseType & PreAuthGlobalDataType[]>('/api/preauth/', { Passw })
            .then(response => response.data)
        // 1.	code 200, "message": "Passw is not correct."
    },

    // изменение установочных данных (для админки) • PUT /api/preauth/
    setGlobalData( props: Partial<PreAuthGlobalDataType> ) {
        return instanceBack.put<InfoResponseType>('/api/preauth/', { ...props, Passw })
            .then(response => response.data)
        // 1.	code 200, "message": "Passw is not correct."
        // 2.	code 200, {"message":"Изменения применены."}
    },

}


