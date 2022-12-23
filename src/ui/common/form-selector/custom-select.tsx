import styles from './form-selector.module.scss'
import Select, {GroupBase, StylesConfig} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {SelectComponents} from 'react-select/dist/declarations/src/components';
import {components} from './form-selector-creatable-corrector';
import {FieldRenderProps} from 'react-final-form';
import {SelectOptionsType} from './selector-utils';
import {useCallback, useMemo} from 'react';

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
                                  placeholder,
                                  ...rest
                              }: FieldRenderProps<string, HTMLElement> ) => {

    // пустой option для несовпадающих значений
    const empty: SelectOptionsType = { value: '', label: placeholder, key: 'empty' + placeholder, isDisabled: true }

    const handleChange = useCallback(( option: SelectOptionsType | null ) => {
        input.onChange(option?.value)
        if (handleChanger) handleChanger(option?.value)
    }, [ handleChanger, input ])


    const isMultiHandleChange = useCallback(( option: SelectOptionsType[] ) => {
        const value = option.map(( { value } ) => value).join(', ')
        input.onChange(value)
    }, [ input ])

    // корректное отображение значения при мультивыборе
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
        return options ? options.find(( option: SelectOptionsType ) => option.value === inputValue) || empty : empty
    }, [ options ])

    const isError = ( meta.error || meta.submitError ) && meta.touched
    // стили для селектора
    const stylesSelect: StylesConfig<SelectOptionsType> = useMemo(() => ( {
        menu: ( baseStyles ) => ( { ...baseStyles, margin: 0, padding: 0 } ),
        menuList: ( baseStyles ) => ( { ...baseStyles, margin: 0, padding: 0 } ),
        dropdownIndicator: ( baseStyles ) => ( { ...baseStyles, padding: '0 0 0 0' } ),
        indicatorSeparator: ( baseStyles ) => ( { ...baseStyles, display: 'none' } ),
        control: ( baseStyles, { isFocused } ) => ( {
            ...baseStyles,
            boxSizing: 'border-box',
            borderWidth: '2px',
            borderRadius: '12px',
            paddingRight: '6px',
            borderColor: isFocused
                ? '#023E8AFF'
                : isError
                    ? '#C70707BF'
                    : '#92ABC8',
            ':hover': {
                ...baseStyles[':hover'],
                borderColor: '#023E8AFF',
            },
        } ),
        option: ( baseStyles, { isFocused, isSelected, isDisabled } ) => ( {
            ...baseStyles,
            fontSize: '90%',
            lineHeight: 1.1,
            color: isDisabled
                ? '#023E8AFF'
                : '#FFFFFF',
            borderBottom: '.5px solid #92ABC8',
            backgroundColor: isDisabled
                ? '#023E8A66'
                : isSelected
                    ? '#74C259'
                    : isFocused
                        ? '#023E8ACC'
                        : '#023E8AFF',
            ':hover': {
                ...baseStyles[':hover'],
                color: !isDisabled
                    ? 'white'
                    : baseStyles[':hover']?.color,
                backgroundColor: isDisabled
                    ? '#023E8A80'
                    : '#023E8ACC',
            },
        } ),
        singleValue: ( baseStyles, { data } ) => ( {
            ...baseStyles,
            color: data?.isDisabled
                ? 'gray'
                : baseStyles.color,
        } ),
    } ), [ isError ])

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
                    styles={ {
                        menu: stylesSelect.menu,
                        menuList: stylesSelect.menuList,
                        dropdownIndicator: stylesSelect.dropdownIndicator,
                        indicatorSeparator: stylesSelect.indicatorSeparator,
                        control: stylesSelect.control,
                        option: stylesSelect.option,
                        singleValue: stylesSelect.singleValue,
                    } }
                    // для изменяемого input при вводе нового значения
                    components={ components as Partial<SelectComponents<any, boolean, GroupBase<SelectOptionsType>>> }
                    isClearable={ isClearable }
                    backspaceRemovesValue={ false }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ ( newValue ) => {
                        // @ts-ignore-next-line
                        handleChange(newValue)
                    } }
                    isDisabled={ disabled }
                    onCreateOption={ handleCreate }
                    options={ options }
                    value={ optionsCurrent(input.value) }
                    { ...rest }
                />
                : <Select
                    { ...input }
                    // defaultMenuIsOpen //* для облегчения стилизации при открытом списке*//
                    styles={ stylesSelect }
                    components={ { Option } }
                    isClearable={ isClearable }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    onChange={ isMulti ? isMultiHandleChange : handleChange }
                    placeholder={ placeholder }
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
