// если позиция выходит за рамки, возвращает координаты у рамки
export const positionToBounds = ( {
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
    const [ x, y ] = positionToBounds(data)
    return x !== xo || y !== yo
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
