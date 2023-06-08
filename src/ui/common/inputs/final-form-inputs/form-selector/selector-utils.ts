export type SelectOptionsType = {
    value: string,
    label: string,
    subLabel?: string,
    extendInfo?: string
    key: string,
    isDisabled?: boolean,
    isDefault?: boolean
}
// утилита для переделывания массива строк в значения для Selector
export const stringArrayToSelectValue = ( value: string[] ): SelectOptionsType[] =>
    value.map(( el ) => ( { value: el, label: el, key: el } ))