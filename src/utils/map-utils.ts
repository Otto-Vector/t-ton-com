// забирает геопозицию из данных браузера
export const geoPosition = ( success: PositionCallback ) => navigator.geolocation.getCurrentPosition(success)

// из координат в строке "10.1235, 11.6548" в массив из двух элементов [10.1235, 11.6548] || [0,0]
export const stringToCoords = ( coordsString?: string ): [ number, number ] => {
    const [ latitude = 0, longitude = 0 ] = coordsString?.split(', ')?.map(Number) || []
    return [ latitude, longitude ]
}

// если позиция выходит за рамки, возвращает координаты у рамки
export const positionToBoundsLine = ( {
                                          position: [ x, y ] = [ 0, 0 ],
                                          bounds: [ [ x1, y1 ], [ x2, y2 ] ] = [ [ 0, 0 ], [ 0, 0 ] ],
                                      }: { position: number[], bounds: number[][] } ): number[] => {
    const up = Math.min(x, x2)
    const down = Math.max(x, x1)
    const right = Math.min(y, y2)
    const left = Math.max(y, y1)
    return [ x !== up ? up : down, y !== right ? right : left ]
}

// возвращает true, если координаты выходят за рамки
export const isOutOfBounds = ( data: { position: number[], bounds: number[][] } ): boolean => {
    const { position: [ xo, yo ] = [ 0, 0 ] } = data
    const [ x, y ] = positionToBoundsLine(data)
    return x !== xo || y !== yo
}

export const directionOfBounds = ( {
                                       position: [ x, y ] = [ 0, 0 ],
                                       bounds: [ [ x1, y1 ], [ x2, y2 ] ] = [ [ 0, 0 ], [ 0, 0 ] ],
                                   }: { position: number[], bounds: number[][] } ): { [key in 'up' | 'left' | 'down' | 'right']: boolean } => {
    const up = Math.min(x, x2)
    const down = Math.max(x, x1)
    const right = Math.min(y, y2)
    const left = Math.max(y, y1)
    return { up: up !== x, down: down !== x, left: left !== y, right: right !== y }
}

// корректировка отрисовки маркера, ушедшего за край карты (для iconOffset)
export const boundsOffsetCorrector = ( {
                                           up,
                                           right,
                                           down,
                                           left,
                                       }: { [key in 'up' | 'left' | 'down' | 'right']: boolean },
                                       pixels = 10,
): number[] => ( [ left ? pixels : right ? -pixels : 0, up ? pixels : down ? -pixels : 0 ] )


// назначает координаты крайних точек в нужном для bounds формате
export const positionsToCorrectBounds = ( {
                                              start: [ x1, y1 ] = [ 0, 0 ],
                                              finish: [ x2, y2 ] = [ 0, 0 ],
                                          }: { start: number[], finish: number[] } ): number[][] => {
    const up = Math.max(x1, x2)
    const down = Math.min(x1, x2)
    const right = Math.max(y1, y2)
    const left = Math.min(y1, y2)
    return [ [ down, left ], [ up, right ] ]
}

// расстояние между двумя точками на карте в метрах
export const distanceBetweenMeAndPoint = ( {
                                               firstPoint: [ lat1, long1 ] = [ 0, 0 ],
                                               secondPoint: [ lat2, long2 ] = [ 0, 0 ],
                                           }: {firstPoint: number[], secondPoint: number[]} ): number => {
    //радиус Земли
    const R = 6372795
    //перевод коордитат в радианы
    lat1 *= Math.PI / 180
    lat2 *= Math.PI / 180
    long1 *= Math.PI / 180
    long2 *= Math.PI / 180
    //вычисление косинусов и синусов широт и разницы долгот
    const cl1 = Math.cos(lat1)
    const cl2 = Math.cos(lat2)
    const sl1 = Math.sin(lat1)
    const sl2 = Math.sin(lat2)
    const delta = long2 - long1
    const cdelta = Math.cos(delta)
    const sdelta = Math.sin(delta)
    //вычисления длины большого круга
    const y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2))
    const x = sl1 * sl2 + cl1 * cl2 * cdelta
    const ad = Math.atan2(y, x)
    const dist = ad * R
    return Math.round(dist) // расстояние между двумя координатами в метрах
}

// для перевода зашифрованной полилинии автодиспетчера в набор координат
export const polyline_decode = function ( polyline: string, precision?: number ): number[][] {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte_var = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5)

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.

    while (index < polyline.length) {

        // Reset shift, result, and byte_var
        byte_var = null
        shift = 0
        result = 0

        do {
            byte_var = polyline.charCodeAt(index++) - 63
            result |= ( byte_var & 0x1f ) << shift
            shift += 5
        } while (byte_var >= 0x20)

        latitude_change = ( ( result & 1 ) ? ~( result >> 1 ) : ( result >> 1 ) )

        shift = result = 0

        do {
            byte_var = polyline.charCodeAt(index++) - 63
            result |= ( byte_var & 0x1f ) << shift
            shift += 5
        } while (byte_var >= 0x20)

        longitude_change = ( ( result & 1 ) ? ~( result >> 1 ) : ( result >> 1 ) )

        lat += latitude_change
        lng += longitude_change

        coordinates.push([ lat / factor, lng / factor ])
    }
    return coordinates
}
