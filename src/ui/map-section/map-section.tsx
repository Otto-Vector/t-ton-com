import React, {useLayoutEffect, useMemo, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {getDriversBigMapStore} from '../../selectors/maps/big-map-reselect'
import {Placemark} from 'react-yandex-maps'
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect'
import {setAnswerDriversToMap, setAllMyDriversToMap} from '../../redux/maps/big-map-store-reducer'

import {AddDriversView} from '../add-drivers-form/add-drivers-view'
import {Portal} from '../common/portals/Portal'
import {getRandomInRange} from '../../utils/random-utils'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {useLocation, useNavigate, useParams} from 'react-router-dom'


type OwnProps = {}

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const dispatch = useDispatch()
    const routes = useSelector(getRoutesStore)
    // const navigate = useNavigate()
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()

    const mapModes = useMemo(() => ( {
        answersMode: pathname.includes(routes.maps.answers),
        routesMode: pathname.includes(routes.maps.routes),
    } ), [ pathname ])

    useLayoutEffect(() => {
        if (mapModes.answersMode) {
            dispatch<any>(setAnswerDriversToMap(reqNumber || ''))
        } else {
            dispatch<any>(setAllMyDriversToMap())
        }
    }, [ dispatch, reqNumber ])


    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 7

    return (
        <div className={ styles.yandexMapComponent }>
            <YandexBigMap center={ center } zoom={ zoom }>
                { drivers.map(( { id, idEmployee, position, status, fio } ) => {
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
