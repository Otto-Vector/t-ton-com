export const geoPosition = ( success: PositionCallback ) => navigator.geolocation.getCurrentPosition(success)

export const toYandexMapLink = ( coordinates: string | undefined ) =>
    `https://yandex.ru/maps/?from=api-maps&lang=ru&mode=search&text=${
        coordinates || '55.185346, 25.14226' }&origin=jsapi_2_1_79&z=15`