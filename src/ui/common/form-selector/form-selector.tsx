import React from 'react'
import styles from './form-selector.module.scss'
import './react-select-ton.scss'
import {Field, FieldRenderProps} from 'react-final-form'
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

type OwnProps = {
    named: string
    values: { value: string, label: string, key: string }[]
    label?: string
    placeholder?: string
    validate?: any
    isClearable?: boolean
    creatableSelect?: boolean
    handleCreate?: Function
}


export const FormSelector: React.FC<OwnProps> = ( {
                                                      values,
                                                      named,
                                                      label,
                                                      placeholder,
                                                      validate,
                                                      isClearable = false,
                                                      creatableSelect = false,
                                                      handleCreate,
                                                  } ) => {

    return <div className={ styles.dropdown }>
        { label && <label className={ styles.label }>{ label }</label> }
        <Field className={ styles.select }
               name={ named }
               placeholder={ placeholder }
               validate={ validate }
        >
            { ( { input, meta, placeholder } ) => (
                <CustomSelect input={ input } meta={ meta } options={ values } placeholder={ placeholder }
                              isClearable={ isClearable }
                              creatableSelect={ creatableSelect }
                              handleCreate={ handleCreate }
                />
            ) }
        </Field>
    </div>
}

type SelectOptionType = {
    label: string;
    value: string;
};

const CustomSelect = ( {
                           input,
                           options,
                           meta,
                           isClearable,
                           creatableSelect, //
                           handleCreate, // ???????? ???????????????? ???????????? ?????? creatableSelect
                           ...rest
                       }: FieldRenderProps<string, HTMLElement> ) => {

    const handleChange = ( option: SelectOptionType | null ) => {
        input.onChange(option?.value);
    }

    const isError = ( meta.error || meta.submitError ) && meta.touched

    return (
        <>
            { creatableSelect
                ?
                <CreatableSelect
                    { ...input }
                    { ...rest }
                    isClearable={ isClearable }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ handleChange }
                    onCreateOption={ handleCreate }
                    options={ options }
                    value={ options ? options.find(( option: SelectOptionType ) => option.value === input.value) : '' }
                />
                : <Select
                    { ...input }
                    { ...rest }
                    isClearable={ isClearable }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ handleChange }
                    options={ options }
                    value={ options ? options.find(( option: SelectOptionType ) => option.value === input.value) : '' }
                /> }
            { isError && <span className={ styles.errorSpan }>{ meta.error }</span> }
        </>
    );
};


export type SelectOptions = { value: string, label: string, key: string }
// ?????????????? ?????? ?????????????????????????? ?????????????? ?????????? ?? ???????????????? ?????? Selector
export const stringArrayToSelectValue = ( value: string[] ): SelectOptions[] =>
    value.map(( el ) => ( { value: el, label: el, key: el } ))