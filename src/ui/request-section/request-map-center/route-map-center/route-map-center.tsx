import React, {useEffect, useMemo, useRef, useState} from 'react'
import {YandexMapComponent} from '../../../common/yandex-map-component/yandex-map-component'
import {coordinatesFromTargetType, MapRequestRoad} from '../../../common/yandex-map-component/map-request-road'
import {Button, FullscreenControl, MapState, Placemark} from 'react-yandex-maps'
import {renderToString} from 'react-dom/server'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {
    boundsOffsetCorrector,
    directionOfBounds,
    isOutOfBounds,
    positionToBoundsLine,
} from '../../../../utils/map-utils'
import {useDispatch} from 'react-redux'
import {Portal} from '../../../common/portals/Portal'
import {AddDriversView} from '../../../add-drivers-form/add-drivers-view'
import {OneEmployeeNoPhotoIdReqType} from '../../../../api/local-api/options/employee.api'

type ToRouteMap = {
    center: [ number, number ]
    driverHere?: [ number, number ]
    driver: OneEmployeeNoPhotoIdReqType
    polyline: number[][]
    bounds?: MapState['bounds']
    zoom?: number
    maxZoom?: number
    fromCity?: string
    toCity?: string
    isEnableCoordsClick?: boolean
}

// карта с отрисованным маршрутом в центральной части заявки
export const RouteMapCenter: React.FC<ToRouteMap> = React.memo((
    {
        driverHere,
        driver,
        center,
        polyline,
        zoom = 5,
        bounds,
        maxZoom,
        fromCity, toCity,
        isEnableCoordsClick,
    } ) => {

    const dispatch = useDispatch()

    const extractCoordinatesToModal = ( e: coordinatesFromTargetType ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Координаты: <b>${ e.originalEvent.target.geometry._coordinates?.join(', ') }</b>`,
        }))
    }

    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: driver.idEmployee, flag: true })
    const map = useRef<any>({})

    // псевдо-перерисовка маркера водителя, ушедшего за край видимости карты, на край карты
    const [ boundsDriver, setBoundsDriver ] = useState({ position: driverHere, offset: [ 0, 0 ], isNoCoords: false })
    const placemarkerReWriter = useMemo(() => () => {
        const bounds: number[][] = map.current?.getBounds()
        const center: number[] = map.current?.getCenter()
        if (driverHere) {
            if (driverHere[0] === 0) {
                setBoundsDriver({
                    position: positionToBoundsLine({
                        position: [ bounds[0][0] - 1, center[1] ],
                        bounds,
                    }) as [ number, number ],
                    offset: [ 0, -30 ],
                    isNoCoords: true,
                })
            } else if (isOutOfBounds({ bounds, position: driverHere })) {
                setBoundsDriver({
                    position: positionToBoundsLine({ position: driverHere, bounds }) as [ number, number ],
                    offset: boundsOffsetCorrector(directionOfBounds({ position: driverHere, bounds })),
                    isNoCoords: false,
                })
            } else {
                setBoundsDriver({
                    position: [ 0, 0 ],
                    isNoCoords: false,
                    offset: [ 0, 0 ],
                })
            }
        }
    }, [ driverHere, boundsDriver, map ])

    // один раз сдвигаем чуть-чуть карту, чтобы сработал getBounds
    const [ isOneTimeRendr, setIsOneTimeRendr ] = useState(false)
    useEffect(() => {
        if (!isOneTimeRendr && map?.current?.panTo) {
            const currentCenter: number[] = map?.current?.getCenter() || [ 0, 0 ]
            map.current.panTo(currentCenter.map(x => x - 0.0001), { flying: 1 })
            setIsOneTimeRendr(true)
        }
    }, [ map?.current?.panTo, isOneTimeRendr, setIsOneTimeRendr ])


    return ( <>
            <YandexMapComponent
                maxZoom={ maxZoom }
                state={ {
                    center,
                    zoom,
                    bounds: bounds as undefined,
                } }
                onBoundsChange={ placemarkerReWriter }
                instanceMap={ map }
            >
                {/*отрисовка водителя (при наличии корректных координат) */ }
                { driverHere && driverHere[0] !== 0 &&
                    <Placemark geometry={ driverHere }
                               modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                               options={ {
                                   preset: 'islands#blueDeliveryCircleIcon',
                                   iconColor: 'green',
                                   hasBalloon: true,
                               } }
                               properties={ {
                                   hintContent: `Водитель здесь`,
                                   balloonContent: `<div id='driver-${ driver.idEmployee }' class='driver-card'></div>`,
                               } }
                               onContextMenu={ isEnableCoordsClick ? extractCoordinatesToModal : undefined }
                               onClick={ () => {
                                   // modalActivator(driverData || [])
                                   setTimeout(() => {
                                       // flag нужен, чтобы каждый раз возвращалось новое значение,
                                       // иначе при повторном нажатии на балун, он не от-риcовывается через Portal
                                       setIdToPortal(val => ( { idEmployee: driver.idEmployee, flag: !val.flag } ))
                                   }, 0)
                               } }
                    />
                }
                {/*отрисовка маркера у края карты (если водитель за пределами границ видимости)*/ }
                { ( boundsDriver.position && boundsDriver.position[0] !== 0 ) &&
                    <Placemark geometry={ boundsDriver.position }
                               modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                               options={ {
                                   preset: 'islands#blueDeliveryCircleIcon',
                                   iconColor: !boundsDriver.isNoCoords ? 'black' : 'navy',
                                   iconOffset: boundsDriver.offset,
                                   hasBalloon: boundsDriver.isNoCoords,
                               } }
                               properties={ {
                                   hintContent: !boundsDriver.isNoCoords ? 'Водитель за пределами видимости карты'
                                       : 'Отсуствуют данные координат водителя',
                                   balloonContent: `<div id='driver-${ driver.idEmployee }' class='driver-card'></div>`,
                               } }
                               onClick={ () => {
                                   if (!boundsDriver.isNoCoords) {
                                       // плавное перемещение к указанной точке
                                       map?.current?.panTo(driverHere, { flying: 1 })
                                   } else {
                                       setTimeout(() => {
                                           // flag нужен, чтобы каждый раз возвращалось новое значение,
                                           // иначе при повторном нажатии на балун, он не от-риcовывается через Portal
                                           setIdToPortal(val => ( { idEmployee: driver.idEmployee, flag: !val.flag } ))
                                       }, 0)
                                   }
                               } }
                    />
                }
                <MapRequestRoad polyline={ polyline }
                                senderCity={ fromCity + '' }
                                recipientCity={ toCity + '' }
                                onContextMenu={ isEnableCoordsClick ? extractCoordinatesToModal : undefined }
                />
                <Button
                    options={ {
                        position: { bottom: '15px', right: '15px' },
                    } }
                    data={ {
                        content: renderToString(<div
                            title={ 'Центрирование на маршруте (начало/конец)' }
                            style={ {
                                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiI+PGcgZmlsbD0iIzZCNkI2QiI+PHBhdGggZD0iTTEwIDE0aDQuNWEzLjUgMy41IDAgMCAwIDAtN0gxMHYyaDQuNWExLjUgMS41IDAgMSAxIDAgM0gxMHYyem0wIDAiLz48cGF0aCBkPSJNMTUgMTJoLTQuNWEzLjUgMy41IDAgMCAwIDAgN0gxNXYtMmgtNC41YTEuNSAxLjUgMCAxIDEgMC0zSDE1di0yem0wIDBNMTkgMjBhMiAyIDAgMSAwIDAtNCAyIDIgMCAwIDAgMCA0em0wLTFhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyem0wIDBNOSAxMGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6bTAtMWExIDEgMCAxIDAgMC0yIDEgMSAwIDAgMCAwIDJ6bTAgMCIvPjxwYXRoIGQ9Ik0xMy41NyAyMC44bDIuODMtMi44Mi0uNzEtLjctMi44MyAyLjgyLjcuN3ptMS40MS0yLjgybC43LS43LTIuMTEtMi4xMy0uNy43IDIuMTEgMi4xM3ptMCAwIi8+PC9nPjwvc3ZnPg==)',
                                width: '25px',
                                height: '25px',
                            } }/>),
                    } }
                    onClick={ ( e: any ) => {
                        map.current.panTo(e?.originalEvent?.target?._selected
                            ? polyline[0] : polyline[polyline.length - 1])
                    } }
                />
                <FullscreenControl
                    options={ {
                        position: { bottom: '15px', left: '15px' },
                    } }
                />
            </YandexMapComponent>
            {/* ждём, когда появится балун с нужным ID */ }
            <Portal getHTMLElementId={ `driver-${ idToPortal.idEmployee }` }>
                <AddDriversView idEmployee={ idToPortal.idEmployee }/>
            </Portal>
        </>
    )
})
