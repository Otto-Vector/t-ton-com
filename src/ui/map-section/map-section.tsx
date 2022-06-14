import React from 'react'
import styles from './map-section.module.scss'
import {Map, MapState} from 'react-yandex-maps';
import {useSelector} from 'react-redux';
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect';
import {YandexBigMap, YandexMapComponent} from '../common/yandex-map-component/yandex-map-component';


type OwnProps = {

}

export const MapSection: React.FC<OwnProps> = () => {

    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 10

    return (
        <YandexBigMap center={center} />
    )
}
