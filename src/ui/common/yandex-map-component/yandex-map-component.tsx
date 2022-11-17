import React from 'react'
import styles from './yandex-map-component.module.scss'
import './yandex-map-restyle-ballon.scss'

import {Map, MapState, Placemark, Polyline, SearchControl, TypeSelector, ZoomControl} from 'react-yandex-maps'
import {valuesAreEqual} from '../../../utils/reactMemoUtils';


type OwnProps = {
    state?: MapState
    modules?: string[]
    instance?: ( instance: React.Ref<any> ) => void
    onClick?: ( e: any ) => void
    maxZoom?: number
}


export const YandexMapComponent: React.FC<OwnProps> = ( {
                                                            state,
                                                            modules,
                                                            children,
                                                            instance,
                                                            onClick,
                                                            maxZoom = 18,
                                                        } ) => {

    return (
        <div className={ styles.yandexMapComponent }>
            <Map className={ styles.yandexMapComponent }
                 instanceRef={ instance }
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
            >
                { children }
                <TypeSelector
                    mapTypes={ [ 'yandex#satellite', 'yandex#map', 'yandex#hybrid' ] }
                    options={ {
                        float: 'left',
                        maxWidth: [ 25 ],
                        panoramasItemMode: 'off',
                    } }/>
                <ZoomControl/>
            </Map>
        </div>
    )
}


type ToFormProps = {
    center: [ number, number ]
    getCoordinates: ( coords: [ number, number ] ) => void
}

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


type ToBigMap = {
    center: number[],
    zoom: number
}

export const YandexBigMap: React.FC<ToBigMap> = React.memo(( { center, zoom, children } ) => {
    return (
        <YandexMapComponent
            state={ {
                center,
                zoom,
            } }
            modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
        >
            { children }
        </YandexMapComponent>
    )
})

type ToRouteMap = {
    center: [ number, number ]
    polyline: number[][]
    bounds?: MapState['bounds']
    zoom?: number
    maxZoom?: number
}


// карта с отрисованным маршрутом
export const YandexMapWithRoute: React.FC<ToRouteMap> = React.memo(( { center, polyline, zoom = 5, bounds, maxZoom } ) => {

    return (
        <YandexMapComponent
            maxZoom={maxZoom}
            state={ {
                center,
                zoom,
                bounds: bounds as undefined,
            } }
        >
            <Placemark geometry={ center }/>
            <Polyline geometry={ polyline }
                      options={ { strokeColor: '#023E8A', strokeWidth: 4, opacity: 0.8 } }
            />
        </YandexMapComponent>
    )
})
