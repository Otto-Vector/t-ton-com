// автоматизация параметоров query
export const qsNormalize = ( params: {}, nullIsRequired = true, decodeisRequired = true ): string => {

    let urlObj = new URLSearchParams(Object.fromEntries(Object
        .entries(params)
        // // чистим пустые значения
        .filter(n => n[1] !== '')
        .filter(n => n[1] !== undefined)
        // убираем эту строку, если null не нужен
        .map(( [ a, b ] ) => [ a, ( b === null && nullIsRequired ) ? 'null' : b ]) //переводим null в строку
        .filter(n => n[1] !== null),
    )).toString()

    return decodeisRequired ? decodeURIComponent(urlObj) : urlObj
}

