import React from 'react'
import styles from './form-type.module.scss'
import {FieldState, FormApi} from 'final-form'

type OwnProps = {
    resetFieldBy: FormApi
    placeholder?: string
    meta: FieldState<any>
    input: any
    children?: React.ReactNode
}


const FormType = (FormType: 'textarea' | 'input'): React.FC<OwnProps> => (
    {
        input, meta, resetFieldBy, placeholder,
        children
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
            <FormType
                {...input}
                className={styles.input + ' ' + (isError ? styles.error : '')}
                placeholder={placeholder}
            >
            </FormType>
            {children}
            {/*сообщение об ошибке появляется в этом спане*/}
            {isError && (<span className={styles.errorSpan}>{meta.error}</span>)}
        </div>
    )
}

export const TextArea = FormType('textarea')
export const Input = FormType('input')
