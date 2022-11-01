import React, {useEffect, useState} from 'react'

type Props = {
    onChange: ( props: any ) => void
    form: any
    onValid?: boolean
}


// отслеживает значения в react-final-form и передаёт их в колбэк (a FormSpy работает с ошибкой https://github.com/final-form/react-final-form/issues/809)
export const FormSpySimple: React.VFC<Props> = ( { onChange, form, onValid = false } ) => {
    const { values, active, valid } = form.getState()
    const [ lastActive, setLastActive ] = useState<typeof active>('')
    useEffect(() => {
        // если активное поле валидно
        if (onValid && active && form.getFieldState(active)?.valid) onChange(values)
        // применяется только при переходе или выходе из актива любого поля
        if (active !== lastActive) {
            onChange(values)
            setLastActive(active)
        }
    }, [ values, active, valid ])

    return null
}

export const FormSpySimpleAnyKey: React.VFC<Props> = ( { onChange, form } ) => {
    const { values, active, valid } = form.getState()
    useEffect(() => {
        onChange(values)
    }, [ values, active, valid ])
    return null
}