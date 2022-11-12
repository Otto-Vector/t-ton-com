export const composeParsers = ( ...parsers: ( ( val: string | undefined ) => string )[] ) => ( value: string ): string =>
    parsers.reduce(( val, validator ) => validator(val), value);

type parsePropType = string | undefined | null

// только цифры
export const parseAllNumbers = ( val: parsePropType ): string => val ? val
    .replace(/\D/g, '') : ''

export const removeFirstSevenOrEight = ( val: parsePropType ): string => val ? val
    .replace(/^(\+7\s\([78])/, '+7 (') : ''

const toConsole = ( val: parsePropType ): string => {
    console.log(val)
    return val || ''
}

// только координаты
export const parseAllCoords = ( val: parsePropType ): string => val ? val
    .replace(/[^\d.,\s]/, '') : ''

// только буквы, знак тире и точка
export const parseFIO = ( val: parsePropType ): string => val ? val
    .replace(/[^-А-ЯA-Zа-яa-z.\s]/, '') : ''
// только буквы и цифры
export const parseCharsAndNumbers = ( val: parsePropType ): string => val ? val
    .replace(/[^-А-ЯA-Zа-яa-z\s\d]/, '') : ''

// только одна точка
export const parseOnlyOneDot = ( val: parsePropType ): string => val ? val
    .replace(/[..]+/g, '.') : ''
// только одно тире
export const parseOnlyOneDash = ( val: parsePropType ): string => val ? val
    .replace(/[--]+/g, '-') : ''
// только один пробел
export const parseOnlyOneSpace = ( val: parsePropType ): string => val ? val
    .replace(/\s\s+/g, ' ') : ''
// ни одного пробела
export const parseNoSpace = ( val: parsePropType ): string => val ? val
    .replace(/\s/g, '') : ''
// только одна запятая
export const parseOnlyOneComma = ( val: parsePropType ): string => val ? val
    .replace(/\s\s+/g, ' ') : ''
// без пробелов в начале строки
export const parseNoFirstSpaces = ( val: parsePropType ): string => val ? val
    .replace(/^\s*/g, '') : ''

////////////////////////////////////////////////////////////////////////
// только псевдолатинские русские буквы
const pseudoLatin = 'АВЕКМНОРСТУХавекмнорстух'
const pseudoRussian = 'ABEKMHOPCTYXabekmhopctyx'
const regExpPatternNotRusLat = new RegExp('[^' + pseudoLatin + pseudoRussian + '|\d\s]', 'g')
const regExpPatternPseudoLat = new RegExp('[' + pseudoLatin + ']', 'g')
const enCharToRusChar = ( char: string ): string => pseudoLatin.charAt(pseudoRussian.indexOf(char))
// удаляем все не (псевдолатиницы, пробелы, цифры и '|') из текста
export const parsePseudoLatinCharsAndNumbers = ( val: parsePropType ): string => val ? val
    .replace(regExpPatternNotRusLat, '') : ''
// латинские буквы в русские аналоги
export const parseLatinCharsToRus = ( val: parsePropType ): string => val ?
    val.replace(regExpPatternPseudoLat, enCharToRusChar) : ''
////////////////////////////////////////////////////////////////////////

export const parseClearAllMaskPlaceholders = ( val: parsePropType ): string => val ? val
    .replaceAll(/[#_]/g, '') : ''
export const parserDowngradeRUSatEnd = ( val: parsePropType ): string => val ? val.includes('RUS') ? val.slice(0, -3) + 'rus' : val : ''
// export const parseTransportNumber = (val: string|null): string => val ? val.replace(/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui,'') : ''

// преобразовывает в заглавные буквы
export const parseToUpperCase = ( val: parsePropType ): string => val ? val.toUpperCase() : ''

// Фамилия Имя Отчество в "Фамилия И.О."
export const parseFamilyToFIO = ( val: parsePropType ): string => val ? val
        // .replace(/(?<=\S+) (\S)\S* (\S)\S*/, ' $1. $2.') : '' // не работает на сафари
        .split(' ')
        .map(( el, i ) => i > 0 ? el[0].toUpperCase() + '.' : el)
        .join(' ')
    : ''

// из координат в строке "10.1235, 11.6548" в массив из двух элементов [10.1235, 11.6548]
export const stringToCoords = ( coordsString: parsePropType ): [ number, number ] => {
    const [ latitude = 0, longitude = 0 ] = coordsString?.split(', ').map(Number) || []
    return [ latitude, longitude ]
}

// из массива координат в стороковое значение с обрезанием мегаточности
export const coordsToString = ( coordsNumArray?: [ number, number ] ): string =>
    coordsNumArray?.map(e => e.toFixed(6)).join(', ') || 'неверные входные данные'


export const syncParsers = {
    title: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    fio: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    passport: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    drivingLicence: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces, parseToUpperCase),
    drivingCategory: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
    trailerTransportNumber: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseNoFirstSpaces, parseToUpperCase),
    clearNormalizeTrailerTransportNumberAtEnd: composeParsers(parseToUpperCase, parseClearAllMaskPlaceholders, parserDowngradeRUSatEnd),
    pseudoLatin: composeParsers(parseLatinCharsToRus, parseToUpperCase, parserDowngradeRUSatEnd),
    coordinates: composeParsers(parseAllCoords, parseOnlyOneSpace, parseOnlyOneDot, parseNoFirstSpaces, parseOnlyOneComma),
    tel: composeParsers(removeFirstSevenOrEight, toConsole),
    parseToUpperCase,
    parseAllNumbers,
}