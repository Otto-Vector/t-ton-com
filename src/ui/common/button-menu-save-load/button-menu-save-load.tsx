import React, {ChangeEvent, useState} from 'react'
import styles from './button-menu-save-load.module.scss'
import {Button, CommonButtonColorModeType} from '../button/button'
import {MaterialIcon} from '../material-icon/material-icon'
import {DownloadSampleFile} from '../download-sample-file/download-sample-file'
import {AttachDocumentWrapper} from '../attach-document-wrapper/attach-document-wrapper'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {useDispatch} from 'react-redux'


type OwnProps = {
    title: string
    loadUrl?: string
    onUpload?: ( event: ChangeEvent<HTMLInputElement> ) => void
    colorMode?: CommonButtonColorModeType
    disabled?: boolean
}


export const ButtonMenuSaveLoad: React.FC<OwnProps> = (
    {
        title, loadUrl, onUpload, colorMode = 'blue', disabled,
    } ) => {

    const [ isOpen, setIsOpen ] = useState(false)
    const [ isMouseOnMenu, setIsMouseOnMenu ] = useState(false)
    const dispatch = useDispatch()

    const onClick = () => {
        setIsOpen(open => !open)
    }

    const rewriteAlertOrUpload = ( file: ChangeEvent<HTMLInputElement> ) => {
        const action = () => {
            onUpload && onUpload(file)
        }
        loadUrl ?
            dispatch<any>(textAndActionGlobalModal({
                text: 'Загрузка новых документов, перезатрёт состояние предыдущих, продолжить?',
                action,
            }))
            : action()
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
            <Button onClick={ onClick }
                    colorMode={ colorMode }
                    disabled={ disabled }
            >
                <span className={ styles.buttonMenuSaveLoad__text }>{ title }</span>
                <MaterialIcon style={ { fontWeight: '100' } } icon_name={ 'expand_circle_down' }/>
            </Button>
            { isOpen && <>
                <div className={ styles.buttonMenuSaveLoad__lining }/>
                <div className={ styles.buttonMenuSaveLoad__menu }
                     onMouseOver={ () => {
                         setIsMouseOnMenu(true)
                     } }
                     onMouseLeave={ () => {
                         setIsMouseOnMenu(false)
                     } }
                >
                    { onUpload ?
                        <div className={ styles.buttonMenuSaveLoad__menuOption }>
                            <AttachDocumentWrapper onChange={
                                rewriteAlertOrUpload
                            }>
                                <span>{ 'Загрузить' }</span>
                                <MaterialIcon icon_name={ 'attach_file' }/>
                            </AttachDocumentWrapper>
                        </div>
                        : null
                    }
                    { loadUrl ?
                        <DownloadSampleFile urlShort={ loadUrl }>
                            <div className={ styles.buttonMenuSaveLoad__menuOption }>
                                <span>{ 'Скачать' }</span>
                                <MaterialIcon icon_name={ 'download' }/>
                            </div>
                        </DownloadSampleFile>
                        : null
                    }
                </div>
            </>
            }
        </div>
    )
}
