import React from 'react'
import classes from './button.module.scss'

export type CommonButtonColorMode = 'orange' | 'blue' | 'lightBlue' | 'pink' | 'gray' | 'white'
        | 'noFill' | 'green' | 'red' | 'whiteBlue' | 'whiteBlueDoc' | 'redAlert' | 'blueAlert' | 'grayAlert'

type OwnProps = {
    disabled?: boolean,
    onClick?: () => void,
    colorMode?: CommonButtonColorMode
    type?: 'button' | 'submit' | 'reset'
    title?: string
    rounded?: boolean
    children?: React.ReactNode
    wordWrap?: boolean
    isSelectOnTab?: boolean
    // кнопка загружает контент
    download?: boolean
    style?: React.CSSProperties
}

export const Button: React.FC<OwnProps> = (
    {
        disabled, onClick, title = '',
        colorMode = 'noFill', rounded,
        type = 'button', children, wordWrap,
        isSelectOnTab = true,
        style,
    } ) => {

    return <button className={
        `${ classes.button } 
        ${ classes['button_' + colorMode] } 
        ${ rounded && classes.button_rounded } 
        ${ wordWrap && classes.button_wrap }`
    }
                   disabled={ disabled }
                   onClick={ onClick }
                   type={ type }
                   title={ title + ( disabled ? ' (кнопка неактивна)' : '' ) }
                   tabIndex={ isSelectOnTab ? 0 : -1 }
                   style={ style }
    >{ // отображаем то что внутри тега button
        children || title
    }
    </button>
}

