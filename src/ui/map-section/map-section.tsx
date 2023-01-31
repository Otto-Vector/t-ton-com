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
import {getRandomInRange} from '../../utils/random-utils';


type OwnProps = {}

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const dispatch = useDispatch()

    useLayoutEffect(() => {
        // console.log(drivers)
        dispatch<any>(setDriversToMap())
    }, [ dispatch ])


    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 7

    return (
        <div className={ styles.yandexMapComponent }>
            <YandexBigMap center={ center } zoom={ zoom }>
                { drivers.map(( { id, idEmployee, position, status, fio } ) => {
                        //toDo: это заглушка для пустых, убрать
                        const anyPosition = position.map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5))
                        return <Placemark geometry={ anyPosition }
                            // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                                          options={
                                              {
                                                  preset: 'islands#circleIcon',
                                                  iconColor: status === 'empty' ? 'red' : 'green',
                                                  hasBalloon: true,
                                              } }
                                          properties={
                                              {
                                                  iconContent: id,
                                                  hintContent: `<b>${ fio }</b>`,
                                                  balloonContent: `<div id="driver-${ idEmployee }" class="driver-card"></div>`,
                                              }
                                          }
                                          key={ id + idEmployee }
                                          onClick={ () => {
                                              // ставим в очередь промисов, чтобы сработало после отрисовки балуна
                                              setTimeout(() => {
                                                  // flag нужен, чтобы каждый раз возвращалось новое значение,
                                                  // иначе при повторном нажатии на балун, он не от-риcовывается через Portal
                                                  setIdToPortal(( val ) => ( { idEmployee, flag: !val.flag } ))
                                              }, 0)
                                          } }
                        />
                    },
                )
                }
            </YandexBigMap>
            {/*ждём, когда появится балун с нужным ID*/ }
            <Portal getHTMLElementId={ `driver-${ idToPortal.idEmployee }` }><AddDriversView
                idEmployee={ idToPortal.idEmployee }/></Portal>
        </div>
    )
}
