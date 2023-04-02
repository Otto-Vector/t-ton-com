import React, {useLayoutEffect, useMemo, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {getDriversBigMapStore, getIsFetchingBigMapStore} from '../../selectors/maps/big-map-reselect'
import {Placemark, Polyline} from 'react-yandex-maps'
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect'
import {setAnswerDriversToMap, setAllMyDriversToMap} from '../../redux/maps/big-map-store-reducer'

import {AddDriversView} from '../add-drivers-form/add-drivers-view'
import {Portal} from '../common/portals/Portal'
import {getRandomInRange} from '../../utils/random-utils'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {SizedPreloader} from '../common/preloader/preloader'
import {
    getInitialValuesRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../selectors/forms/request-form-reselect'


type OwnProps = {}

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const dispatch = useDispatch()
    const routes = useSelector(getRoutesStore)
    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const currentRequest = useSelector(getInitialValuesRequestStore)
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
            { isFetching &&
                <div className={ styles.yandexMapComponent__preloader }><SizedPreloader sizeHW={ '200px' }/></div> }
            <YandexBigMap center={ center } zoom={ zoom }>
                { mapModes.answersMode && polyline && <>
                <Polyline geometry={ polyline }
                                                                options={ {
                                                                    strokeColor: '#023E8A',
                                                                    strokeWidth: 4,
                                                                    opacity: 0.8,
                                                                } }
                />
                    <Placemark geometry={ polyline[0] }
                                          options={
                                              {
                                                  preset: 'islands#nightStretchyIcon',
                                              } }
                                          properties={
                                              {
                                                  iconContent: `из ${currentRequest?.sender?.city}`,
                                                  hintContent: `Грузоотправитель`,
                                              }
                                          }
                        />
                    <Placemark geometry={ polyline[polyline.length-1] }
                                          options={
                                              {
                                                  preset: 'islands#nightStretchyIcon',
                                              } }
                                          properties={
                                              {
                                                  iconContent: `в ${currentRequest?.recipient?.city}`,
                                                  hintContent: `Грузополучатель`,
                                              }
                                          }
                        />
                </>
                }
                { drivers.map(( { id, idEmployee, position, status, fio } ) => {
                        const anyPosition = position.map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5))
                        return <Placemark geometry={ anyPosition }
                            // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                                          options={
                                              {
                                                  preset: 'islands#circleIcon',
                                                  iconColor: status === 'свободен' ? 'red' : 'green',
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
