import React, {memo} from 'react'
import styles from './request-map-center.module.scss'

import {RequestModesType} from '../request-section'
import {YandexMapWithRoute} from '../../common/yandex-map-component/yandex-map-component'
import {useSelector} from 'react-redux'
import {
    getInitialDistanceRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {stringToCoords} from '../../../utils/parsers'

type OwnProps = {
    requestModes: RequestModesType,
    driverCoords?: string
    fromCity?: string
    toCity?: string
}

export const RequestMapCenter: React.FC<OwnProps> = memo(( { requestModes, driverCoords, fromCity, toCity } ) => {

    let testCenter: [ number, number ] = [ 55.5907807700034, 84.09127066601563 ]
    let testLine: number[][] = [ [ 55.185346, 25.14226 ], [ 55.185336, 26.14236 ] ]

    const distance = useSelector(getInitialDistanceRequestStore) || 0
    const route = useSelector(getRoutesParsedFromPolylineRequestStore) || testLine
    const routeCenterIndex = route ? Math.ceil(route.length / 2) : 0
    const center = route !== testLine ? route[routeCenterIndex] as [ number, number ] : testCenter

    // bounds почему-то не всегда отрабатывает поставил зум вручную
    // const zoomCoords = [route[0],route[route.length-1]]
    const maxZoom = requestModes.acceptDriverMode ? 10 : undefined
    const driverHere = !requestModes.acceptDriverMode && driverCoords ? stringToCoords(driverCoords) : undefined
    const zoom = ( distance < 200 ) ? 9 : ( distance > 2000 ) ? 4 : 6

    return (
        <div className={ styles.requestMapCenter }>
            <div className={ styles.requestMapCenter__wrapper }>
                <YandexMapWithRoute center={ center }
                                    polyline={ route || testLine }
                                    zoom={ zoom }
                                    maxZoom={ maxZoom }
                                    driverHere={ driverHere }
                                    fromCity={ fromCity }
                                    toCity={ toCity }
                                    isEnableCoordsClick={!requestModes.acceptDriverMode}
                    // bounds={zoomCoords}
                />
            </div>
        </div>
    )
}, valuesAreEqual)
