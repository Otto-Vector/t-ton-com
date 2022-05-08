
export const parseAllNumbers = (val: string|null): string => val ? val.replace(/[^\d]/g,'') : ''
export const parseFIO = (val: string|null): string => val ? val.replace(/[^-А-ЯA-Zа-яa-z\s]/,'') : ''
// export const replaceFirstCharEightToSeven = (val: string|null): string => val ? val.replace(/^[8]/,'7') : ''
