import React from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import noImagePhoto from '../../../media/noImagePhoto2.png'
import {getImageLightboxStore, getIsLightBoxOpenLightboxStore} from '../../../selectors/lightbox-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {lightBoxStoreActions} from '../../../redux/lightbox-store-reducer'

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
                        mainSrc={ image || noImagePhoto }
                        onCloseRequest={ closeLigthBox }
                    /> )
                : null
            }
        </div>
    )
}
