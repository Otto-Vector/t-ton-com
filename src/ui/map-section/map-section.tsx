import React, {useLayoutEffect, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux';

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component';
import {getDriversBigMapStore} from '../../selectors/maps/big-map-reselect';
import {Placemark} from 'react-yandex-maps';
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect';
import {setDriversToMap} from '../../redux/maps/big-map-store-reducer';

import {AddDriversView} from '../add-drivers-form/add-drivers-view';
import {Portal} from '../common/portals/Portal';


type OwnProps = {}

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState(0)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch<any>(setDriversToMap())
    }, [ dispatch ])

    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 7

    return (
        <div className={ styles.yandexMapComponent }>
            <YandexBigMap center={ center } zoom={ zoom }>
                { drivers.map(( { id, position, status, fio } ) =>
                    <Placemark geometry={ position }
                        // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                               options={
                                   {
                                       preset: 'islands#circleIcon',
                                       iconColor: status === 'empty' ? 'red' : 'green',
                                       // hasBalloon: true,
                                   } }
                               properties={
                                   {
                                       iconContent: id,
                                       hintContent: `<b>${ fio }</b>`,
                                       balloonContent: `<div id="driver-${ id }" class="driver-card"></div>`,
                                   }
                               }
                               key={ id }
                               onClick={ () => {
                                   // ставим в очередь промисов, чтобы сработало после отрисовки балуна
                                   setTimeout(() => {
                                       setIdToPortal(id)
                                   }, 0)
                               } }
                    />,
                )
                }
            </YandexBigMap>
            {/*ждём, когда появится балун с нужным ID*/ }
            <Portal getHTMLElementId={ `driver-${ idToPortal }` }><AddDriversView/></Portal>
        </div>
    )
}
