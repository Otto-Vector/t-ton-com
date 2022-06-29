import React, {useEffect, useLayoutEffect, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux';

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component';
import {getCenterBigMapStore, getDriversBigMapStore} from '../../selectors/maps/big-map-reselect';
import {Placemark} from 'react-yandex-maps';
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect';
import {Footer} from '../footer/footer';
import ReactDOM, {createPortal} from 'react-dom';
import ReactDOMServer from 'react-dom/server'
import {bigMapStoreActions, setDriversToMap} from '../../redux/maps/big-map-store-reducer';
import {InfoText} from '../common/info-text/into-text';
import {MenuPanel} from '../menu-panel/menu-panel';
import {Preloader} from '../common/preloader/preloader';


type DriverPortalType = {
    id: number
}

const Portal: React.FC<DriverPortalType> = ( { children, id } ) => {
    const mount = document.getElementById(`driver-${ id }`);
    const el = document.createElement('div');

    useEffect(() => {
        console.log(id, ' - ', mount)
        mount?.appendChild(el);
        return () => {
            mount?.removeChild(el);
        }
    }, [ el, mount ]);

    return createPortal(children, el);
}

type OwnProps = {}

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const [idToPortal, setIdtoPortal] = useState(0)
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        dispatch<any>(setDriversToMap())
    }, [])

    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 10
    let ll = document.createElement('div')
    return (
        <div className={ styles.yandexMapComponent }>
            <YandexBigMap center={ center } zoom={ zoom }

            >
                { drivers.map(( { id, position, status, fio } ) =>
                        <Placemark geometry={ position }
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
                                           // balloonContent: ReactDOMServer.renderToString(<Preloader/>),
                                           balloonContent: `<div id="driver-${ id }" class="driver-card"></div>`,
                                       }
                                   }
                                   key={ id }
                                   onClick={ () => {
                                       setTimeout(() => {
                                           setIdtoPortal(id)
                                       }, 0)
                                   }
                                   }
                        />
                )
                }

            </YandexBigMap>
            <Portal id={idToPortal}><InfoText/></Portal>
        </div>
    )
}
