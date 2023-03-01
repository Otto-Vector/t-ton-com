import React, {useState} from 'react'
import styles from './button-menu-save-load.module.scss'
import {Button, CommonButtonColorMode} from '../button/button'
import {MaterialIcon} from '../material-icon/material-icon'

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

    const onClick = () => {
        setIsOpen(open => !open)
    }

    return ( <div className={ styles.buttonMenuSaveLoad }
                  onMouseLeave={ () => {
                      setIsOpen(false)
                  } }
                  onBlur={ () => {
                      setIsOpen(false)
                  } }
        >
            <Button onClick={ onClick } colorMode={ buttonColorMode }>
                <span className={ styles.buttonMenuSaveLoad__text }>{ titleValue }</span>
                <MaterialIcon style={ { fontWeight: '100' } } icon_name={ 'expand_circle_down' }/>
            </Button>
            { isOpen && <>
                <div className={ styles.buttonMenuSaveLoad__lining }/>
                <div className={ styles.buttonMenuSaveLoad__menu }>
                    <div className={ styles.buttonMenuSaveLoad__menuOption }>
                        <span>{ 'Загрузить' }</span>
                        <MaterialIcon icon_name={ 'attach_file' }/>
                    </div>
                    <div className={ styles.buttonMenuSaveLoad__menuOption }>
                        <span>{ 'Скачать' }</span>
                        <MaterialIcon icon_name={ 'file_upload' }/>
                    </div>
                </div>
            </>
            }
        </div>
    )
}
