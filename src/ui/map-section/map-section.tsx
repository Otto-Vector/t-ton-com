import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {getDriversBigMapStore, getIsFetchingBigMapStore} from '../../selectors/maps/big-map-reselect'
import {Placemark, Polyline} from 'react-yandex-maps'
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect'
import {
    bigMapStoreActions,
    DriverOnMapType,
    setAllMyDriversToMap,
    setAnswerDriversToMap,
} from '../../redux/maps/big-map-store-reducer'

import {AddDriversView} from '../add-drivers-form/add-drivers-view'
import {Portal} from '../common/portals/Portal'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {useLocation, useParams} from 'react-router-dom'
import {SizedPreloader} from '../common/preloader/preloader'
import {
    getInitialValuesRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../selectors/forms/request-form-reselect'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'


type OwnProps = {}
export type coordinatesFromTargetType = { originalEvent: { target: { geometry: { _coordinates: number[] } } } }

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const dispatch = useDispatch()
    const routes = useSelector(getRoutesStore)
    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const authGeoPositionAsCenter = useSelector(getGeoPositionAuthStore)
    const zoom = 7
    const polylineFirstPointAsCenter = polyline?.shift()


    const currentRequest = useSelector(getInitialValuesRequestStore)
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()

    const map = useRef<any>({})
    const ymap = useRef<any>({})

    const mapModes = useMemo(() => ( {
        answersMode: pathname.includes(routes.maps.answers),
        routesMode: pathname.includes(routes.maps.routes),
        statusMode: pathname.includes(routes.maps.status),
    } ), [ pathname ])

    const [ center, setCenter ] = useState(( mapModes.answersMode && polylineFirstPointAsCenter ) || authGeoPositionAsCenter)

    useLayoutEffect(() => {
        if (mapModes.answersMode) {
            dispatch<any>(setAnswerDriversToMap(reqNumber || ''))
        } else {
            dispatch<any>(setAllMyDriversToMap())
        }
    }, [ dispatch, reqNumber ])

    // один раз сдвигаем чуть-чуть карту, чтобы сработал getBounds
    const [ isOneTimeRenger, setIsOneTimeRender ] = useState(false)
    useEffect(() => {
        if (!isOneTimeRenger && map?.current?.panTo) {
            map.current.panTo([ center[0] - 0.001, center[1] + 0.001 ], { flying: 1 })
            setIsOneTimeRender(true)
        }
    }, [ map?.current?.panTo, isOneTimeRenger, setIsOneTimeRender, center ])

    // маркировка активного водителя
    const setSelectedDriver = useMemo(() => ( selectedIdEmployee: string ) => {
        dispatch(bigMapStoreActions.setDriversList(drivers.map(( { idEmployee, ...props } ) => ( {
            ...props,
            idEmployee,
            isSelected: idEmployee === selectedIdEmployee,
        } ))))
    }, [ dispatch, JSON.stringify(drivers) ])

    // координаты в модальное окно при нажатии правой кнопкой мыши
    const extractCoordinatesToModal = ( e: coordinatesFromTargetType ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Координаты: <b>${ e?.originalEvent?.target?.geometry?._coordinates?.join(', ') }</b>`,
        }))
    }


    // возвращает массив водителей вне зоны видимости активной карты
    const driversOutOfBounds = useMemo(() => ( e?: any ): DriverOnMapType[] =>
            drivers?.map(
                ( { position, ...props } ) => ( {
                    ...props, position,
                    isOutOfBounds: !ymap?.current?.util?.bounds?.containsPoint(
                        map?.current?.getBounds(), position),
                } ),
            )
        , [ map?.current, ymap?.current, JSON.stringify(drivers) ])

    const [ boundsDrivers, setBoundsDrivers ] = useState(drivers)

    // псевдо-перерисовка маркеров, ушедших за край видимости карты, на край карты
    const PlacemarkersReWriter = () => {
        const bounds = map?.current?.getBounds()
        const positionToBounds = ( pos: number[] ) => {
            const up = Math.min(pos[0], bounds[1][0])
            const down = Math.max(pos[0], bounds[0][0])
            const right = Math.min(pos[1], bounds[1][1])
            const left = Math.max(pos[1], bounds[0][1])
            return [ pos[0] !== up ? up : down, pos[1] !== right ? right : left ]
        }
        setBoundsDrivers(driversOutOfBounds(
        )?.filter(el => el.isOutOfBounds,
        )?.map(el => ( {
            ...el, positionToBounds: positionToBounds(el.position),
        } )))
    }

    // стиль выделенного маркера в центре круга
    const placemarkIsSelectedStyle = '<b style="display: flex;' +
        ' justify-content: center; text-align: center;' +
        'background: #81b5e1; border-radius: 50%; width: 100%;' +
        'box-shadow: 0 0 15px black' +
        '">'

    return (
        <div className={ styles.yandexMapComponent }>
            { isFetching &&
                <div className={ styles.yandexMapComponent__preloader }><SizedPreloader sizeHW={ '200px' }/></div> }
            <YandexBigMap center={ center }
                          zoom={ zoom }
                          instanceMap={ map }
                          instanceYMap={ ymap }
                          onBoundsChange={ PlacemarkersReWriter }
            >
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
                                       visible: true,
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
                {/* отрисовка водителей вне видимости активной карты */ }
                { boundsDrivers.map(( { id, idEmployee, position, status, positionToBounds, fio } ) => {
                    return <Placemark geometry={ positionToBounds }
                                      options={
                                          {
                                              preset: 'islands#blueDeliveryCircleIcon',
                                              iconColor: status === 'свободен' ? 'red' : 'green',
                                              hasBalloon: true,
                                          } }
                                      properties={ { hintContent: `<b>${ fio }</b>` } }
                                      onClick={ () => {
                                          // плавное перемещение к указанной точке
                                          map?.current?.panTo(position, { flying: 1 })
                                          setSelectedDriver(idEmployee)
                                      } }
                                      key={ idEmployee + id }
                    ></Placemark>
                })
                }
                { drivers.map(( { id, idEmployee, position, status, fio, isSelected } ) => {
                        // const anyPosition = position.map(( el, idx ) => el || getRandomInRange(!idx ? 48 : 45, !idx ? 49 : 46, 5))
                        if (!!position[0])
                            return <Placemark geometry={ position }
                                // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                                              options={
                                                  {
                                                      preset: 'islands#circleIcon',
                                                      iconColor: status === 'свободен' ? 'red' : 'green',
                                                      hasBalloon: true,
                                                  } }
                                              properties={
                                                  {
                                                      iconContent: `${ isSelected ? placemarkIsSelectedStyle : '' }` + id + '</b>',
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
                                                      setSelectedDriver(idEmployee)
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
