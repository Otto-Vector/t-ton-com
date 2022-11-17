import React, {useEffect, useState} from 'react'
import {valuesAreEqual} from '../../../utils/reactMemoUtils';


type Props = {
    onChange?: ( props: any ) => void
    form: any
    // реагирует на изменения, если все поля обработаны без ошибок
    isOnValidChange?: boolean
    // реагирует на изменения, при переходе из одного поля в другое
    isOnActiveChange?: boolean
}


// отслеживает значения в react-final-form и передаёт их в колбэк (a FormSpy работает с ошибкой https://github.com/final-form/react-final-form/issues/809)
export const FormSpySimple: React.VFC<Props> = ( { onChange, form, isOnValidChange ,isOnActiveChange} ) => {
    const { values, active, valid } = form.getState()
    const [ currentValues, setCurrentValues ] = useState(values)
    const [ currentActive, setCurrentActive ] = useState(active)

    useEffect(() => {
        if (!valuesAreEqual(values, currentValues)
            && ((isOnValidChange && valid) || !isOnValidChange)
            && ((isOnActiveChange && (active!==currentActive)) || !isOnActiveChange)
        ) {
            onChange && onChange(values)
            isOnValidChange && setCurrentValues(values)
            isOnActiveChange && setCurrentActive(active)
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