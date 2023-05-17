import {format} from 'date-format-parse'

// output string dd-mm
export const ddMmFormat = ( date?: Date ) => date && format(date, 'DD-MM')
// output string dd.mm
export const ddDotMmFormat = ( date?: Date ) => date && format(date, 'DD.MM')
// output string HH:mm
export const hhMmFormat = ( date?: Date ) => date && format(date, 'HH:mm')
// output string DD-MM-YYYY
export const ddMmYearFormat = ( date?: Date ) => date && format(date, 'DD-MM-YYYY')
// output string YYYY-MM-DD
export const yearMmDdFormat = ( date?: Date ) => date && format(date, 'YYYY-MM-DD')
// output string HH:mm DD-MM
export const hhMmDdMmFormat = ( date?: Date ) => date && format(date, 'HH:mm DD-MM')
// output string HH:mm DD-MM-YYYY
export const hhmmDdMmYyFormat = ( date?: Date ) => date && format(date, 'HH:mm DD-MM-YYYY')

// output string HH:mm DD-MM
export const yearMmDdFormatISO = ( date?: Date ) => date && format(date, 'YYYY-MM-DDTHH:mm')
// from API to ISO parser 'YYYY-MM-DD-HH-mm' to 'YYYY-MM-DDTHH:mm'
export const apiToISODateFormat = ( dateStringFromAPI: string ) => dateStringFromAPI.split('')
    .map(( e, i ) => i === 10 ? 'T' : i === 13 ? ':' : e).join('')


// add a day
export const addOneDay = ( date: Date ): Date => new Date(date.getTime() + 86400000)
// add N days
export const addNDay = ( date: Date, daysToAdd = 1 ): Date => new Date(date.getTime() + ( 86400000 * daysToAdd ))

// проверка является ли дата сегодняшним днём
export const isToday = ( someDate: Date ) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

// рандомная дата в промеждутке между датами
export const randomDate = ( start: Date, end: Date ): Date => {
    return new Date(start.getTime() + Math.random() * ( end.getTime() - start.getTime() ))
}

// сколько дней/часов/минут между датами
export const timeDiff = ( dateStart: Date, dateFinish: Date ): string => {
    try {
        // разница в миллисекундах
        const diffTime = Math.abs(dateStart.getTime() - dateFinish.getTime())
        // разница в днях
        const diffDays = Math.floor(diffTime / ( 1000 * 60 * 60 * 24 ))
        // разница в часах
        const diffHours = Math.floor(( diffTime % ( 1000 * 60 * 60 * 24 ) ) / ( 1000 * 60 * 60 ))
        // разница в минутах
        const diffMinutes = Math.floor(( diffTime % ( 1000 * 60 * 60 ) ) / ( 1000 * 60 ))

        return `${ diffDays ? diffDays+'д ':''}${ diffHours ? diffHours+'ч ':''}${ diffMinutes ? diffMinutes + 'мин':''}`
    } catch (e) {
        return 'Не является датой'
    }
}
