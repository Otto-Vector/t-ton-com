import React from 'react'
import truckToRightPNG from '../../../../media/tracks-of-status/trackToRight.png'
import truckLoadPNG from '../../../../media/tracks-of-status/trackLoadFuel.png'
import truckToLeftPNG from '../../../../media/tracks-of-status/truckLeft.png'
import noRespTruckPNG from '../../../../media/tracks-of-status/noRespTrack.png'
import haveRespTrackPNG from '../../../../media/tracks-of-status/haveRespTrack.png'
import transparentPNG from '../../../../media/tracks-of-status/transparent32x32.png'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import styles from '../table-component.module.scss'

// ячейки столбца с картинками статуса
export const LocalStatusCell: React.ComponentType<OneRequestTableTypeReq> = ( { localStatus }: OneRequestTableTypeReq ) =>
                    <img className={ styles.tableComponent__statusImage }
                         alt={ 'status_icon' }
                         title={ localStatus }
                         src={
                             localStatus === 'груз у получателя' ? truckToLeftPNG
                                 : localStatus === 'груз у водителя' ? truckLoadPNG
                                     : localStatus === 'водитель выбран' ? truckToRightPNG
                                         : localStatus === 'нет ответов' ? noRespTruckPNG
                                             : localStatus === 'есть ответы' ? haveRespTrackPNG
                                                 : transparentPNG
                         }
                        // добавим прозрачность на неотвеченные заявки
                         style={ localStatus === 'нет ответов' ? { opacity: .5 }
                             : localStatus === 'есть ответы' ? { // чёрный в Chocolate. Источник https://isotropic.co/tool/hex-color-to-css-filter/
                                 filter: 'invert(42%) sepia(64%) saturate(622%) hue-rotate(343deg) brightness(99%) contrast(95%)',
                             } : undefined
                         }
                    />
