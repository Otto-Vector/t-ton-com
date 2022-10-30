import React, {useCallback, useEffect, useMemo} from 'react'
import styles from './form-selector.module.scss'
import './react-select-ton.scss'
import {Field, FieldRenderProps} from 'react-final-form'
import Select, {components as cs, GroupBase} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {SelectComponents} from 'react-select/dist/declarations/src/components';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';

type OwnProps = {
    named: string
    values: { value: string, label: string, key: string }[]
    label?: string
    placeholder?: string
    validate?: any
    isClearable?: boolean
    creatableSelect?: boolean
    handleCreate?: Function
    handleChanger?: Function
    errorTop?: boolean
    disabled?: boolean
    defaultValue?: SelectOptionsType
}
////////////////////////////////////////
// ЧТОБЫ СДЕЛАТЬ SELECTOR ИЗМЕНЯЕМЫМ //
//////////////////////////////////////
// НАЧАЛО
const NewSingleValue = () => null;

// @ts-ignore
const NewInput = ( { value: inputValue, isHidden, ...props } ) => {
    const {
        selectProps: { value, getOptionLabel },
    } = props;
    const label = useMemo(() => {
        if (!value) {
            return '';
        }
        return getOptionLabel(value);
    }, [ getOptionLabel, value ]);
    const v = useMemo(() => {
        if (!inputValue) {
            return label;
        }
        return inputValue;
    }, [ inputValue, label ]);
    const hidden = useMemo(() => {
        if (v) {
            return false;
        }
        return isHidden;
    }, [ isHidden, v ]);
    // @ts-ignore
    return <cs.Input isHidden={ hidden } value={ v } { ...props } />;
};

const components = {
    ...cs,
    Input: NewInput,
    SingleValue: NewSingleValue,
};
// КОНЕЦ //
////////////////////////////////////////


// передача в обработчик react-form
export const FormSelector: React.FC<OwnProps> = React.memo(( {
                                                                 values,
                                                                 named,
                                                                 label,
                                                                 placeholder,
                                                                 validate,
                                                                 isClearable = false,
                                                                 creatableSelect = false,
                                                                 handleCreate,
                                                                 handleChanger,
                                                                 errorTop,
                                                                 disabled,
                                                                 defaultValue,
                                                             } ) => {

    return <div className={ styles.dropdown }>
        { label && <label className={ styles.label }>{ label }</label> }
        <Field className={ styles.select }
               name={ named }
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
                              creatableSelect={ creatableSelect }
                              handleCreate={ handleCreate }
                              handleChanger={ handleChanger }
                              errorTop={ errorTop }
                              disabled={ disabled }
                              defaultValue={ defaultValue }
                />
            ) }
        </Field>
    </div>
}, valuesAreEqual)


const CustomSelect = ( {
                           input,
                           options,
                           meta,
                           isClearable,
                           creatableSelect, //
                           handleCreate, // этот параметр только для creatableSelect
                           handleChanger,
                           errorTop,
                           disabled,
                           defaultValue,
                           ...rest
                       }: FieldRenderProps<string, HTMLElement> ) => {

    const handleChange = useCallback(( option: SelectOptionsType | null ) => {
        input.onChange(option?.value)
        if (handleChanger) handleChanger(option?.value)
    }, [])


    const isError = ( meta.error || meta.submitError ) && meta.touched

    return (
        <>
            { creatableSelect
                ?
                <CreatableSelect
                    { ...input }
                    // для изменяемого input при вводе нового значения
                    components={ components as Partial<SelectComponents<any, boolean, GroupBase<unknown>>> }
                    isClearable={ isClearable }
                    backspaceRemovesValue={ false }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ handleChange }
                    // onInputChange={handleChange} // возможно будет нужен при обработке нового знаения
                    // aria-label={'555'}
                    // aria-labelledby={'666'}
                    isDisabled={ disabled }
                    onCreateOption={ handleCreate }
                    options={ options }
                    value={ options ? options.find(( option: SelectOptionsType ) => option.value === input.value) : '' }
                    { ...rest }
                />
                : <Select
                    { ...input }
                    isClearable={ isClearable }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ handleChange }
                    // isMulti={true}
                    options={ options }
                    isDisabled={ disabled }
                    value={ options ? options.find(( option: SelectOptionsType ) => option.value === input.value) : '' }
                    { ...rest }
                /> }
            { isError &&
                <span className={ styles.errorSpan + ' ' + styles[`errorSpan_${ errorTop ? 'top' : 'bottom' }`] }>
                    { meta.error }
                </span> }
        </>
    );
};


export type SelectOptionsType = { value: string, label: string, key: string, isDisabled?: boolean, subLabel?: string }
// утилита для переделывания массива строк в значения для Selector
export const stringArrayToSelectValue = ( value: string[] ): SelectOptionsType[] =>
    value.map(( el ) => ( { value: el, label: el, key: el } ))