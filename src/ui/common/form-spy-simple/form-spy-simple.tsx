import React, {useEffect} from 'react'
import {FormApi} from 'final-form';
import {OneRequestType} from '../../../types/form-types';
import {AnyObject} from 'react-final-form';

type Props<T = AnyObject> = {
    onChange: ( props: any ) => void
    form: FormApi<T>
}


// toDo: избавиться от повторений
export const FormSpySimple: React.VFC<Props> = ( { onChange, form } ) => {
    const { values, valid } = form.getState()
    useEffect(() => {
        onChange({ values, valid })
    }, [ values, valid ])

    return null
}

// отслеживает значения в react-final-form и передаёт их в колбэк (a FormSpy работает с ошибкой https://github.com/final-form/react-final-form/issues/809)
export const FormSpySimpleRequest: React.VFC<Props<OneRequestType>> = ( { onChange, form } ) => {
    const { values, valid } = form.getState()
    useEffect(() => {
        onChange({ values, valid })
    }, [ values, valid ])

    return null
}
