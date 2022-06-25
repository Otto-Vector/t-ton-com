import React from 'react'
import styles from './yandex-map-component.module.scss'
import {Map, MapState, Placemark, Polyline, SearchControl, TypeSelector} from 'react-yandex-maps';


type OwnProps = {
    state?: MapState
    modules?: string[]
    instance?: ( instance: React.Ref<any> ) => void
}

export const YandexMapComponent: React.FC<OwnProps> = ( { state, modules, children, instance } ) => {

    return (
        <div className={ styles.yandexMapComponent }>
            <Map className={ styles.yandexMapComponent }
                 instanceRef={ instance }
                 modules={ modules }
                 state={ state }

            >
                { children }
            </Map>
        </div>
    )
}


type ToFormProps = {
    center: [ number, number ]
    setCoordinates: ( coords: [ number, number ] ) => void
}

export const YandexMapToForm: React.FC<ToFormProps> = React.memo(( { center, setCoordinates } ) => {

        const setCoordsInstance = ( instance: React.Ref<any> ) => { //для отслеживания координат по клику
            // @ts-ignore
            instance?.events.add('click', function ( e ) {
                setCoordinates(e.get('coords'))
            })
        }

        return (
            <YandexMapComponent
                state={ {
                    center,
                    zoom: 10,

                } }
                instance={ setCoordsInstance }
            >
                <Placemark geometry={ center }
                           options={
                               {
                                   preset: 'islands#violetDotIconWithCaption',
                               }
                           }
                />
                <SearchControl
                    options={ {
                        float: 'right',
                    } }/>
                <TypeSelector
                    options={ {
                        float: 'left',
                        maxWidth: [ 25 ],
                        panoramasItemMode: 'off',
                    } }/>
            </YandexMapComponent>
        )
    },
)


type ToBigMap = {
    center: [ number, number ]
}

export const YandexBigMap: React.FC<ToBigMap> = React.memo(( { center } ) => {
    return (
        <YandexMapComponent
            state={ {
                center,
                zoom: 10,
            } }
        >
            <Placemark geometry={ center }/>
            <TypeSelector
                mapTypes={ [ 'yandex#satellite', 'yandex#map', 'yandex#hybrid' ] }
                options={ {
                    float: 'left',
                    maxWidth: [ 25 ],
                    panoramasItemMode: 'off',
                } }/>
        </YandexMapComponent>
    )
})

type ToRouteMap = {
    center: [ number, number ]
    polyline: number[][]
    bounds?: MapState['bounds']
    zoom?: number
}


// карта с отрисованным маршрутом
export const YandexMapWithRoute: React.FC<ToRouteMap> = React.memo(( { center, polyline, zoom = 5 , bounds} ) => {

    return (
        <YandexMapComponent

            state={ {
                center,
                zoom,
                bounds: bounds as undefined,
            } }
        >
            <TypeSelector
                mapTypes={ [ 'yandex#satellite', 'yandex#map', 'yandex#hybrid' ] }
                options={ {
                    float: 'left',
                    maxWidth: [ 25 ],
                    panoramasItemMode: 'off',
                } }/>
            <Placemark geometry={ center }/>
            <Polyline geometry={ polyline }
                      options={ { strokeColor: '#023E8A', strokeWidth: 5, opacity: 0.8 } }
            />
        </YandexMapComponent>
    )
})