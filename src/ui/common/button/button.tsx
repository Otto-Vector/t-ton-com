import React from 'react'
import classes from './button.module.scss'

type OwnProps = {
    disabled?: boolean,
    onClick?: () => void,
    colorMode?: 'orange' | 'blue' | 'lightBlue' | 'pink' | 'gray' | 'white'
        | 'noFill' | 'green' | 'red' | 'whiteBlue' | 'redAlert' | 'blueAlert' | 'grayAlert'
    type?: 'button' | 'submit' | 'reset'
    title?: string
    rounded?: boolean
    children?: React.ReactNode
    wordWrap?: boolean
}

export const Button: React.FC<OwnProps> = (
    {
        disabled, onClick, title = '',
        colorMode = 'noFill', rounded,
        type = 'button', children, wordWrap,
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
    >{ // отображаем то что внутри тега button
        children || title
    }
    </button>
}

