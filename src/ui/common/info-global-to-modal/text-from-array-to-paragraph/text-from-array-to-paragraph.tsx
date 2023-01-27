import React from 'react'
import styles from './text-from-array-to-paragraph.module.scss'

const paragraph = ( line: string ) => <p className={ styles.textFromArrayToParagraph } key={ line }>{ line }</p>

export const textFromArrayToParagraph = ( text: string | string[] ) =>
    Array.isArray(text) ? text.map(paragraph) : paragraph(text.toString())