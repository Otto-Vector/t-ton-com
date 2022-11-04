import styles from './form-selector.module.scss'
import Select, {GroupBase} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {SelectComponents} from 'react-select/dist/declarations/src/components';
import {components} from './form-selector-creatable-corrector';
import {FieldRenderProps} from 'react-final-form';
import {SelectOptionsType} from './selector-utils';
import {useCallback} from 'react';

export const CustomSelect = ( {
                                  input,
                                  options,
                                  meta,
                                  isClearable,
                                  isCreatableSelect, //
                                  handleCreate, // этот параметр только для creatableSelect
                                  handleChanger,
                                  errorTop,
                                  disabled,
                                  defaultValue,
                                  isMulti,
                                  ...rest
                              }: FieldRenderProps<string, HTMLElement> ) => {

    const handleChange = useCallback(( option: SelectOptionsType | null ) => {
        input.onChange(option?.value)
        if (handleChanger) handleChanger(option?.value)
    }, [])

    const isMultiHandleChange = useCallback(( option: SelectOptionsType[] ) => {
        const value = option.map(( { value } ) => value).join(', ')
        input.onChange(value)
    }, [])

    const isMultiLabelToValueChange = useCallback(( option, { context } ) => {
        return context === 'menu' ? option.label : option.value
    }, [])

    const isMultiSelectOptionsCurrent = useCallback(( toFormValue = '' ): SelectOptionsType[] | '' => {
        const input = toFormValue?.split(', ')
        const zzz = input.map(( val = '' ) => options.find(( { value = '' } ) => value === val)) as SelectOptionsType[]
        return ( zzz.length < 1 ) ? '' : zzz
    }, [])

    const optionsCurrent = useCallback(( inputValue: string ) => {
        return options ? options.find(( option: SelectOptionsType ) => option.value === inputValue) : ''
    }, [])
    const isError = ( meta.error || meta.submitError ) && meta.touched

    return (
        <>
            { isCreatableSelect
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
                    // onInputChange={handleChange} // возможно будет нужен при обработке нового значения
                    // aria-label={'555'}
                    // aria-labelledby={'666'}
                    isDisabled={ disabled }
                    onCreateOption={ handleCreate }
                    options={ options }
                    value={ optionsCurrent(input.value) }
                    { ...rest }
                />
                : <Select
                    { ...input }
                    isClearable={ isClearable }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ isMulti ? isMultiHandleChange : handleChange }
                    isMulti={ isMulti }
                    options={ options }
                    isDisabled={ disabled }
                    formatOptionLabel={ isMulti ? isMultiLabelToValueChange : undefined }
                    // defaultValue={ defaultValue }
                    value={ isMulti ? isMultiSelectOptionsCurrent(input.value) : optionsCurrent(input.value) }
                    { ...rest }
                /> }
            { isError &&
                <span className={ styles.errorSpan + ' ' + styles[`errorSpan_${ errorTop ? 'top' : 'bottom' }`] }>
                    { meta.error }
                </span> }
        </>
    )
}
