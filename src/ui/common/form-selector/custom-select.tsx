import React, {useCallback, useMemo} from 'react'
import styles from './form-selector.module.scss'
import Select, {GroupBase, StylesConfig} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {SelectComponents} from 'react-select/dist/declarations/src/components';
import {components} from './form-selector-creatable-corrector';
import {FieldInputProps, FieldMetaState} from 'react-final-form';
import {SelectOptionsType} from './selector-utils';
import {SelectorStyles} from './use-selector-styles';
import {FormSelectorProps} from './form-selector';


type FormInputType = {
    input: FieldInputProps<string>
    meta: FieldMetaState<any>
}

export const CustomSelect: React.FC<Partial<FormSelectorProps> & FormInputType> = ( {
                                                                                        input,
                                                                                        meta,
                                                                                        options,
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
                                                                                    } ) => {

    // пустой option для несовпадающих значений
    const empty: SelectOptionsType = {
        value: '',
        label: placeholder || '',
        key: 'empty' + placeholder,
        isDisabled: true,
    }

    const handleChange = useCallback(( option: SelectOptionsType | undefined ) => {
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

    // формат отображения пунктов меню при наличии контекста subLabel
    const formatOptionSubLabel = useCallback(( option, { context } ) => {
        return context === 'menu' ? option.label + ( ( isSubLabelOnOption && option.subLabel ) ? ' - ' + option.subLabel : '' ) : option.label
    }, [ isSubLabelOnOption ])

    // выбор отображения конкретного пункта меню в мульти-селекторе
    const isMultiSelectOptionsCurrent = useCallback(( toFormValue = '' ): SelectOptionsType[] | '' => {
        const input = toFormValue?.split(', ')
        const zzz = input.map(( val = '' ) => options?.find(( { value = '' } ) => value === val)) as SelectOptionsType[]
        return ( zzz.length < 1 ) ? '' : zzz
    }, [ options ])

    // выбор отображения конкретного пункта меню в одиночном селекторе
    const optionsCurrent = useCallback(( inputValue: string ) =>
            options?.find(( option: SelectOptionsType ) => option.value === ( defaultValue || inputValue )) || empty
        , [ options, defaultValue ])

    // условие для отображения ошибки
    const isError = ( meta.error || meta.submitError ) && meta.touched
    // стили для селектора
    const stylesSelect = useMemo(() => SelectorStyles(isError), [ isError ])

    // обёртка для доп контента на клик по отключенному пункту селектора
    const OptionWithOnClickOnDisabled = ( props: any ) => <div
        onClick={ () => {
            onDisableHandleClick && props?.data?.isDisabled && onDisableHandleClick(props?.data as SelectOptionsType)
        } }>
        <components.Option { ...props } />
    </div>

    return (
        <>
            { isCreatableSelect
                ?
                <CreatableSelect
                    { ...input }
                    styles={ stylesSelect }
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
                    // defaultMenuIsOpen //* для облегчения стилизации при открытом списке *//
                    styles={ stylesSelect as StylesConfig<'' | SelectOptionsType> }
                    components={ { Option: OptionWithOnClickOnDisabled } }
                    isClearable={ isClearable }
                    aria-invalid={ 'grammar' }
                    classNamePrefix={ 'react-select-ton' }
                    // @ts-ignore-next-line
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
