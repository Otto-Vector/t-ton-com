import React from 'react'
import styles from './form-input-type.module.scss'
import {FieldState, FormApi} from 'final-form'
import NumberFormat from 'react-number-format';


type OwnProps = {
    resetFieldBy?: FormApi // для включения кнопки сброса, необходимо передать значение form из final-form
    placeholder?: string // он же и label внутри поля ввода
    meta: FieldState<any> // передаваемые значения из final-form
    input: any
    readOnly: boolean
    mask?: string // показывает символом сколько осталось ввести данных (по умолчанию равна "_")
    maskFormat?: string // маска форматирования для NumberFormat
    allowEmptyFormatting?: boolean // показывать maskFormat ДО ввода данных
    children?: React.ReactNode
    disabled?: boolean
    textArea?: boolean
    inputType?: 'text' | 'date' | 'email' | 'money'
    min?: string
    max?: string
    errorBottom?: boolean // отображаем ошибку внизу (по умолчаниию - наверху)
    noLabel?: boolean // отключаем label совсем
}


export const FormInputType: React.FC<OwnProps> = (
    {
        input, meta, resetFieldBy, placeholder,
        children, disabled = false, mask = '_', maskFormat,
        textArea, allowEmptyFormatting, inputType = 'text',
        errorBottom, noLabel, min, max, readOnly,
    } ) => {

    const InInput = textArea ? 'textarea' : 'input' // если нужен просто текстовое поле

    // const isError = ( meta.error || meta.submitError ) && meta.touched
    const isError = ( meta.error || meta.submitError ) && ( meta.active || meta.touched )
    const labelToView = ( input.value || allowEmptyFormatting || ( inputType !== 'text' ) ) && !noLabel

    return ( <div className={ styles.inputWrapper + ' ' + styles.search }>
            {/*кнопка для сброса параметров поля
            (проявляется, если переданы методы resetFieldBy={form} в объявленном объекте Field
            а также при введенных данных*/ }
            { resetFieldBy && input.value && !disabled && !readOnly && <div
                className={ styles.clearSearch + ' ' + ( !meta.dirty && styles.clearSearch_unfocused ) }
                onClick={ async () => {
                    await resetFieldBy.change(input.name, '')
                    await resetFieldBy.resetFieldState(input.name)
                } }
            ></div>
            }
            { ( maskFormat || inputType === 'money' ) ? // если формат отсутствует, то на обычный инпут
                <NumberFormat
                    mask={ mask }
                    format={ maskFormat }
                    // fixedDecimalScale={true}
                    decimalScale={ inputType === 'money' ? 2 : 0 }
                    allowEmptyFormatting={ allowEmptyFormatting } // показывает формат при пустых значениях
                    displayType="input"
                    allowNegative={ false }
                    autoComplete="off"
                    onBlur={ input.onBlur }
                    onFocus={ input.onFocus }
                    onChange={ ( value: React.ChangeEvent<HTMLInputElement> ) => input.onChange(value) }
                    onValueChange={ ( { formattedValue } ) =>
                        input.onChange(formattedValue)
                    }
                    type={ inputType }
                    { ...input }
                    className={ styles.input + ' ' + ( isError ? styles.error : '' ) }
                    placeholder={ placeholder }
                    disabled={ disabled || meta.validating }
                >
                </NumberFormat>
                :
                <InInput { ...input }
                         type={ inputType }
                         min={ inputType === 'date' ? min : undefined }
                         max={ inputType === 'date' ? max : undefined }
                         className={ styles.input + ' ' + ( isError ? styles.error : '' ) }
                         placeholder={ placeholder }
                         disabled={ disabled || meta.validating }
                         readOnly={ readOnly }
                />

            }
            { labelToView &&
                <label className={ styles.label }>{ placeholder }</label>
            }
            { children }
            {/*сообщение об ошибке появляется в этом спане*/ }
            { isError && ( <span className={
                styles.errorSpan + ' ' + ( errorBottom ? styles.errorSpan_bottom : styles.errorSpan_top )
            }>{ meta.error || // обычная ошибка
                ( meta.dirtySinceLastSubmit || meta.submitError ) // ошибка из сабмита
            }</span> ) }
        </div>
    )
}

