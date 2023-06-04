import React from 'react'
import Select, {components, GroupBase, OptionProps} from 'react-select'
import {SelectOptionsType} from '../../common/form-selector/selector-utils'
import {tableSelectorStyles} from './table-selector-style'



// обёртка для доп контента с применением иконок (если они присутствуют
const OptionWithIcon: React.ComponentType<OptionProps<SelectOptionsType, boolean, GroupBase<SelectOptionsType>>> = ( props ) =>
    <div style={ { position: 'relative'} }>
        { props?.data?.subLabel ? <img src={ props?.data?.subLabel }
                                       style={ {
                                           height: 24, width: 24,
                                           position: 'absolute',
                                           left: 7,
                                           top: 3,
                                           // так как иконки чёрные, меняем им цвет на белый
                                           filter: 'invert(100%)',
                                       } }

        /> : null }
        <components.Option { ...props } children={ props?.children }/>
    </div>

type OwnType = {
    placeholder?: string
    options: SelectOptionsType[]
    selectedValue: string
    onChange: ( value: string ) => void
}

export const TableFilterSelect: React.ComponentType<OwnType> = ( {
                                                                     placeholder,
                                                                     selectedValue,
                                                                     options,
                                                                     onChange,
                                                                 } ) => {
    // выставляем значение в нужном формате
    const value = selectedValue ? {
        value: selectedValue,
        label: selectedValue,
    } as SelectOptionsType : null

    return <Select
        isSearchable={ false }
        styles={ tableSelectorStyles() }
        components={ { Option: OptionWithIcon } }
        // @ts-ignore-next-line
        onChange={ ( { value } ) =>
            onChange(value) }
        placeholder={ placeholder }
        options={ options }
        value={ value }
        isDisabled={ false }
    />
}
