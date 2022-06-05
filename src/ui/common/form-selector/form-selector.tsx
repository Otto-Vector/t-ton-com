import React from 'react'
import styles from './form-selector.module.scss'
import './react-select-ton.scss'
import {Field, FieldRenderProps} from 'react-final-form'
import Select from 'react-select';

type OwnProps = {
    named: string
    values: { value: string, label: string, key: string }[]
    label?: string
    placeholder?: string
    validate?: any
}


const CustomSelect = ( { input, options, meta, ...rest }: FieldRenderProps<string, HTMLElement> ) => {

    const handleChange = ( option: SelectOptionType | null ) => {
        input.onChange(option?.value);
    };
    const isError = ( meta.error || meta.submitError ) && meta.touched
    return (
        <>
            <Select
                { ...input }
                { ...rest }
                classNamePrefix={ 'react-select-ton' }
                onChange={ handleChange }
                options={ options }
                value={ options ? options.find(( option: SelectOptionType ) => option.value === input.value) : '' }
            />
            { isError && <span className={ styles.errorSpan }>{ meta.error }</span> }
        </>
    );
};

export const FormSelector: React.FC<OwnProps> = ( {
                                                      values,
                                                      named,
                                                      label,
                                                      placeholder,
                                                      validate,
                                                  } ) => {

    return <div className={ styles.dropdown }>
        { label && <label className={ styles.label }>{ label }</label> }
        <Field className={ styles.select }
               name={ named }
               placeholder={ placeholder }
               validate={ validate }
        >
            { ( { input, meta, placeholder } ) => (
                <CustomSelect input={ input } meta={ meta } options={ values } placeholder={ placeholder }/>
            ) }
        </Field>
    </div>
}


type SelectOptionType = {
    label: string;
    value: string;
};

export type SelectOptions = { value: string, label: string, key: string }

export const stringArrayToSelectValue = ( value: string[] ): SelectOptions[] =>
    value.map(( el ) => ( { value: el, label: el, key: el } ))