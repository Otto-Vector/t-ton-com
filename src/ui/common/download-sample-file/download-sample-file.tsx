import axios from 'axios'
import React, {useState} from 'react'
import {useDownloadFile} from '../../../use-hooks/useDownloadFile'
import {SizedPreloader} from '../preloader/preloader'
import {useSelector} from 'react-redux'
import {AppStateType} from '../../../redux/redux-store'

export enum ButtonState {
    Primary = 'Primary',
    Loading = 'Loading',
}

type OwnProps = {
    urlShort: string
    label: string
    disabled?: boolean
}

export const DownloadSampleFile: React.FC<OwnProps> = ( { urlShort, label, disabled = false } ) => {
    const [ buttonState, setButtonState ] = useState<ButtonState>(
        ButtonState.Primary,
    )
    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const serverPlusUrlShort = currentURL + urlShort
    const [ showAlert, setShowAlert ] = useState<boolean>(false)

    const preDownloading = () => setButtonState(ButtonState.Loading)
    const postDownloading = () => setButtonState(ButtonState.Primary)

    const onErrorDownloadFile = () => {
        setButtonState(ButtonState.Primary)
        setShowAlert(true)
        setTimeout(() => {
            setShowAlert(false)
        }, 3000)
    }

    const getFileName = ( urlShort: string ) => () => {
        return urlShort.split('/').reverse()[0]
    }

    const downloadFileAxiosToBlob = ( serverPlusUrlShort: string ) => () => {
        return axios.get(serverPlusUrlShort, { responseType: 'blob' })
    }

    const { ref, url, download, name } = useDownloadFile({
        apiDefinition: downloadFileAxiosToBlob(serverPlusUrlShort),
        preDownloading,
        postDownloading,
        onError: onErrorDownloadFile,
        getFileName: getFileName(urlShort),
    })

    return (
        <>
            { showAlert && <p style={ { color: 'red' } }> { 'Не получилось загрузить!' } </p> }
            <a href={ url } download={ name } style={ { display: 'none' } } ref={ ref }/>
            <div onClick={ disabled ? () => null : download }>
                { buttonState === ButtonState.Loading
                    ? <SizedPreloader sizeHW={ '15px' }/>
                    : ( showAlert
                            ? <p style={ { color: 'red' } }> { 'Не получилось загрузить файл!' } </p>
                            : label
                    )
                }
            </div>
        </>
    )
}