
import { format } from 'date-format-parse';

export const parseAllNumbers = (val: string|undefined): string => val ? val.replace(/[^\d]/g,'') : ''
export const parseFIO = (val: string|null): string => val ? val.replace(/[^-А-ЯA-Zа-яa-z\s]/,'') : ''
export const parseCharsAndNumbers = (val: string|null): string => val ? val.replace(/[^-А-ЯA-Zа-яa-z\s\d]/,'') : ''
export const replacePTS = (val: string|null): string => val ? val.replace(/^[АВЕКМНОРСТУХ]\d{3}(?<!000)[АВЕКМНОРСТУХ]{2}\d{2,3}$/ui,'') : ''


// output string dd-mm
export const ddMmFormat = ( date: Date): string => format(date, 'DD-MM');
// output string dd.mm
export const ddDotMmFormat = ( date: Date): string => format(date, 'DD.MM');
// output string HH:mm
export const hhMmFormat = ( date: Date): string => format(date, 'HH:mm');
// output string DD-MM-YYYY
export const ddMmYearFormat = ( date: Date | undefined): string | undefined=> date ? format(date, 'DD-MM-YYYY') : undefined;
// output string YYYY-MM-DD
export const yearMmDdFormat = ( date: Date | undefined): string | undefined=> date ? format(date, 'YYYY-MM-DD') : undefined;
// output string HH:mm DD-MM
export const hhMmDdMmFormat = ( date: Date | undefined): string | undefined=> date ? format(date, 'HH:mm DD-MM') : undefined;

// add a day
export const addOneDay = (date: Date): Date => new Date(date.getTime() + 86400000);

export const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
}