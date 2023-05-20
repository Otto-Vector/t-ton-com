import React, {useEffect, useMemo, useRef, useState} from 'react'
import {YandexMapComponent} from '../../../common/yandex-map-component/yandex-map-component'
import {coordinatesFromTargetType, MapRequestRoad} from '../../../common/yandex-map-component/map-request-road'
import {Button, FullscreenControl, MapState, Placemark} from 'react-yandex-maps'
import {renderToString} from 'react-dom/server'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {isOutOfBounds, positionToBoundsLine} from '../../../../utils/map-utils'
import {useDispatch} from 'react-redux'

type ToRouteMap = {
    center: [ number, number ]
    driverHere?: [ number, number ]
    polyline: number[][]
    bounds?: MapState['bounds']
    zoom?: number
    maxZoom?: number
    fromCity?: string
    toCity?: string
    driverData: string[]
    isEnableCoordsClick?: boolean
}

// карта с отрисованным маршрутом в центральной части заявки
export const RouteMapCenter: React.FC<ToRouteMap> = React.memo((
    {
        driverHere,
        center,
        polyline,
        zoom = 5,
        bounds,
        maxZoom,
        fromCity, toCity, driverData,
        isEnableCoordsClick,
    } ) => {

    const dispatch = useDispatch()
    const extractCoordinatesToModal = ( e: coordinatesFromTargetType ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Координаты: <b>${ e.originalEvent.target.geometry._coordinates?.join(', ') }</b>`,
        }))
    }

    const map = useRef<any>({})

    // псевдо-перерисовка маркера водителя, ушедшего за край видимости карты, на край карты
    const [ boundsDriver, setBoundsDriver ] = useState(driverHere)
    const placemarkerReWriter = useMemo(() => ( e: any ) => {
        const bounds: number[][] = e?.originalEvent?.newBounds
        if (boundsDriver && driverHere && isOutOfBounds({ bounds, position: driverHere })) {
            setBoundsDriver(positionToBoundsLine({ position: driverHere, bounds }) as typeof driverHere)
        } else {
            setBoundsDriver([ 0, 0 ])
        }
    }, [ driverHere, boundsDriver ])

    // один раз сдвигаем чуть-чуть карту, чтобы сработал getBounds
    const [ isOneTimeRendr, setIsOneTimeRendr ] = useState(false)
    useEffect(() => {
        if (!isOneTimeRendr && map?.current?.panTo) {
            const currentCenter: number[] = map?.current?.getCenter() || [ 0, 0 ]
            map.current.panTo(currentCenter.map(x => x - 0.0001), { flying: 1 })
            setIsOneTimeRendr(true)
        }
    }, [ map?.current?.panTo, isOneTimeRendr, setIsOneTimeRendr ])

    const modalActivator = ( text: string[] ) => {
        dispatch<any>(textAndActionGlobalModal({ text }))
    }

    return (
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
                           options={ {
                               preset: 'islands#blueDeliveryCircleIcon',
                               iconColor: 'green',
                           } }
                           properties={ {
                               hintContent: `Водитель здесь`,
                           } }
                           onContextMenu={ isEnableCoordsClick ? extractCoordinatesToModal : undefined }
                           onClick={ () => {
                               modalActivator(driverData || [])
                           } }
                />
            }
            {/*отрисовка маркера у края карты (если водитель за пределами границ видимости)*/ }
            { boundsDriver && boundsDriver[0] !== 0 &&
                <Placemark geometry={ boundsDriver }
                           options={ {
                               preset: 'islands#blueDeliveryCircleIcon',
                               iconColor: 'black',
                           } }
                           properties={ {
                               hintContent: `<--.-->`,
                           } }
                           onClick={ () => {
                               // плавное перемещение к указанной точке
                               map?.current?.panTo(driverHere, { flying: 1 })
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
    )
})
