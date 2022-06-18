import React from 'react'
import styles from './yandex-map-component.module.scss'
import {Map, MapState, Placemark, SearchControl} from 'react-yandex-maps';


type OwnProps = {
    state?: MapState
    modules?: string[]
}

export const YandexMapComponent: React.FC<OwnProps> = ( { state, modules, children } ) => {

    return (
        <div className={ styles.yandexMapComponent }>
            <Map className={ styles.yandexMapComponent }
                // state={ state }
                 modules={ modules }
                 state={ state }
                 // options={{}}
            >
                { children }
            </Map>
        </div>
    )
}

type ToFormProps = {
    center: [ number, number ]
}

export const YandexMapToForm: React.FC<ToFormProps> = React.memo(( { center } ) => {
    return (
        <YandexMapComponent
            state={ {
                center,
                zoom: 10,

                // controls: [ 'zoomControl' ],
            } }
            // modules={ [ 'control.ZoomControl' ] }
        >
            <Placemark geometry={ center }
                       options={
                           {
                               preset: 'islands#violetDotIconWithCaption',
                               draggable: true,
                           }
                       }
                       onClick={(e:any)=>{console.log(e)}}
            />
            <SearchControl options={ {
                float: 'right',
            } }/>
        </YandexMapComponent>
    )
})

export const YandexBigMap: React.FC<ToFormProps> = React.memo(( { center } ) => {
    return (
        <YandexMapComponent
            state={ {
                center,
                zoom: 10,
            } }
        >
            <Placemark geometry={ center }/>
        </YandexMapComponent>
    )
})