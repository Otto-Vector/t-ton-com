import React from 'react'
import styles from './text-from-array-to-paragraph.module.scss'

// если в тексте есть тэг <b>, то вставляем его как HTML элемент
const boldSeparator = ( line: string ) =>
    // ищем <b>, плюс небольшая защита от "левого" контента
    line?.length && line.length < 1000 && line.includes('<b>')
        ? <span dangerouslySetInnerHTML={ { __html: line } }/>
        : line

// перевод строки в параграф со своим стилем
const Paragraph = ( line: string ) =>
    <p className={ styles.textFromArrayToParagraph } key={ line }>{ boldSeparator(line) }</p>

// проверка на массив с передачей в функцию параграфа
export const textFromArrayToParagraph = ( text: string | string[] ) =>
    Array.isArray(text) ? text.map(Paragraph) : Paragraph(text?.toString())
