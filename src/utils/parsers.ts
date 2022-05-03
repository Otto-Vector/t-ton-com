
export const parseAllNumbers = (val: string|null): string => val ? val.replace(/[^\d]/g,'') : ''
// export const replaceFirstCharEightToSeven = (val: string|null): string => val ? val.replace(/^[8]/,'7') : ''
