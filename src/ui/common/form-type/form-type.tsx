import React from 'react'
import styles from './form-type.module.scss'
import {FieldState, FormApi} from 'final-form'
import NumberFormat from 'react-number-format';


type OwnProps = {
    resetFieldBy: FormApi
    placeholder?: string
    meta: FieldState<any>
    input: any
    mask?: string
    maskFormat?: string
    children?: React.ReactNode
    disabled?: boolean
}


export const InputNumber: React.FC<OwnProps> = (
    {
        input, meta, resetFieldBy, placeholder,
        children, disabled, mask='_', maskFormat
    }) => {

    const isError = (meta.error || meta.submitError) && meta.touched

    return (<div className={styles.inputWrapper + ' ' + styles.search}>
            {/*кнопка для сброса параметров поля
            (проявляется, если переданы методы resetFieldBy={form} в объявленном объекте Field*/}
            {resetFieldBy && <div
                className={styles.clearSearch + ' ' + (!meta.dirty && styles.clearSearch_unfocused)}
                onClick={() => {
                    resetFieldBy.change(input.name, '')
                    resetFieldBy.resetFieldState(input.name)
                }}
            ></div>
            }

            <NumberFormat
                mask={mask}
                format={maskFormat}
                // fixedDecimalScale={true}
                displayType="input"
                allowNegative={false}
                autoComplete="off"
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                onChange={(value: React.ChangeEvent<HTMLInputElement>) => input.onChange(value)}
                onValueChange={({formattedValue}) =>
                    input.onChange(formattedValue)
                }
                type={'text'}
                {...input}
                className={styles.input + ' ' + (isError ? styles.error : '')}
                placeholder={placeholder}
                disabled={disabled}
            >
            </NumberFormat>
        {input.value && <label className={styles.label}>{placeholder}</label>}
            {children}
            {/*сообщение об ошибке появляется в этом спане*/}
            {isError && (<span className={styles.errorSpan}>{meta.error}</span>)}
        </div>
    )
}

