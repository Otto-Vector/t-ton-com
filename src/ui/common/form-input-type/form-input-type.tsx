import React from 'react'
import styles from './form-input-type.module.scss'
import {FieldState, FormApi} from 'final-form'
import NumberFormat from 'react-number-format';


type OwnProps = {
    resetFieldBy?: FormApi
    placeholder?: string
    meta: FieldState<any>
    input: any
    mask?: string
    maskFormat?: string
    allowEmptyFormatting?: boolean
    children?: React.ReactNode
    disabled?: boolean
    textArea?: boolean
    inputType?: 'text' | 'date' | 'email' | 'money'
    errorBottom?: boolean
}


export const FormInputType: React.FC<OwnProps> = (
    {
        input, meta, resetFieldBy, placeholder,
        children, disabled, mask = '_', maskFormat,
        textArea, allowEmptyFormatting, inputType = 'text', errorBottom
    }) => {

    const InInput = textArea ? 'textarea' : 'input' // если нужен просто текстовое поле

    const isError = (meta.error || meta.submitError) && meta.touched

    return (<div className={styles.inputWrapper + ' ' + styles.search}>
            {/*кнопка для сброса параметров поля
            (проявляется, если переданы методы resetFieldBy={form} в объявленном объекте Field
            а также при введенных данных*/}
            {resetFieldBy && input.value && <div
                className={styles.clearSearch + ' ' + (!meta.dirty && styles.clearSearch_unfocused)}
                onClick={() => {
                    resetFieldBy.change(input.name, '')
                    resetFieldBy.resetFieldState(input.name)
                }}
            ></div>
            }
            {(maskFormat || inputType === 'money') ? // если формат отсутствует, то на обычный инпут
                <NumberFormat
                    mask={mask}
                    format={maskFormat}
                    // fixedDecimalScale={true}
                    decimalScale={inputType === 'money' ? 2 : 0}
                    allowEmptyFormatting={allowEmptyFormatting}
                    displayType="input"
                    allowNegative={false}
                    autoComplete="off"
                    onBlur={input.onBlur}
                    onFocus={input.onFocus}
                    onChange={(value: React.ChangeEvent<HTMLInputElement>) => input.onChange(value)}
                    onValueChange={({formattedValue}) =>
                        input.onChange(formattedValue)
                    }
                    type={inputType}
                    {...input}
                    className={styles.input + ' ' + (isError ? styles.error : '')}
                    placeholder={placeholder}
                    disabled={disabled}
                >
                </NumberFormat>
                :
                <InInput type={inputType}
                         {...input}
                         className={styles.input + ' ' + (isError ? styles.error : '')}
                         placeholder={placeholder}
                         disabled={disabled}/>
            }
            {(input.value || allowEmptyFormatting || (inputType !== 'text')) &&
                <label className={styles.label}>{placeholder}</label>
            }
            {children}
            {/*сообщение об ошибке появляется в этом спане*/}
            {isError && (<span className={
                styles.errorSpan +' '+ (errorBottom ? styles.errorSpan_bottom : styles.errorSpan_top)
            }>{meta.error}</span>)}
        </div>
    )
}

