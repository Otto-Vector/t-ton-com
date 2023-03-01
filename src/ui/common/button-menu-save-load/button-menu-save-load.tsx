import React, {useState} from 'react'
import styles from './button-menu-save-load.module.scss'
import {Button, CommonButtonColorMode} from '../button/button'
import {MaterialIcon} from '../material-icon/material-icon'
import {DownloadSampleFile} from '../download-sample-file/download-sample-file'

type OwnProps = {
    titleValue: string
    loadUrl: string
    onUpload: () => void
    buttonColorMode?: CommonButtonColorMode
}


export const ButtonMenuSaveLoad: React.FC<OwnProps> = (
    {
        titleValue, loadUrl, onUpload, buttonColorMode = 'blue',
    } ) => {

    const [ isOpen, setIsOpen ] = useState(false)
    const [ isMouseOnMenu, setIsMouseOnMenu ] = useState(false)

    const onClick = () => {
        setIsOpen(open => !open)
    }

    return (
        <div className={ styles.buttonMenuSaveLoad }
             onMouseLeave={ () => {
                 setIsOpen(false)
             } }
             onBlur={ () => {
                 setIsOpen(isMouseOnMenu)
             } }
        >
            <Button onClick={ onClick } colorMode={ buttonColorMode }>
                <span className={ styles.buttonMenuSaveLoad__text }>{ titleValue }</span>
                <MaterialIcon style={ { fontWeight: '100' } } icon_name={ 'expand_circle_down' }/>
            </Button>
            { isOpen && <>
                <div className={ styles.buttonMenuSaveLoad__lining }/>
                <div className={ styles.buttonMenuSaveLoad__menu }
                     onMouseOver={ () => {
                         setIsMouseOnMenu(true)
                     } }
                >
                    <div className={ styles.buttonMenuSaveLoad__menuOption }>
                        <span>{ 'Загрузить' }</span>
                        <MaterialIcon icon_name={ 'attach_file' }/>
                    </div>
                    <DownloadSampleFile urlShort={ loadUrl }>
                        <div className={ styles.buttonMenuSaveLoad__menuOption }>
                            <span>{ 'Скачать' }</span>
                            <MaterialIcon icon_name={ 'download' }/>
                        </div>
                    </DownloadSampleFile>
                </div>
            </>
            }
        </div>
    )
}
