import React from 'react'
import styles from './yandex-map-component.module.scss'
import './yandex-map-restyle-ballon.scss'
// import './yandex-map-restyle-drop-box.scss'
import './yandex-map-restyle-copyright.scss'

import {FullscreenControl, Map, MapState, TypeSelector, ZoomControl} from 'react-yandex-maps'

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

type ToBigMap = {
    center: number[]
    zoom: number
    instanceMap?: React.MutableRefObject<any>
    instanceYMap?: React.MutableRefObject<any>
    onBoundsChange?: ( e?: any ) => void
    onClick?: ( e: any ) => void
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
                                                                 onClick,
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
            onClick={ onClick }
        >
            { children }
        </YandexMapComponent>
    )
})
