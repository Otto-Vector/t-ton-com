import React, {useEffect, useMemo, useRef, useState} from 'react'
import styles from './yandex-map-component.module.scss'
import './yandex-map-restyle-ballon.scss'
// import './yandex-map-restyle-drop-box.scss'
import './yandex-map-restyle-copyright.scss'

import {
    Button,
    FullscreenControl,
    Map,
    MapState,
    Placemark,
    Polyline,
    SearchControl,
    TypeSelector,
    ZoomControl,
} from 'react-yandex-maps'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {useDispatch} from 'react-redux'
import {globalModalStoreActions, textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {isOutOfBounds, positionToBoundsLine} from '../../../utils/map-utils'
import {renderToString} from 'react-dom/server'

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

type OwnProps = {
    state?: MapState
    modules?: string[]
    instanceMap?: React.MutableRefObject<any>
    instanceYMap?: React.MutableRefObject<any>
    onBoundsChange?: ( e?: any ) => void
    onClick?: ( e: any ) => void
    maxZoom?: number
    isFullscreenContolActive?: boolean
}

// главная компомнента карты, куда все стремятся
export const YandexMapComponent: React.FC<OwnProps> = ( {
                                                            state,
                                                            modules,
                                                            children,
                                                            instanceMap,
                                                            instanceYMap,
                                                            onClick,
                                                            onBoundsChange,
                                                            maxZoom = 18,
                                                            isFullscreenContolActive = false,
                                                        } ) => {


    return (
        <div className={ styles.yandexMapComponent }>
            <Map className={ styles.yandexMapComponent }
                 instanceRef={ ( map ) => {
                     if (instanceMap) instanceMap.current = map
                 } }
                 modules={ modules }
                 state={ state }
                 options={ {
                     suppressMapOpenBlock: true,
                     suppressObsoleteBrowserNotifier: true,
                     yandexMapDisablePoiInteractivity: true,
                     maxZoom,
                     minZoom: 4,
                 } }
                 onClick={ onClick }
                 onLoad={ ymapsInstance => {
                     // Также способ сохранить ymaps в переменную
                     if (instanceYMap) {
                         instanceYMap.current = ymapsInstance
                     }
                     // оставляем. это важно, оно убирает глюк
                     onBoundsChange && onBoundsChange()
                 } }
                 onBoundsChange={ onBoundsChange }
            >
                { children }
                <TypeSelector
                    mapTypes={ [ 'yandex#satellite', 'yandex#map', 'yandex#hybrid' ] }
                    options={ {
                        float: 'left',
                        maxWidth: [ 25 ],
                        // position: { left: 25, top: 25 },
                        panoramasItemMode: 'off',
                    } }/>
                <ZoomControl/>
                { isFullscreenContolActive && <FullscreenControl/> }
            </Map>
        </div>
    )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ToFormProps = {
    center: [ number, number ]
    getCoordinates: ( coords: [ number, number ] ) => void
}

// в маленькое окошко формы
export const YandexMapToForm: React.FC<ToFormProps> =
    React.memo(
        ( { center, getCoordinates } ) => {

            return (
                <YandexMapComponent
                    state={ {
                        center,
                        zoom: 10,
                        suppressMapOpenBlock: true,
                    } }
                    onClick={ ( e ) => {
                        getCoordinates(e.get('coords'))
                    } }
                    isFullscreenContolActive
                >
                    <Placemark geometry={ center }
                               options={
                                   {
                                       preset: 'islands#violetDotIconWithCaption',
                                       draggable: true,
                                   }
                               }
                               onDragEnd={ ( e: any ) => {
                                   getCoordinates(e.originalEvent.target.geometry._coordinates)
                               } }
                    />
                    <SearchControl
                        options={ {
                            float: 'right',
                            noPlacemark: true,
                        } }/>
                </YandexMapComponent>
            )
        }
        , valuesAreEqual)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

type ToBigMap = {
    center: number[]
    zoom: number
    instanceMap?: React.MutableRefObject<any>
    instanceYMap?: React.MutableRefObject<any>
    onBoundsChange?: ( e?: any ) => void
    bounds?: number[][]
}

// компонента-прокладка на большую карту
export const YandexBigMap: React.FC<ToBigMap> = React.memo(( {
                                                                 center,
                                                                 zoom,
                                                                 children,
                                                                 bounds,
                                                                 instanceMap,
                                                                 instanceYMap,
                                                                 onBoundsChange,
                                                             } ) => {
    return (
        <YandexMapComponent
            state={ {
                center,
                zoom,
                bounds: bounds as undefined,
            } }
            modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint', 'util.bounds' ] }
            instanceMap={ instanceMap }
            instanceYMap={ instanceYMap }
            onBoundsChange={ onBoundsChange }
        >
            { children }
        </YandexMapComponent>
    )
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type coordinatesFromTargetType = { originalEvent: { target: { geometry: { _coordinates: number[] } } } }

type MapRequestRoadType = {
    polyline: number[][]
    onContextMenu?: ( a: coordinatesFromTargetType ) => void
    senderCity: string
    recipientCity: string
}

// отрисовка дороги И точки погрузки/разгрузки с контекстом
export const MapRequestRoad: React.FC<MapRequestRoadType> = ( {
                                                                  polyline,
                                                                  recipientCity,
                                                                  senderCity,
                                                                  onContextMenu,
                                                              } ) => {
    const placemarkOptions = { preset: 'islands#nightStretchyIcon' }
    const polylineOptions = {
        strokeColor: '#023E8A',
        strokeWidth: 4,
        opacity: 0.8,
    }
    return ( <>
        {/* ДОРОГА */ }
        <Polyline geometry={ polyline }
                  options={ polylineOptions }/>
        {/* ТОЧКА ПОГРУЗКИ */ }
        <Placemark geometry={ polyline[0] }
                   options={ placemarkOptions }
                   properties={ {
                       iconContent: `из ${ senderCity }`,
                       hintContent: `Грузоотправитель`,
                   } }
                   onContextMenu={ onContextMenu }
        />
        {/* ТОЧКА РАЗГРУЗКИ */ }
        <Placemark geometry={ polyline[polyline.length - 1] }
                   options={ placemarkOptions }
                   properties={ {
                       iconContent: `в ${ recipientCity }`,
                       hintContent: `Грузополучатель`,
                   } }
                   onContextMenu={ onContextMenu }
        />
    </> )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
export const YandexMapWithRoute: React.FC<ToRouteMap> = React.memo((
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
        dispatch(globalModalStoreActions.setTextMessage(text))
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
