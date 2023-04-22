import React from 'react'
import classes from './button.module.scss'

export type CommonButtonColorModeType = 'orange' | 'blue' | 'lightBlue' | 'pink' | 'gray' | 'white'
        | 'noFill' | 'green' | 'red' | 'whiteBlue' | 'whiteBlueDoc' | 'redAlert' | 'blueAlert' | 'grayAlert'

type OwnProps = {
    disabled?: boolean,
    onClick?: () => void,
    colorMode?: CommonButtonColorModeType
    type?: 'button' | 'submit' | 'reset'
    title?: string
    label?: string
    // id формы для привязки кнопки submit вне тега <form>
    form?: string
    rounded?: boolean
    // включить перенос слов в кнопке
    wordWrap?: boolean
    // включить/выключить выбор кнопки при табуляции
    isSelectOnTab?: boolean
    // проброс стилей от родительского элемента
    style?: React.CSSProperties
}

export const Button: React.FC<OwnProps> = (
    {
        disabled, onClick, title = '',
        colorMode = 'noFill', rounded,
        type = 'button', children, wordWrap,
        isSelectOnTab = true,
        style, label, form
    } ) => {

    return <button className={
        `${ classes.button } 
        ${ classes['button_' + colorMode] } 
        ${ rounded ? classes.button_rounded : ''} 
        ${ wordWrap ? classes.button_wrap : ''}`
    }
                   disabled={ disabled }
                   onClick={ onClick }
                   type={ type }
                   title={ (label || title) + ( disabled ? ' (кнопка неактивна)' : '' ) }
                   tabIndex={ isSelectOnTab ? 0 : -1 }
                   form={form}
                   style={ style }
    >{ // отображаем то что внутри тега button
        children || title
    }
    </button>
}
