import React, {useEffect, useState} from 'react'
import {valuesAreEqual} from '../../../utils/reactMemoUtils';


type Props = {
    onChange?: ( props: any ) => void
    form: any
    onValid?: boolean
}


// отслеживает значения в react-final-form и передаёт их в колбэк (a FormSpy работает с ошибкой https://github.com/final-form/react-final-form/issues/809)
export const FormSpySimple: React.VFC<Props> = ( { onChange, form, onValid } ) => {
    const { values, active, valid } = form.getState()
    const [ currentValues, setCurrentValues ] = useState(values)

    useEffect(() => {
        if (!valuesAreEqual(values, currentValues) && ((onValid && valid) || !onValid)) {
            onChange && onChange(values)
            setCurrentValues(values)
        }
    }, [ values, active, valid ])

    return null
}

export const FormSpySimpleAnyKey: React.VFC<Props> = ( { onChange, form } ) => {
    const { values, active, valid } = form.getState()
    useEffect(() => {
        onChange && onChange(values)
    }, [ values, active, valid ])
    return null
}