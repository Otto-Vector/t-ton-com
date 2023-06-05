import {SelectOptionsType} from '../../common/form-selector/selector-utils'
import {StylesConfig} from 'react-select'

export const tableSelectorStyles = (): StylesConfig<SelectOptionsType> => ( {
    menu: ( baseStyles ) => ( {
        ...baseStyles,
        margin: 0, padding: 0,
        backgroundColor: 'whitesmoke',
        width: 'fit-content',
        minWidth: '-webkit-fill-available',
    } ),
    container: ( baseStyles ) => ( { ...baseStyles, height: '100%' } ),
    placeholder: ( baseStyles ) => ( { ...baseStyles, color: 'whitesmoke' } ),
    menuList: ( baseStyles ) => ( { ...baseStyles, margin: 0, padding: 0 } ),
    dropdownIndicator: ( baseStyles ) => ( { ...baseStyles, padding: 0 } ),
    indicatorSeparator: ( baseStyles ) => ( { ...baseStyles, display: 'none' } ),
    indicatorsContainer: ( baseStyles ) => ( { ...baseStyles, padding: 0 } ),
    clearIndicator: ( baseStyles ) => ( { ...baseStyles, padding: 0 } ),
    control: ( baseStyles, { isFocused, isDisabled } ) => ( {
        ...baseStyles,
        borderWidth: 0,
        height: '100%',
        width: '180px',
        minHeight: '100%',
        borderRadius: 9999,
        backgroundColor: '#023e8a',
        paddingLeft: '8px',
        paddingRight: '6px',
        lineHeight: 1.2,
        transition: 'box-shadow .2s ease-in-out',
        opacity: isDisabled ? '.4' : 'inherit',
        boxShadow: isFocused
            ? 'inset 0 0 10px #ffffff' : 'inset 0 0 0 #ffffff',
        ':hover': {
            ...baseStyles[':hover'],
            boxShadow: 'inset 0 0 5px #ffffff',
        },
        ':active': {
            ...baseStyles[':active'],
            boxShadow: 'inset 0 0 1px #ffffff',
        },

    } ),
    option: ( baseStyles, { isFocused, isSelected, isDisabled ,data} ) => ( {
        ...baseStyles,
        fontSize: '90%',
        lineHeight: 1,
        fontWeight: 'normal',
        // отступ выставляется при наличии иконки, которая в данном контексте записывается в subLabel
        paddingLeft: data.subLabel ? 40 : baseStyles.padding,
        color: isDisabled
            ? '#023E8AFF'
            : 'white',
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
    valueContainer: ( baseStyles ) => ( {
        ...baseStyles,
        fontSize: '100%',
        color: 'whitesmoke',
    } ),
    singleValue: ( baseStyles, { data } ) => ( {
        ...baseStyles,
        color: data?.value === '' ? 'whitesmoke' : '#C70707',
    } ),
    input: ( baseStyles ) => ( {
        ...baseStyles,
        color: 'whitesmoke',
    } ),

} )
