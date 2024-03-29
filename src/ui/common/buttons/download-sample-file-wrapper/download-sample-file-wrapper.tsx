import axios from 'axios'
import React, {useEffect, useState} from 'react'
import styles from './download-sample-file-wrapper.module.scss'
import {useDownloadFile} from './use-hook/useDownloadFile'
import {SizedPreloader} from '../../tiny/preloader/preloader'
import {useDispatch, useSelector} from 'react-redux'
import {AppStateType} from '../../../../redux/redux-store'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {getFileNameFromUrl} from '../../../../utils/parsers'

export enum ButtonState {
    Primary = 'Primary',
    Loading = 'Loading',
}

type OwnProps = {
    urlShort?: string
    disabled?: boolean
}

// правильно загружает файл при клике на обёртку
export const DownloadSampleFileWrapper: React.ComponentType<OwnProps> = (
    { children, urlShort, disabled = false } ) => {
    const [ buttonState, setButtonState ] = useState<ButtonState>(
        ButtonState.Primary,
    )
    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const serverPlusUrlShort = urlShort ? currentURL + urlShort : ''
    const [ showAlert, setShowAlert ] = useState<boolean>(false)
    const dispatch = useDispatch()

    const preDownloading = () => setButtonState(ButtonState.Loading)
    const postDownloading = () => setButtonState(ButtonState.Primary)

    const onErrorDownloadFile = () => {
        setButtonState(ButtonState.Primary)
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
    }

    const getFileName = () =>
        getFileNameFromUrl(urlShort?.split('/').pop() || '')

    const downloadFileAxiosToBlob = ( serverPlusUrlShort: string ) => () => {
        return axios.get(serverPlusUrlShort, { responseType: 'blob' })
    }

    const { ref, url, download, name } = useDownloadFile({
        apiDefinition: downloadFileAxiosToBlob(serverPlusUrlShort),
        preDownloading,
        postDownloading,
        onError: onErrorDownloadFile,
        getFileName,
    })

    useEffect(() => {
        if (showAlert) {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: [ 'Не получилось загрузить файл!', 'Файл: <b>' + getFileNameFromUrl(urlShort) ],
            }))
            setShowAlert(false)
        }
    }, [ showAlert ])

    return (
        <>
            <a href={ url } download={ name } style={ { display: 'none' } } ref={ ref }/>
            <div className={ styles.downloadSampleFileWrapper }
                 // блокируем специально, либо при пустом url
                 onClick={ (!urlShort || disabled) ? () => null : download }>
                { buttonState === ButtonState.Loading ?
                    <SizedPreloader sizeHW={ '1rem' }/>
                    : children
                }
            </div>
        </>
    )
}
