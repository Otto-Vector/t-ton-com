import {format} from 'date-format-parse';

// output string dd-mm
export const ddMmFormat = ( date: Date ): string => format(date, 'DD-MM');
// output string dd.mm
export const ddDotMmFormat = ( date: Date ): string => format(date, 'DD.MM');
// output string HH:mm
export const hhMmFormat = ( date: Date ): string => format(date, 'HH:mm');
// output string DD-MM-YYYY
export const ddMmYearFormat = ( date: Date | undefined ): string | undefined => date ? format(date, 'DD-MM-YYYY') : undefined;
// output string YYYY-MM-DD
export const yearMmDdFormat = ( date: Date | undefined ): string | undefined => date ? format(date, 'YYYY-MM-DD') : undefined;
// output string HH:mm DD-MM
export const hhMmDdMmFormat = ( date: Date | undefined ): string | undefined => date ? format(date, 'HH:mm DD-MM') : undefined;

// add a day
export const addOneDay = ( date: Date ): Date => new Date(date.getTime() + 86400000);
// add N days
export const addNDay = ( date: Date, daysToAdd = 1 ): Date => new Date(date.getTime() + ( 86400000 * daysToAdd ));

export const isToday = ( someDate: Date ) => {
    const today = new Date()
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear()
}

export const randomDate = ( start: Date, end: Date ): Date => {
    return new Date(start.getTime() + Math.random() * ( end.getTime() - start.getTime() ));
}
export const randomPassportDate = (): string => yearMmDdFormat(randomDate(new Date(1990, 1, 1), new Date(2018, 1, 1))) || ''