import React, {useMemo} from 'react'
import {components as cs} from 'react-select';
////////////////////////////////////////
// ЧТОБЫ СДЕЛАТЬ SELECTOR ИЗМЕНЯЕМЫМ //
//////////////////////////////////////
// НАЧАЛО
const NewSingleValue = () => null;

// @ts-ignore
export const NewInput = ( { value: inputValue, isHidden, ...props } ) => {
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

export const components = {
    ...cs,
    Input: NewInput,
    SingleValue: NewSingleValue,
};
// КОНЕЦ //
////////////////////////////////////////