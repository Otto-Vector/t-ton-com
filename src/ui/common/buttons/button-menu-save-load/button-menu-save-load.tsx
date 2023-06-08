import React, {ChangeEvent, useState} from 'react'
import styles from './button-menu-save-load.module.scss'
import {ProjectButton, CommonButtonColorModeType} from '../project-button/project-button'
import {MaterialIcon} from '../../tiny/material-icon/material-icon'
import {DownloadSampleFileWrapper} from '../download-sample-file-wrapper/download-sample-file-wrapper'
import {AttachDocumentWrapper} from './attach-document-wrapper/attach-document-wrapper'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {useDispatch} from 'react-redux'
import {getFileNameFromUrl, parseToNormalMoney} from '../../../../utils/parsers'


type OwnProps = {
    title: string
    loadUrl?: string
    onUpload?: ( event: ChangeEvent<HTMLInputElement> ) => void
    colorMode?: CommonButtonColorModeType
    disabled?: boolean
    maximumSizeUpload?: number
}

// кнопка с выпадающим меню загрузки, выгрузки и просмотра файла
export const ButtonMenuSaveLoad: React.ComponentType<OwnProps> = (
    {
        title, loadUrl, onUpload, disabled,
        colorMode = 'blue',
        maximumSizeUpload = 5242880,
    } ) => {

    const [ isOpen, setIsOpen ] = useState(false)
    const [ isMouseOnMenu, setIsMouseOnMenu ] = useState(false)
    const dispatch = useDispatch()

    const onClick = () => {
        setIsOpen(open => !open)
    }

    const rewriteAlertOrUpload = ( changeEvent: ChangeEvent<HTMLInputElement> ) => {
        const action = () => {
            onUpload && onUpload(changeEvent)
        }
        if (changeEvent.target?.files?.length &&
            changeEvent.target.files[0].size > maximumSizeUpload) {
            dispatch<any>(textAndActionGlobalModal({
                text: [ 'Размер файла больше необходимого минимума для сервера:',
                    `${ parseToNormalMoney(maximumSizeUpload / 1024) } Kb`,
                    'Измените размер файла или выберите файл другого размера',
                ],
            }))
        } else {
            loadUrl ?
                dispatch<any>(textAndActionGlobalModal({
                    text: 'Загрузка новых документов, перезатрёт состояние предыдущих, продолжить?',
                    action,
                }))
                : action()
        }
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
            <ProjectButton onClick={ onClick }
                           colorMode={ colorMode }
                           disabled={ disabled || !( onUpload || loadUrl ) }
            >
                <span className={ styles.buttonMenuSaveLoad__text }>{ title }</span>
                <MaterialIcon style={ { fontWeight: '100' } } icon_name={ 'expand_circle_down' }/>
            </ProjectButton>
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
                        <DownloadSampleFileWrapper urlShort={ loadUrl }>
                            <div className={ styles.buttonMenuSaveLoad__menuOption }
                                 title={getFileNameFromUrl(loadUrl)}
                            >
                                <span>{ 'Скачать' }</span>
                                <MaterialIcon icon_name={ 'download' }/>
                            </div>
                        </DownloadSampleFileWrapper>
                        : null
                    }
                </div>
            </>
            }
        </div>
    )
}
