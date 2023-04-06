import React from 'react'
import styles from './yandex-map-component.module.scss'
import './yandex-map-restyle-ballon.scss'

import {Map, MapState, Placemark, Polyline, SearchControl, TypeSelector, ZoomControl} from 'react-yandex-maps'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {coordinatesFromTarget} from '../../map-section/map-section'
import {useDispatch} from 'react-redux'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'


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
    driverHere?: [ number, number ]
    polyline: number[][]
    bounds?: MapState['bounds']
    zoom?: number
    maxZoom?: number
    fromCity?: string
    toCity?: string
    isEnableCoordsClick?: boolean
}


// карта с отрисованным маршрутом
export const YandexMapWithRoute: React.FC<ToRouteMap> = React.memo((
    {
        driverHere,
        center,
        polyline,
        zoom = 5,
        bounds,
        maxZoom,
        fromCity, toCity,
        isEnableCoordsClick,
        children,
    } ) => {

    const dispatch = useDispatch()
    const extractCoordinatesToModal = ( e: coordinatesFromTarget ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Координаты: <b>${ e.originalEvent.target.geometry._coordinates?.join(', ') }</b>`,
        }))
    }

    return (
        <YandexMapComponent
            maxZoom={ maxZoom }
            state={ {
                center,
                zoom,
                bounds: bounds as undefined,
            } }        >

            { driverHere && <Placemark geometry={ driverHere }
                                       options={
                                           {
                                               preset: 'islands#circleIcon',
                                               iconColor: 'green',
                                           } }
                                       properties={
                                           {
                                               hintContent: `Водитель здесь`,
                                           } }
                                       onContextMenu={ extractCoordinatesToModal }
            /> }
            <Polyline geometry={ polyline }
                      options={ { strokeColor: '#023E8A', strokeWidth: 4, opacity: 0.8 } }
            />
            {/* ТОЧКА ПОГРУЗКИ */ }
            <Placemark geometry={ polyline?.shift() }
                       options={
                           {
                               preset: 'islands#nightStretchyIcon',
                           } }
                       properties={
                           {
                               iconContent: `из ${ fromCity }`,
                               hintContent: `Грузоотправитель`,
                           }
                       }
                       onContextMenu={ isEnableCoordsClick ? extractCoordinatesToModal : null }
            />
            {/* ТОЧКА РАЗГРУЗКИ */ }
            <Placemark geometry={ polyline?.pop() }
                       options={
                           {
                               preset: 'islands#nightStretchyIcon',
                           } }
                       properties={
                           {
                               iconContent: `в ${ toCity }`,
                               hintContent: `Грузополучатель`,
                           }
                       }
                       onContextMenu={ isEnableCoordsClick ? extractCoordinatesToModal : null }
            />
        </YandexMapComponent>
    )
})
