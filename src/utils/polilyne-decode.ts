// для перевода зашифрованной полилинии автодиспетчера в набор координат
export const polyline_decode = function ( str: string, precision?: number ): number[][] {
    let index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte_var = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 5);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.

    while (index < str.length) {

        // Reset shift, result, and byte_var
        byte_var = null;
        shift = 0;
        result = 0;

        do {
            byte_var = str.charCodeAt(index++) - 63;
            result |= ( byte_var & 0x1f ) << shift;
            shift += 5;
        } while (byte_var >= 0x20);

        latitude_change = ( ( result & 1 ) ? ~( result >> 1 ) : ( result >> 1 ) );

        shift = result = 0;

        do {
            byte_var = str.charCodeAt(index++) - 63;
            result |= ( byte_var & 0x1f ) << shift;
            shift += 5;
        } while (byte_var >= 0x20);

        longitude_change = ( ( result & 1 ) ? ~( result >> 1 ) : ( result >> 1 ) );

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([ lat / factor, lng / factor ]);
    }
    return coordinates;
};