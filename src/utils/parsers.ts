export const composeParsers = ( ...parsers: ( ( val: string | undefined ) => string )[] ) => ( value: string ): string =>
    parsers.reduce(( val, validator ) => validator(val), value);

// только цифры
export const parseAllNumbers = ( val: string | undefined ): string => val ? val
    .replace(/[^\d]/g, '') : ''

// только координаты
export const parseAllCoords = ( val: string | undefined ): string => val ? val
    .replace(/[^\d.,\s]/, '') : ''

// только буквы, знак тире и точка
export const parseFIO = ( val: string | undefined ): string => val ? val
    .replace(/[^-А-ЯA-Zа-яa-z.\s]/, '') : ''
// только буквы и цифры
export const parseCharsAndNumbers = ( val: string | undefined ): string => val ? val
    .replace(/[^-А-ЯA-Zа-яa-z\s\d]/, '') : ''

// только одна точка
export const parseOnlyOneDot = ( val: string | undefined ): string => val ? val
    .replace(/[..]+/g, '.') : ''
// только одно тире
export const parseOnlyOneDash = ( val: string | undefined ): string => val ? val
    .replace(/[--]+/g, '-') : ''
// только один пробел
export const parseOnlyOneSpace = ( val: string | undefined ): string => val ? val
    .replace(/\s\s+/g, ' ') : ''
// ни одного пробела
export const parseNoSpace = ( val: string | undefined ): string => val ? val
    .replace(/\s/g, '') : ''
// только одна запятая
export const parseOnlyOneComma = ( val: string | undefined ): string => val ? val
    .replace(/\s\s+/g, ' ') : ''
// без пробелов в начале строки
export const parseNoFirstSpaces = ( val: string | undefined ): string => val ? val
    .replace(/^\s*/g, '') : ''


// только псевдолатинские русские буквы
export const parsePseudoLatinCharsAndNumbers = ( val: string | undefined ): string => val ? val
    .replace(/[^АВЕКМНОРСТУХ\s\d]/, '') : ''
// export const parseTransportNumber = (val: string|null): string => val ? val.replace(/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui,'') : ''

// Фамилия Имя Отчество в Фамилия И.О.
export const parseFamilyToFIO = ( val: string | undefined ): string => val ? val
        // .replace(/(?<=\S+) (\S)\S* (\S)\S*/, ' $1. $2.') : '' // не работает на сафари
        .split(' ')
        .map(( el, i ) => i > 0 ? el[0].toUpperCase() + '.' : el)
        .join(' ')
    : ''

// из координат в строке "10.1235, 11.6548" в массив из двух элементов [10.1235, 11.6548]
export const stringToCoords = ( coordsString?: string ): [ number, number ] => {
    const retArr = coordsString?.split(', ').map(Number) || [ 0, 0 ]
    return [ retArr[0] || 0, retArr[1] || 0 ]
}

// из массива координат в стороковое значение с обрезанием мегаточности
export const coordsToString = ( coordsNumArray?: [ number, number ] ): string => {
    if (coordsNumArray)
        return coordsNumArray.map(e => e.toFixed(6)).join(', ')
    return 'неверные входные данные'
}
