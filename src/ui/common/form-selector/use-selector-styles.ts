import {SelectOptionsType} from './selector-utils';
import {StylesConfig} from 'react-select';

export const SelectorStyles = ( isError: boolean ): StylesConfig<SelectOptionsType> => ( {
    menu: ( baseStyles ) => ( {
        ...baseStyles,
        margin: 0, padding: 0,
        backgroundColor: 'whitesmoke',
        width: 'fit-content',
        minWidth: '-webkit-fill-available',
        maxWidth: '600px',
    } ),
    menuList: ( baseStyles ) => ( { ...baseStyles, margin: 0, padding: 0 } ),
    dropdownIndicator: ( baseStyles ) => ( { ...baseStyles, padding: '0' } ),
    indicatorSeparator: ( baseStyles ) => ( { ...baseStyles, display: 'none' } ),
    indicatorsContainer: ( baseStyles ) => ( { ...baseStyles, padding: '0' } ),
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
            : 'white',
        textShadow: '.5px .5px blue',
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
} )