import React from 'react'
import styles from './yandex-map-component.module.scss'
import {Map} from 'react-yandex-maps';
import {useSelector} from 'react-redux';
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect';


type OwnProps = {}

export const YandexMapComponent: React.FC<OwnProps> = () => {
    // const center = useSelector(getGeoPositionAuthStore)
    const center = useSelector(getGeoPositionAuthStore)
    console.log(center)
    return (
        <div className={ styles.yandexMapComponent }>
            <Map className={ styles.yandexMapComponent } defaultState={ { center: center, zoom: 9 } }/>
        </div>
    )
}
