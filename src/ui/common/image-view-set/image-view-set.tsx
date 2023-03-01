import React, {ChangeEvent, useState} from 'react'
import {Preloader} from '../preloader/preloader'
import styles from './image-view-set.module.scss'
import {AppStateType} from '../../../redux/redux-store'
import {useDispatch, useSelector} from 'react-redux'
import {AttachImageButton} from '../attach-image-button/attach-image-button'
import imageCompression from 'browser-image-compression'
import {lightBoxStoreActions} from '../../../redux/utils/lightbox-store-reducer'
import noImage from '../../../media/logo192.png'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'

type OwnProps = {
    imageURL?: string
    onSelectNewImageFileToSend?: ( image: File | undefined ) => void
    title?: string
}

export const ImageViewSet: React.FC<OwnProps> = React.memo((
    {
        imageURL,
        onSelectNewImageFileToSend,
        title = 'Добавить/изменить фото',
    } ) => {

    const dispatch = useDispatch()
    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const [ selectedImage, setSelectedImage ] = useState<File>()
    const [ fileIsCompressed, setFileIsCompressed ] = useState(false)

    const imageURLToShow = ( selectedImage && URL.createObjectURL(selectedImage) )
        || ( imageURL && currentURL + imageURL )
        || noImage

    const setLightBoxImage = ( image?: string ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const sendPhotoFile = async ( event: ChangeEvent<HTMLInputElement> ) => {
        setFileIsCompressed(true)
        if (event.target.files && event.target.files.length > 0) {
            const imageFile = event.target.files[0]
            const options = {
                maxSizeMB: 0.9,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                fileType: 'image/jpeg',
            }
            try { // компресим файл и отправляем
                const compressedFile = await imageCompression(imageFile, options)
                setSelectedImage(compressedFile)
                onSelectNewImageFileToSend && onSelectNewImageFileToSend(compressedFile)
            } catch (error) {
                alert(error)
            }
        }
        setFileIsCompressed(false)
    }

    return (
        <div className={ styles.imageViewSet }
             title={ title }>
            { fileIsCompressed
                ? <Preloader/>
                : <>
                    <img className={ styles.imageViewSet__photo }
                         src={ imageURLToShow }
                         alt="image"
                         onClick={ () => {
                             setLightBoxImage(imageURLToShow)
                         } }
                    />
                    <AttachImageButton onChange={ sendPhotoFile }/>
                </>
            }

        </div>
    )
}, valuesAreEqual)
