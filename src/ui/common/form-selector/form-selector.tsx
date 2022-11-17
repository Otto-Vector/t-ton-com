import React from 'react'
import styles from './form-selector.module.scss'
import './react-select-ton.scss'
import {Field} from 'react-final-form'
import {CustomSelect} from './custom-select';
import {SelectOptionsType} from './selector-utils';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';


type OwnProps = {
    nameForSelector: string
    values: { value: string, label: string, key: string }[]
    label?: string
    placeholder?: string
    validate?: any
    isClearable?: boolean
    isCreatableSelect?: boolean
    handleCreate?: Function
    handleChanger?: Function
    errorTop?: boolean
    disabled?: boolean
    defaultValue?: SelectOptionsType | SelectOptionsType[]
    isMulti?: boolean
    isSubLabelOnOption?: boolean
}


// передача в обработчик react-form
export const FormSelector: React.FC<OwnProps> = React.memo (
    ( {
                                                      values,
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
                              options={ values }
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
                />
            ) }
        </Field>
    </div>
}, valuesAreEqual)


