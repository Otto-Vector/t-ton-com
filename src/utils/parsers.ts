export const oneRenderParser = ( form: any, parser?: ( value: string ) => string ) => ( value: string, name: string ): string =>
    value !== form.getFieldState(name)?.value ? parser ? parser(value) : value : value

export const composeParsers = ( ...parsers: ( ( val: string | undefined ) => string )[] ) => ( value: string ): string =>
    parsers.reduce(( val, validator ) => validator(val), value)

type parsePropType = string | undefined | null | number

// только цифры
export const parseAllNumbers = ( val: parsePropType ) =>
    ( '' + val ).replace(/\D/g, '') || ''

export const removeFirstSevenOrEight = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/^(\+7\s\([78])/, '+7 (') : ''

// для отсмотра состояния парсера на разных этапах обработки
const toConsole = ( val: parsePropType ) => {
    console.log(val)
    return val || ''
}

// только координаты
export const parseAllCoords = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[^\d.,\s]/, '') : ''

// запятую в точку (для цифр)
export const parseCommaToDot = ( val: parsePropType ): string =>
    val ? ( val + '' ).replace(',', '.') : ''


// только буквы, знак тире точка и пробел
export const parseFIO = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[^-А-ЯA-Zа-яa-z.\s]/g, '') : ''
// только буквы и цифры и пробел
export const parseCharsAndNumbers = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[^-А-ЯA-Zа-яa-z\s\d]/g, '') : ''

// только одна точка
export const parseOnlyOneDot = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[..]+/g, '.') : ''
// только одно тире
export const parseOnlyOneDash = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[--]+/g, '-') : ''
// только один пробел
export const parseOnlyOneSpace = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/\s\s+/g, ' ') : ''
// ни одного пробела
export const parseNoSpace = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/\s/g, '') : ''
// только одна запятая
export const parseOnlyOneComma = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/\s\s+/g, ' ') : ''
// без пробелов в начале строки
export const parseNoFirstSpaces = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/^\s*/g, '') : ''

////////////////////////////////////////////////////////////////////////
// только псевдолатинские русские буквы
const pseudoLatin = 'АВЕКМНОРСТУХавекмнорстух'
const pseudoRussian = 'ABEKMHOPCTYXabekmhopctyx'
const enCharToRusChar = ( char: string ): string => pseudoLatin.charAt(pseudoRussian.indexOf(char))
// удаляем все НЕ (псевдолатиницы, пробелы, цифры и '|') из текста
export const parsePseudoLatinCharsAndNumbers = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[^АВЕКМНОРСТУХавекмнорстухABEKMHOPCTYXabekmhopctyx|\d\s]/g, '') : ''
// латинские буквы в русские аналоги
export const parseLatinCharsToRus = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/[ABEKMHOPCTYXabekmhopctyx]/g, enCharToRusChar) : ''
////////////////////////////////////////////////////////////////////////
// отображение денег с разделителем тысяч пробелом
export const parseToNormalMoney = ( val: number | string ): string =>
    toNumber(val).toFixed(1)
        .replace(/\d(?=(\d{3})+\.)/g, '$&,')
        .replace(',', ' ') || ''
export const parseClearAllMaskPlaceholders = ( val: parsePropType ) =>
    val ? ( val + '' ).replaceAll(/[#_]/g, '') : ''

export const parserDowngradeRUSatEnd = ( val: parsePropType ) =>
    val ? ( val + '' ).replace(/RUS$/, 'rus') : ''

// преобразовывает в заглавные буквы
export const parseToUpperCase = ( val: parsePropType ) =>
    val ? ( val + '' ).toUpperCase() : ''

// Фамилия Имя Отчество в "Фамилия И.О."
export const parseFamilyToFIO = ( val: parsePropType ) =>
// val.replace(/(?<=\S+) (\S)\S* (\S)\S*/, ' $1. $2.') : '' // не работает на сафари
    val ? ( val + '' ).split(' ')
            .map(( el, i ) => i > 0 ? el[0].toUpperCase() + '.' : el)
            .join(' ')
        : ''


// из массива координат в стороковое значение с обрезанием мегаточности
export const coordsToString = ( coordsNumArray?: [ number, number ] ): string =>
    coordsNumArray?.map(e => e.toFixed(6)).join(', ') || 'неверные входные данные'

// извлекаем имя файла из URL
export const getFileNameFromUrl = ( URLWithFilname?: string ) =>
    URLWithFilname?.split('/').pop() || ''

// из любого Г в цифру
export const toNumber = ( value?: string | number ): number => value && !isNaN(+value) ? +value : 0

export const syncParsers = {
    // parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces
    title: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    // parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces
    fio: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    // parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces
    passportFMS: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    // parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces, parseToUpperCase
    drivingLicence: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces, parseToUpperCase),
    // parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces
    drivingCategory: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    // parseToUpperCase, parseClearAllMaskPlaceholders, parserDowngradeRUSatEnd
    clearNormalizeTrailerTransportNumberAtEnd: composeParsers(parseToUpperCase, parseClearAllMaskPlaceholders, parserDowngradeRUSatEnd),
    // parseLatinCharsToRus, parseToUpperCase, parserDowngradeRUSatEnd
    pseudoLatin: composeParsers(parseLatinCharsToRus, parseToUpperCase, parserDowngradeRUSatEnd),
    // parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma
    coordinates: composeParsers(parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
    // removeFirstSevenOrEight
    tel: composeParsers(removeFirstSevenOrEight),
    parseToNormalMoney,
    parseToUpperCase,
    parseAllNumbers,
    parseNoSpace,
    parseCommaToDot,
    toConsole,
}
