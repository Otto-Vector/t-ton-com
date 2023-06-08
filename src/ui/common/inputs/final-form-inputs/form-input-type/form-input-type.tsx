import React from 'react'
import styles from './form-input-type.module.scss'
import {FormApi} from 'final-form'
import NumberFormat from 'react-number-format'
import ReactInputMask from 'react-input-mask'
import {valuesAreEqualFormInput} from '../../../../../utils/reactMemoUtils'
import {FieldMetaState} from 'react-final-form'
import {MaterialIcon} from '../../../tiny/material-icon/material-icon'


type OwnProps = {
    // для включения кнопки сброса, необходимо передать значение form из final-form
    resetFieldBy?: FormApi
    // он же и label внутри поля ввода
    placeholder?: string
    // передаваемые значения из final-form
    meta: FieldMetaState<any>
    // input: InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>
    input: any
    readOnly: boolean
    // показывает символом сколько осталось ввести данных (по умолчанию равна "_")
    mask?: string
    // маска форматирования для NumberFormat и ReactInputMask
    maskFormat?: string
    allowEmptyFormatting?: boolean // показывать maskFormat ДО ввода данных
    children?: React.ReactNode
    disabled?: boolean
    // тэг input будет станет textarea
    textArea?: boolean
    inputType?: 'text' | 'date' | 'email' | 'money'
    min?: string
    max?: string
    // отображаем ошибку внизу (по умолчаниию - наверху)
    errorBottom?: boolean
    // отключаем label совсем
    noLabel?: boolean
    isInputMask?: boolean
    formatCharsToMaskA?: string
}


export const FormInputType: React.ComponentType<OwnProps> = React.memo((
    {
        input, meta, resetFieldBy, placeholder,
        children, disabled = false, mask = '_', maskFormat,
        textArea, allowEmptyFormatting, inputType = 'text',
        errorBottom, noLabel, min, max, readOnly,
        formatCharsToMaskA, isInputMask = false,
    } ) => {

    // если нужно просто текстовое поле
    const InInput = textArea ? 'textarea' : 'input'

    const isError = ( meta.error || meta.submitError ) && ( meta.active || meta.touched )
    const labelToView = ( input.value || allowEmptyFormatting || ( inputType !== 'text' ) ) && !noLabel

    const formatChars = { '#': '[0123456789]', 'A': formatCharsToMaskA || '[a-zA-ZА-Яа-я]' }

    return ( <div className={ styles.inputWrapper + ' ' + styles.search }>
            {/*кнопка для сброса параметров поля*/ }
            { ( resetFieldBy && input.value && !disabled && !readOnly )
                /*(проявляется, если переданы методы resetFieldBy={form}
                в объявленном объекте Field, а также при введенных данных*/
                ? <div
                    className={ styles.clearSearch + ' ' + ( !meta.dirty && styles.clearSearch_unfocused ) }
                    onClick={ async () => {
                        await resetFieldBy.change(input.name + '', '')
                        await resetFieldBy.resetFieldState(input.name + '')
                    } }
                ><MaterialIcon icon_name={ 'close' }/></div>
                : null
            }
            {// если формат отсутствует, то на обычный инпут
                ( ( maskFormat || inputType === 'money' ) && !isInputMask )
                    ? <NumberFormat
                        children={ undefined }
                        mask={ mask }
                        format={ maskFormat }
                        // fixedDecimalScale={true}
                        decimalSeparator={ ',' }
                        decimalScale={ inputType === 'money' ? 2 : 0 }
                        allowEmptyFormatting={ allowEmptyFormatting } // показывает формат при пустых значениях
                        displayType="input"
                        allowNegative={ false }
                        autoComplete="off"
                        onBlur={ input.onBlur }
                        onFocus={ input.onFocus }
                        onChange={ ( value: React.ChangeEvent<HTMLInputElement> ) => input?.onChange && input.onChange(value) }
                        // onValueChange={ ( { formattedValue } ) => input?.onChange && input.onChange(formattedValue) }
                        // @ts-ignore
                        type={ inputType }
                        { ...input }
                        className={ styles.input + ' ' + ( isError ? styles.error : '' ) }
                        placeholder={ placeholder }
                        disabled={ disabled || meta.validating }
                    />
                    : isInputMask // если прописана доп.маска с буквами, то
                        ? <ReactInputMask
                            { ...input }
                            className={ styles.input + ' ' + ( isError ? styles.error : '' ) }
                            mask={ maskFormat || '' }
                            placeholder={ placeholder }
                            //@ts-ignore
                            formatChars={ formatChars }
                            maskChar={ mask }
                            alwaysShowMask={ allowEmptyFormatting }
                            disabled={ disabled || meta.validating }
                            readOnly={ readOnly }
                        />
                        // ура, "обычный" инпут
                        : <InInput { ...input }
                                   type={ inputType }
                                   min={ inputType === 'date' ? min : undefined }
                                   max={ inputType === 'date' ? max : undefined }
                                   className={ styles.input + ' ' + ( isError ? styles.error : '' ) }
                                   placeholder={ placeholder }
                                   disabled={ disabled || meta.validating }
                                   readOnly={ readOnly }
                        />
            }
            {/*плейсхолдер уходит в заголовок*/ }
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
}, valuesAreEqualFormInput)
