import React from 'react'
import styles from './form-selector.module.scss'
import {Field} from 'react-final-form'
import {CustomSelect} from './custom-select';
import {SelectOptionsType} from './selector-utils';
import {valuesAreEqual} from '../../../../../utils/reactMemoUtils';


export type FormSelectorProps = {
    nameForSelector: string
    options: SelectOptionsType[]
    label?: string
    placeholder?: string
    validate?: any
    isClearable?: boolean
    isCreatableSelect?: boolean
    handleCreate?: ((inputValue: string) => void) | undefined
    handleChanger?: Function
    errorTop?: boolean
    disabled?: boolean
    defaultValue?: string
    isMulti?: boolean
    // добавляет отображение поля subLabel
    isSubLabelOnOption?: boolean
    // обработка клика мышью по неактивному полю
    onDisableHandleClick?: Function
}


// передача в обработчик react-form
export const FormSelector: React.ComponentType<FormSelectorProps> = React.memo(
    ( {
          options,
          nameForSelector,
          label,
          placeholder,
          validate,
          isClearable = false,
          isCreatableSelect = false,
          isMulti = false,
          handleCreate,
          handleChanger,
          errorTop,
          disabled,
          defaultValue,
          isSubLabelOnOption,
          onDisableHandleClick,
      } ) => {

        return <div className={ styles.dropdown }>
            { label && <label className={ styles.label }>{ label }</label> }
            <Field className={ styles.select }
                   name={ nameForSelector }
                   placeholder={ placeholder }
                   validate={ validate }
                   disabled={ disabled }
            >
                { ( { input, meta, placeholder } ) => (
                    <CustomSelect input={ input }
                                  meta={ meta }
                                  options={ options }
                                  placeholder={ placeholder }
                                  isClearable={ isClearable }
                                  isCreatableSelect={ isCreatableSelect }
                                  handleCreate={ handleCreate }
                                  handleChanger={ handleChanger }
                                  errorTop={ errorTop }
                                  disabled={ disabled }
                                  defaultValue={ defaultValue }
                                  isMulti={ isMulti }
                                  isSubLabelOnOption={ isSubLabelOnOption }
                                  onDisableHandleClick={ onDisableHandleClick }
                    />
                ) }
            </Field>
        </div>
    }, valuesAreEqual)
