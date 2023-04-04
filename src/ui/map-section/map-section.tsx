import React, {useLayoutEffect, useMemo, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {getDriversBigMapStore, getIsFetchingBigMapStore} from '../../selectors/maps/big-map-reselect'
import {Placemark, Polyline} from 'react-yandex-maps'
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect'
import {setAllMyDriversToMap, setAnswerDriversToMap} from '../../redux/maps/big-map-store-reducer'

import {AddDriversView} from '../add-drivers-form/add-drivers-view'
import {Portal} from '../common/portals/Portal'
import {getRandomInRange} from '../../utils/random-utils'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {useLocation, useParams} from 'react-router-dom'
import {SizedPreloader} from '../common/preloader/preloader'
import {
    getInitialValuesRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../selectors/forms/request-form-reselect'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'


type OwnProps = {}
export type coordinatesFromTarget = { originalEvent: { target: { geometry: { _coordinates: number[] } } } }

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const dispatch = useDispatch()
    const routes = useSelector(getRoutesStore)
    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const currentRequest = useSelector(getInitialValuesRequestStore)
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

    const coordinatesToModal = ( coordinates: number[] ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Координаты: <b>${ coordinates.join(', ') }</b>`,
        }))
    }

    const extractCoordinatesToModal = ( e: coordinatesFromTarget ) => {
        coordinatesToModal(e.originalEvent.target.geometry._coordinates)
    }

    const center = useSelector(getGeoPositionAuthStore)
    const zoom = 7

    return (
        <div className={ styles.yandexMapComponent }>
            { isFetching &&
                <div className={ styles.yandexMapComponent__preloader }><SizedPreloader sizeHW={ '200px' }/></div> }
            <YandexBigMap center={ mapModes.answersMode ? polyline?.shift() || center : center } zoom={ zoom }>
                { mapModes.answersMode && polyline && <>
                    {/* ДОРОГА */ }
                    <Polyline geometry={ polyline }
                              options={ {
                                  strokeColor: '#023E8A',
                                  strokeWidth: 4,
                                  opacity: 0.8,
                              } }
                    />
                    {/* ТОЧКА ПОГРУЗКИ */ }
                    <Placemark geometry={ polyline?.shift() }
                               options={
                                   {
                                       preset: 'islands#nightStretchyIcon',
                                   } }
                               properties={
                                   {
                                       iconContent: `из ${ currentRequest?.sender?.city }`,
                                       hintContent: `Грузоотправитель`,
                                   }
                               }
                               onContextMenu={ extractCoordinatesToModal }
                    />
                    {/* ТОЧКА РАЗГРУЗКИ */ }
                    <Placemark geometry={ polyline?.pop() }
                               options={
                                   {
                                       preset: 'islands#nightStretchyIcon',
                                   } }
                               properties={
                                   {
                                       iconContent: `в ${ currentRequest?.recipient?.city }`,
                                       hintContent: `Грузополучатель`,
                                   }
                               }
                               onContextMenu={ extractCoordinatesToModal }
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
                                          onContextMenu={ extractCoordinatesToModal }
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
