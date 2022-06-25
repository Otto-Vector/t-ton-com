import React from 'react'
import styles from './request-map-center.module.scss'

import searchMap from '../../../media/mapsicle-map-create.png'
import historyMap from '../../../media/mapsicle-map-history.png'
import {RequestModesType} from '../request-section';
import {YandexMapWithRoute} from '../../common/yandex-map-component/yandex-map-component';
import {useSelector} from 'react-redux';
import {getCurrentDistanceRequestStore, getRouteRequestStore} from '../../../selectors/forms/request-form-reselect';

type OwnProps = {
    requestModes: RequestModesType,
}

export const RequestMapCenter: React.FC<OwnProps> = ( { requestModes } ) => {

    // {!requestModes.historyMode
    //     ? <img src={ searchMap } alt="карта маршрутa"/>
    //     : <img src={ historyMap } alt="карта маршрута и водителя"/>
    // }
    const route = useSelector(getRouteRequestStore)
    const distance = useSelector(getCurrentDistanceRequestStore)
    const routeCenterIndex = route ? Math.ceil(route.length / 2) : 0
    let testCenter: [ number, number ] = [ 55.185346, 25.14226 ]
    const center = route ? route[routeCenterIndex] as [number,number] : testCenter
    let testLine: number[][] = [ [ 55.185346, 25.14226 ], [ 55.185336, 25.14236 ] ]
    let zoom = distance < 200 ? 9 : 6

    return (
        <div className={ styles.requestMapCenter }>
            <div className={ styles.requestMapCenter__wrapper }>
                <YandexMapWithRoute center={ center }
                                    polyline={ route || testLine }
                                    zoom={zoom}
                />
            </div>
        </div>


    )
}
