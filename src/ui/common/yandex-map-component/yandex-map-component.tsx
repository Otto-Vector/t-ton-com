import React, {useEffect, useState} from 'react'
import styles from './yandex-map-component.module.scss'
import {Map, MapState, Placemark, SearchControl, TypeSelector} from 'react-yandex-maps';
import {useDispatch, useSelector} from 'react-redux';
import {getInitialValuesCoordinatesShippersStore} from '../../../selectors/options/shippers-reselect';
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer';


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
                // state={ state }
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
    setCoordinates: (coords:[number,number])=>void
}


export const YandexMapToForm: React.FC<ToFormProps> = React.memo(( { center, setCoordinates } ) => {


        // const dispatch = useDispatch()

        const inst = ( instance: React.Ref<any> ) => {
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
                instance={ inst }
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