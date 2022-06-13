export const geoPosition = ( success: PositionCallback ) => navigator.geolocation.getCurrentPosition(success)

export const toYandexMapLink = ( coordinates: string | undefined ) =>
    `https://yandex.ru/maps/?from=api-maps&lang=ru&mode=search&text=${
        coordinates || '55.185346, 25.14226' }&origin=jsapi_2_1_79&&z=16`


export const toYandexMapSreenshoot = ( coordinates: string | undefined ) =>
    `https://static-maps.yandex.ru/1.x/?z=12&l=map&pt=${
        coordinates?.split(', ').reverse().join(',') || '55.185346, 25.14226' },flag&size=300,300`
