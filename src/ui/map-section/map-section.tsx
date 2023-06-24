import React, {Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import styles from './map-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {YandexBigMap} from '../common/yandex-map-component/yandex-map-component'
import {coordinatesFromTargetType, MapRequestRoad} from '../common/yandex-map-component/map-request-road'
import {
    getDriversBigMapStore,
    getFilteredResponsesBigMapStore,
    getIsFetchingBigMapStore,
} from '../../selectors/maps/big-map-reselect'
import {Button, ListBox, ListBoxItem, Placemark} from 'react-yandex-maps'
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
import {SizedPreloader} from '../common/tiny/preloader/preloader'
import {
    getInitialValuesRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../selectors/forms/request-form-reselect'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {renderToString} from 'react-dom/server'
import {
    boundsOffsetCorrector,
    directionOfBounds,
    distanceBetweenMeAndPointOnMap,
    isOutOfBounds,
    positionsToCorrectBounds,
    positionToBoundsLine,
} from '../../utils/map-utils'
import {boldWrapper} from '../../utils/html-rebuilds'
import {parseToNormalMoney, toNumber} from '../../utils/parsers'
import {colorOfStatus} from './utilites'
import {MapListBoxItem} from './map-list-box-item/map-list-box-item'


type OwnProps = {}

export type MapModesType = { answersMode: boolean, routesMode: boolean, statusMode: boolean }

// основная карта (по кнопке меню)
export const MapSection: React.ComponentType<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const responses = useSelector(getFilteredResponsesBigMapStore)
    const currentRequest = useSelector(getInitialValuesRequestStore)

    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState('')
    const routes = useSelector(getRoutesStore)

    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const authGeoPositionAsCenter = useSelector(getGeoPositionAuthStore)
    const zoom = 7

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()
    const dispatch = useDispatch()

    const map = useRef<any>({})
    const ymap = useRef<any>({})

    const mapModes: MapModesType = useMemo(() => ( {
        answersMode: pathname.includes(routes.maps.answers),
        routesMode: pathname.includes(routes.maps.routes),
        statusMode: pathname.includes(routes.maps.status),
    } ), [ pathname, routes?.maps ])

    // этот способ присвоения избавляет от бесконечной перерисовки карты
    const [ center ] = useState(authGeoPositionAsCenter)

    // корректное отображение цетровки карты по нарисованному маршруту
    const answerRouteBounds = useMemo(() => ( mapModes.answersMode && polyline )
        ? positionsToCorrectBounds({
            start: polyline[0],
            finish: polyline[polyline.length - 1],
        })
        : undefined, [ polyline?.length, mapModes.answersMode ])

    // обновление контента
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
            const currentCenter: number[] = map?.current?.getCenter() || [ 0, 0 ]
            map.current.panTo(currentCenter.map(x => x - 0.0001), { flying: 1 })
            setIsOneTimeRender(true)
        }

    }, [ map?.current?.panTo, isOneTimeRender, setIsOneTimeRender ])

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
            text: 'Координаты: ' + boldWrapper(e?.originalEvent?.target?.geometry?._coordinates?.join(', ')),
        }))
    }

    // псевдо-перерисовка маркеров, ушедших за край видимости карты, на край карты
    const placemarkersReWriter = useMemo(() => () => {
        const bounds: number[][] = map?.current?.getBounds()
        dispatch(bigMapStoreActions.setDriversList(drivers
            .map(( { position, ...props } ): DriverOnMapType => ( {
                ...props, position,
                isOutOfBounds: position[0] !== 0 && isOutOfBounds({ position, bounds }),
                positionToBounds: positionToBoundsLine({ position, bounds }),
                directionOfBounds: directionOfBounds({ position, bounds }),
            } )),
        ))
    }, [ JSON.stringify(drivers) ])

    // элемент выпадающего списка в селекторе на карте
    const contentOfListboxItem = ( idEmployee: string ): string => {
        const responseWithCurrentIdEmployee = responses?.find(( { idEmployee: id } ) => id === idEmployee)
        return responseWithCurrentIdEmployee
            ? ( ' ' + responseWithCurrentIdEmployee?.cargoWeight + 'тн. | '
                + parseToNormalMoney(toNumber(responseWithCurrentIdEmployee?.responsePrice)) + 'руб.' )
            : '-'
    }

    // прогрузка водителя в модальное окно
    const activateDriverCard = ( idEmployee: string ) => {
        dispatch<any>(textAndActionGlobalModal({
            reactChildren: <AddDriversView idEmployee={ idEmployee } isModal/>,
            isFooterVisible: false,
            isTitleVisible: false,
            isBodyPadding: false,
        }))
    }

    // дорисовка расстояния (в радиусе)
    const SpanDistanceInKm = ( { position, polyline }: { position: number[], polyline?: number[][] } ) => {

        const distance = !!position[0] && polyline
            ? distanceBetweenMeAndPointOnMap({
                firstPoint: position, secondPoint: polyline[0],
            })
            : null

        const distanceText = distance && (
            distance < 10e6
                ? '< 1'
                : '~' + Math.round(distance / 1000)
        )

        return distance && <span>{ distanceText + 'км' }</span>
    }

    return (
        <section className={ styles.yandexMapComponent }>
            { isFetching &&
                <div className={ styles.yandexMapComponent__preloader }><SizedPreloader sizeHW={ '200px' }/></div> }

            <YandexBigMap center={ center }
                          zoom={ zoom }
                          bounds={ answerRouteBounds }
                          instanceMap={ map }
                          instanceYMap={ ymap }
                          onBoundsChange={ placemarkersReWriter }
            >
                {/* КНОПКА ЦЕНТРОВКИ НА МАРШРУТ */ }
                { mapModes.answersMode && polyline &&
                    <Button data={ {
                        content: renderToString(<div
                            title={ 'Центрирование на маршруте (начало/конец)' }
                            style={ {
                                backgroundImage: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiI+PGcgZmlsbD0iIzZCNkI2QiI+PHBhdGggZD0iTTEwIDE0aDQuNWEzLjUgMy41IDAgMCAwIDAtN0gxMHYyaDQuNWExLjUgMS41IDAgMSAxIDAgM0gxMHYyem0wIDAiLz48cGF0aCBkPSJNMTUgMTJoLTQuNWEzLjUgMy41IDAgMCAwIDAgN0gxNXYtMmgtNC41YTEuNSAxLjUgMCAxIDEgMC0zSDE1di0yem0wIDBNMTkgMjBhMiAyIDAgMSAwIDAtNCAyIDIgMCAwIDAgMCA0em0wLTFhMSAxIDAgMSAwIDAtMiAxIDEgMCAwIDAgMCAyem0wIDBNOSAxMGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6bTAtMWExIDEgMCAxIDAgMC0yIDEgMSAwIDAgMCAwIDJ6bTAgMCIvPjxwYXRoIGQ9Ik0xMy41NyAyMC44bDIuODMtMi44Mi0uNzEtLjctMi44MyAyLjgyLjcuN3ptMS40MS0yLjgybC43LS43LTIuMTEtMi4xMy0uNy43IDIuMTEgMi4xM3ptMCAwIi8+PC9nPjwvc3ZnPg==)',
                                width: '25px',
                                height: '25px',
                            } }/>),
                    } }
                            onClick={ ( e: any ) => {
                                map.current.panTo(e?.originalEvent?.target?._selected
                                    ? polyline[0] : polyline[polyline.length - 1])
                            } }
                    />
                }
                {/* СПИСОК ВОДИТЕЛЕЙ В СЕЛЕКТОРЕ (ВЫПАДАЮЩЕМ СПИСКЕ) КАРТЫ */ }
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
                                content: renderToString(<MapListBoxItem fio={ fio }
                                                                        status={ status }
                                                                        position={ position }
                                                                        idEmployee={ idEmployee }
                                                                        mapModes={ mapModes }
                                                                        polyline={ polyline }
                                                                        responses={ responses }
                                    />,
                                ),
                            } }
                            key={ fio + status + idEmployee }
                            onClick={ () => {
                                if (position[0] !== 0) {
                                    map?.current?.panTo(position, { flying: 1 })
                                } else {
                                    activateDriverCard(idEmployee)
                                }
                                setSelectedDriver(idEmployee)
                            } }
                        />)
                    }
                </ListBox>

                {/* МАРШРУТ/ДОРОГА */ }
                { mapModes.answersMode && polyline &&
                    <MapRequestRoad polyline={ polyline }
                                    onContextMenu={ extractCoordinatesToModal }
                                    senderCity={ currentRequest?.sender?.city + '' }
                                    recipientCity={ currentRequest?.recipient?.city + '' }
                    /> }
                {/* ВОДИТЕЛИ НА КАРТЕ */ }
                { drivers.map(( {
                                    id,
                                    idEmployee,
                                    position,
                                    status,
                                    fio,
                                    isSelected,
                                    isOutOfBounds,
                                    positionToBounds,
                                    directionOfBounds,
                                } ) =>
                    !!position[0]
                        ? <Fragment key={ id + idEmployee }>
                            <Placemark geometry={ position }
                                // modules={ [ 'geoObject.addon.balloon', 'geoObject.addon.hint' ] }
                                       options={ {
                                           preset: 'islands#circleIcon',
                                           iconColor: colorOfStatus(status),
                                           hasBalloon: true,
                                           openEmptyBalloon: true,
                                       } }
                                       properties={ {
                                           iconContent: renderToString(
                                               <span className={
                                                   styles.yandexMapComponent__placemarkContent + ' '
                                                   + ( isSelected ? styles.yandexMapComponent__placemarkContent__selected : '' )
                                               }>{ id }</span>),
                                           hintContent: `<b>${ fio }</b>`,
                                           balloonContent: `<div id='driver-${ idEmployee }' class='driver-card'></div>`,
                                       } }
                                // key={ id + idEmployee }
                                       onBalloonClose={ () => {
                                           setIdToPortal('')
                                       } }
                                       onClick={ () => {
                                           // ставим в очередь промисов, чтобы сработало после отрисовки балуна
                                           setTimeout(() => {
                                               setIdToPortal(idEmployee)
                                           }, 0)
                                           // пометка нажатого водителя
                                           setSelectedDriver(idEmployee)
                                       } }
                                       onContextMenu={ extractCoordinatesToModal }
                            />
                            {/* отрисовка маркера на водителей вне видимости активной карты */
                                isOutOfBounds &&
                                <Placemark geometry={ positionToBounds }
                                           options={ {
                                               preset: 'islands#blueDeliveryCircleIcon',
                                               iconColor: colorOfStatus(status),
                                               iconOffset: boundsOffsetCorrector(directionOfBounds),
                                               zIndexHover: 10000,
                                           } }
                                           properties={ { hintContent: `<b>${ fio }</b>` } }
                                           onClick={ () => {
                                               // плавное перемещение к указанной точке
                                               map?.current?.panTo(position, { flying: 1 })
                                               setSelectedDriver(idEmployee)
                                           } }
                                    // key={ idEmployee + id }
                                /> }
                        </Fragment>
                        : null,
                ) }
            </YandexBigMap>
            {/* ждём, когда появится балун с нужным ID */ }
            <Portal getHTMLElementId={ `driver-${ idToPortal }` }>
                <AddDriversView idEmployee={ idToPortal }/>
            </Portal>
        </section>
    )
}
