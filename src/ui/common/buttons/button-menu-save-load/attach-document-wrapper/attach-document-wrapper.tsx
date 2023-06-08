import React from 'react'
import styles from './attach-document-wrapper.module.scss'

type OwnProps = {
    onChange: Function
}

export const AttachDocumentWrapper: React.ComponentType<OwnProps> = ( { children, onChange } ) => {
    return (
        <>
            { children }
            <input type={ 'file' }
                   className={ styles.attachDocumentButton__hiddenInput }
                   accept={ '.png, .jpeg, .jpg, .bmp, .doc, .docx, .xls, .xlsx, .xml, .rar, .zip' }
                   title={''}
                   onChange={ ( e ) => {
                       onChange(e)
                   } }
            />
        </>
    )
}
