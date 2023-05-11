import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {
    getDriversBigMapStore,
    getFilteredResponsesBigMapStore,
    getIsFetchingBigMapStore,
} from '../../selectors/maps/big-map-reselect'
import {ListBox, ListBoxItem, Placemark, Polyline} from 'react-yandex-maps'
import {getGeoPositionAuthStore} from '../../selectors/auth-reselect'
import {
    bigMapStoreActions,
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
import {EmployeeStatusType} from '../../types/form-types'
import {renderToString} from 'react-dom/server'
import {isOutOfBounds, positionToBounds} from '../../utils/map-utils'


type OwnProps = {}
export type coordinatesFromTargetType = { originalEvent: { target: { geometry: { _coordinates: number[] } } } }

export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const responses = useSelector(getFilteredResponsesBigMapStore)
    const currentRequest = useSelector(getInitialValuesRequestStore)

    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const routes = useSelector(getRoutesStore)

    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const authGeoPositionAsCenter = useSelector(getGeoPositionAuthStore)
    const polylineFirstPointAsCenter = polyline?.shift()
    const zoom = 7

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()
    const dispatch = useDispatch()

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
    const [ isOneTimeRender, setIsOneTimeRender ] = useState(false)
    useEffect(() => {
        if (!isOneTimeRender && map?.current?.panTo) {
            map.current.panTo(center.map(x => x - 0.001), { flying: 1 })
            setIsOneTimeRender(true)
        }
    }, [ map?.current?.panTo, isOneTimeRender, setIsOneTimeRender, center ])

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

    // псевдо-перерисовка маркеров, ушедших за край видимости карты, на край карты
    const PlacemarkersReWriter = useMemo(() => () => {
        const bounds: number[][] = map?.current?.getBounds()
        dispatch(bigMapStoreActions.setDriversList(drivers
            .map(( { position, ...props } ) => ( {
                ...props, position,
                isOutOfBounds: position[0] !== 0 && isOutOfBounds({ bounds, position }),
                positionToBounds: positionToBounds({ position, bounds }),
            } )),
        ))
    }, [ JSON.stringify(drivers) ])


    // стиль выделенного маркера в центре круга
    const placemarkIsSelectedStyle = '<b style="display: flex;' +
        ' justify-content: center; text-align: center;' +
        'background: #81b5e1; border-radius: 50%; width: 100%;' +
        'box-shadow: 0 0 15px black' +
        '">'

    const colorOfStatus = ( stat: EmployeeStatusType ): string =>
        stat === 'свободен'
            ? 'red'
            : stat === 'на заявке'
                ? 'green'
                : 'orange'

    const contentOfListboxItem = ( idEmployee: string ): string => {
        const finded = responses?.find(( { idEmployee: id } ) => id === idEmployee)
        return finded ? ( ' ' + finded?.cargoWeight + 'тн. | ' + finded?.responsePrice + ' руб.' ) : '-'
    }

    const activateDriverCard= ( idEmployee: string ) => {
        dispatch<any>(textAndActionGlobalModal({
            reactChildren: <AddDriversView idEmployee={idEmployee}/>
        }))
    }

    return (
        <section className={ styles.yandexMapComponent }>
            { isFetching &&
                <div className={ styles.yandexMapComponent__preloader }><SizedPreloader sizeHW={ '200px' }/></div> }

            <YandexBigMap center={ center }
                          zoom={ zoom }
                          instanceMap={ map }
                          instanceYMap={ ymap }
                          onBoundsChange={ PlacemarkersReWriter }
            >
                <ListBox
                    state={ { expanded: false } }
                    data={ {
                        content: 'Выберите водителя',
                    } }>
                    { drivers.map(( { fio, status, position, idEmployee } ) =>
                        <ListBoxItem
                            options={ {
                                selectOnClick: false,
                                layout: 'islands#listBoxItemLayout',
                            } }
                            data={ {
                                content: renderToString(
                                    <span className={ styles.yandexMapComponent__menuItem }>
                                            <>
                                                <span className={ styles.yandexMapComponent__menuItemLeft }>
                                                    { fio + ' ' }
                                                </span>
                                                { mapModes.answersMode ?
                                                    <span className={ styles.yandexMapComponent__menuItemRight }>
                                                        { contentOfListboxItem(idEmployee) }
                                                    </span>
                                                    :
                                                    <b className={ styles.yandexMapComponent__menuItemRight }
                                                       style={ { color: colorOfStatus(status) } }>
                                                        { status }
                                                    </b>
                                                }
                                            </>
                                    </span>),
                            } }
                            key={ fio + status }
                            onClick={ () => {
                                if (position[0] !== 0) {
                                    map?.current?.panTo(position, { flying: 1 })
                                    setSelectedDriver(idEmployee)
                                } else {
                                    activateDriverCard(idEmployee)
                                }
                            } }
                        />)
                    }
                </ListBox>
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
                               options={ {
                                   preset: 'islands#nightStretchyIcon',
                               } }
                               properties={ {
                                   iconContent: `в ${ currentRequest?.recipient?.city }`,
                                   hintContent: `Грузополучатель`,
                               }
                               }
                               onContextMenu={ extractCoordinatesToModal }
                    />
                </> }
                {/* отрисовка водителей вне видимости активной карты */ }
                { drivers.map(( { id, idEmployee, position, status, positionToBounds, fio, isOutOfBounds } ) =>
                    isOutOfBounds && <Placemark geometry={ positionToBounds }
                                                options={ {
                                                    preset: 'islands#blueDeliveryCircleIcon',
                                                    iconColor: colorOfStatus(status),
                                                    hasBalloon: true,
                                                } }
                                                properties={ { hintContent: `<b>${ fio }</b>` } }
                                                onClick={ () => {
                                                    // плавное перемещение к указанной точке
                                                    map?.current?.panTo(position, { flying: 1 })
                                                    setSelectedDriver(idEmployee)
                                                } }
                                                key={ idEmployee + id }
                    />)
                }
                { drivers.map(( { id, idEmployee, position, status, fio, isSelected } ) => {
                        if (!!position[0])
                            return <Placemark geometry={ position }
                                // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                                              options={ {
                                                  preset: 'islands#circleIcon',
                                                  iconColor: colorOfStatus(status),
                                                  hasBalloon: true,
                                              } }
                                              properties={ {
                                                  iconContent: `${ isSelected ? placemarkIsSelectedStyle : '' }` + id + '</b>',
                                                  hintContent: `<b>${ fio }</b>`,
                                                  balloonContent: `<div id="driver-${ idEmployee }" class="driver-card"></div>`,
                                              } }
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
        </section>
    )
}
