
import { format } from 'date-format-parse';

export const parseAllNumbers = (val: string|undefined): string => val ? val.replace(/[^\d]/g,'') : ''
export const parseFIO = (val: string|null): string => val ? val.replace(/[^-А-ЯA-Zа-яa-z\s]/,'') : ''
export const parseCharsAndNumbers = (val: string|null): string => val ? val.replace(/[^-А-ЯA-Zа-яa-z\s\d]/,'') : ''
// export const replaceFirstCharEightToSeven = (val: string|null): string => val ? val.replace(/^[8]/,'7') : ''

// output string dd-mm
// export const dateFormat2 = (date: Date): string => date.toLocaleDateString().split('.').filter((_, i) => i < 2).join('-')
export const ddMmFormat = ( date: Date): string => format(date, 'DD-MM');
export const ddMmYearFormat = ( date: Date | undefined): string | undefined=> date ? format(date, 'DD-MM-YYYY') : undefined;
export const hhMmDdMmFormat = ( date: Date | undefined): string | undefined=> date ? format(date, 'HH:mm DD-MM') : undefined;
// date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })

// add a day
export const addOneDay = (date: Date): Date => new Date(date.getTime() + 86400000);

