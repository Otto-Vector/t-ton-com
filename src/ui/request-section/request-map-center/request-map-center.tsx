import React from 'react'
import styles from './request-map-center.module.scss'

import {RequestModesType} from '../request-section';
import {YandexMapWithRoute} from '../../common/yandex-map-component/yandex-map-component';
import {useSelector} from 'react-redux';
import {getRouteRequestStore} from '../../../selectors/forms/request-form-reselect';

type OwnProps = {
    requestModes: RequestModesType,
}

export const RequestMapCenter: React.FC<OwnProps> = ( { requestModes } ) => {

    let testCenter: [ number, number ] = [ 55.185346, 25.14226 ]
    let testLine: number[][] = [ [ 55.185346, 25.14226 ], [ 55.185336, 25.14236 ] ]

    const route = useSelector(getRouteRequestStore) || testLine
    const routeCenterIndex = route ? Math.ceil(route.length / 2) : 0
    const center = route ? route[routeCenterIndex] as [number,number] : testCenter
    const zoomCoords = [route[0],route[route.length-1]]

    return (
        <div className={ styles.requestMapCenter }>
            <div className={ styles.requestMapCenter__wrapper }>
                <YandexMapWithRoute center={ center }
                                    polyline={ route || testLine }
                                    bounds={zoomCoords}
                />
            </div>
        </div>


    )
}
