import styles from './form-selector.module.scss'
import Select, {ControlProps, GroupBase, OptionContext, OptionProps} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {SelectComponents} from 'react-select/dist/declarations/src/components';
import {components} from './form-selector-creatable-corrector';
import {FieldRenderProps} from 'react-final-form';
import {SelectOptionsType} from './selector-utils';
import {useCallback} from 'react';
import {StylesConfigFunction} from 'react-select/dist/declarations/src/styles';

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
                                  isSubLabelOnOption,
                                  onDisableHandleClick,
                                  ...rest
                              }: FieldRenderProps<string, HTMLElement> ) => {

    const handleChange = useCallback(( option: SelectOptionsType | null ) => {
        input.onChange(option?.value)
        if (handleChanger) handleChanger(option?.value)
    }, [ handleChanger ])

    const isMultiHandleChange = useCallback(( option: SelectOptionsType[] ) => {
        const value = option.map(( { value } ) => value).join(', ')
        input.onChange(value)
    }, [])

    const isMultiLabelToValueChange = useCallback(( option, { context } ) => {
        return context === 'menu' ? option.label : option.value
    }, [])

    const formatOptionSubLabel = useCallback(( option, { context } ) => {
        return context === 'menu' ? option.label + ( isSubLabelOnOption ? option.subLabel ? ' - ' + option.subLabel : '' : '' ) : option.label
    }, [ isSubLabelOnOption ])

    const isMultiSelectOptionsCurrent = useCallback(( toFormValue = '' ): SelectOptionsType[] | '' => {
        const input = toFormValue?.split(', ')
        const zzz = input.map(( val = '' ) => options.find(( { value = '' } ) => value === val)) as SelectOptionsType[]
        return ( zzz.length < 1 ) ? '' : zzz
    }, [ options ])

    const optionsCurrent = useCallback(( inputValue: string ) => {
        return options ? options.find(( option: SelectOptionsType ) => option.value === inputValue) : ''
    }, [ options ])

    const isError = ( meta.error || meta.submitError ) && meta.touched

    const styleControl: StylesConfigFunction<ControlProps<any, any, GroupBase<any>>> = ( baseStyles ) => ( {
        ...baseStyles,
        borderColor: isError ? '#C70707BF' : '#92ABC8',
    } )

    // обёртка для доп контента на клик по отключенному пункту селектора
    const Option = ( props: any ) => <div
        onClick={ () => {
            onDisableHandleClick && props.data.isDisabled && onDisableHandleClick(props.data as SelectOptionsType)
        } }>
        <components.Option { ...props } />
    </div>

    return (
        <>
            { isCreatableSelect
                ?
                <CreatableSelect
                    { ...input }
                    styles={ { control: styleControl } }
                    // для изменяемого input при вводе нового значения
                    components={ components as Partial<SelectComponents<any, boolean, GroupBase<unknown>>> }
                    isClearable={ isClearable }
                    backspaceRemovesValue={ false }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ handleChange }
                    // onInputChange={handleChange} // возможно будет нужен при обработке нового значения
                    isDisabled={ disabled }
                    onCreateOption={ handleCreate }
                    options={ options }
                    value={ optionsCurrent(input.value) }
                    { ...rest }
                />
                : <Select
                    { ...input }
                    // defaultMenuIsOpen //* для облегчения стилизации при открытом списке*//
                    // defaultValue={ defaultValue }
                    styles={ { control: styleControl } }
                    components={ { Option } }
                    isClearable={ isClearable }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ isMulti ? isMultiHandleChange : handleChange }
                    isMulti={ isMulti }
                    options={ options }
                    isDisabled={ disabled }
                    formatOptionLabel={ isMulti ? isMultiLabelToValueChange : formatOptionSubLabel }
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
