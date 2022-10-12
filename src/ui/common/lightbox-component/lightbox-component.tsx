import React from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import noImage from '../../../media/logo192.png'
import {getImageLightboxStore, getIsLightBoxOpenLightboxStore} from '../../../selectors/utils/lightbox-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {lightBoxStoreActions} from '../../../redux/utils/lightbox-store-reducer'

type LightboxType = {
    // image: string
}

export const LightBoxComponent: React.FC<LightboxType> = () => {
    const isLightBoxOpen = useSelector(getIsLightBoxOpenLightboxStore)
    const image = useSelector(getImageLightboxStore)
    const dispatch = useDispatch()
    const closeLigthBox = () => {
        dispatch(lightBoxStoreActions.setLightBoxClose())
    }

    return ( <div>

            { isLightBoxOpen ? (
                    <Lightbox
                        mainSrc={ image || noImage }
                        onCloseRequest={ closeLigthBox }
                    /> )
                : null
            }
        </div>
    )
}
