import React, {useRef} from 'react'
import {Placemark, SearchControl} from 'react-yandex-maps'
import {YandexMapComponent} from './yandex-map-component'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'

type ToFormProps = {
    center: [ number, number ]
    getCoordinates: ( coords: [ number, number ] ) => void
}

// в маленькое окошко формы ГРУЗООТПРАВИТЕЛЬ / ГРУЗОПОЛУЧАТЕЛЬ
export const YandexMapToForm: React.ComponentType<ToFormProps> = React.memo(
    ( { center, getCoordinates } ) => {
        // для забора координат и перерисовки маркера после ввода адреса на карте
        const searchConrolRef = useRef(null)

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
                    } }
                    // @ts-ignore
                    instanceRef={ searchConrolRef }
                    onResultShow={ () => {
                        // забираем данные из результатов поиска
                        // @ts-ignore
                        getCoordinates(searchConrolRef.current.getResult(0)._value.geometry._coordinates)
                    } }
                    // onResultSelect={ ( event: any ) => {} }
                />
            </YandexMapComponent>
        )
    }, valuesAreEqual)
