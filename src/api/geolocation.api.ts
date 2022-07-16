export const geoPosition = ( success: PositionCallback ) => navigator.geolocation.getCurrentPosition(success)

// подгрузка миникартинки по координатам из Яндекс-карт с флагом посередине
export const toYandexMapSreenshoot = ( coordinates: string | undefined ) =>
    `https://static-maps.yandex.ru/1.x/?z=12&l=map&pt=${
        coordinates?.split(', ').reverse().join(',') || '55.185346, 25.14226' },flag&size=300,300`
