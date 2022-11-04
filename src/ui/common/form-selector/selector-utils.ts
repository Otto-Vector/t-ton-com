export type SelectOptionsType = { value: string, label: string, key: string, isDisabled?: boolean, subLabel?: string }
// утилита для переделывания массива строк в значения для Selector
export const stringArrayToSelectValue = ( value: string[] ): SelectOptionsType[] =>
    value.map(( el ) => ( { value: el, label: el, key: el } ))