import React, {memo} from 'react'
import styles from './request-map-center.module.scss'

import {RequestModesType} from '../request-section'
import {RouteMapCenter} from './route-map-center/route-map-center'
import {useSelector} from 'react-redux'
import {getRoutesParsedFromPolylineRequestStore} from '../../../selectors/forms/request-form-reselect'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {positionsToCorrectBounds, stringToCoords} from '../../../utils/map-utils'
import {OneEmployeeNoPhotoIdReqType} from '../../../api/local-api/options/employee.api'

type OwnProps = {
    requestModes: RequestModesType,
    driver: OneEmployeeNoPhotoIdReqType
    fromCity?: string
    toCity?: string
}

export const RequestMapCenter: React.ComponentType<OwnProps> = memo(( { requestModes, driver, fromCity, toCity } ) => {

    const testCenter: [ number, number ] = [ 55.5907807700034, 84.09127066601563 ]
    const testLine: number[][] = [ [ 55.185346, 25.14226 ], [ 55.185336, 26.14236 ] ]

    const route = useSelector(getRoutesParsedFromPolylineRequestStore) || testLine
    const routeCenterIndex = route ? Math.ceil(route.length / 2) : 0
    const center = route !== testLine ? route[routeCenterIndex] as [ number, number ] : testCenter

    // автоматический зум по размеру маршрута
    const zoomCoords: number[][] = positionsToCorrectBounds({
        start: route[0],
        finish: route[route.length - 1],
    })
    const maxZoom = requestModes.isAcceptDriverMode ? 10 : undefined
    const driverHere = requestModes.isStatusMode ? stringToCoords(driver.coordinates) : undefined

    return (
        <div className={ styles.requestMapCenter }>
            <div className={ styles.requestMapCenter__wrapper }>
                <RouteMapCenter center={ center }
                                polyline={ route || testLine }
                                maxZoom={ maxZoom }
                                driverHere={ driverHere }
                                driver={ driver }
                                fromCity={ fromCity }
                                toCity={ toCity }
                                isEnableCoordsClick={ !requestModes.isAcceptDriverMode }
                                boundsToMapState={ zoomCoords }
                                requestModes={ requestModes }
                />
            </div>
        </div>
    )
}, valuesAreEqual)
