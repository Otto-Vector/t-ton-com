import React from 'react'
import styles from './text-from-array-to-paragraph.module.scss'

// если в тексте есть тэг <b>, то вставляем его как HTML элемент
const boldSeparator = ( line: string ) => {
    // ищем свои болды, плюс небольшая защита от "левого" контента
    const colonNumber = line.length < 1000 ? line.search('<b>') : -1
    if (colonNumber >= 0) {
        return <span dangerouslySetInnerHTML={ { __html: line } }></span>
    }
    return line
}

const Paragraph = ( line: string ) => {
    return <p className={ styles.textFromArrayToParagraph } key={ line }>{ boldSeparator(line) }</p>
}

export const textFromArrayToParagraph = ( text: string | string[] ) =>
    Array.isArray(text) ? text.map(Paragraph) : Paragraph(text.toString())
