import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
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
import {SizedPreloader} from '../common/preloader/preloader'
import {
    getInitialValuesRequestStore,
    getRoutesParsedFromPolylineRequestStore,
} from '../../selectors/forms/request-form-reselect'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {EmployeeStatusType} from '../../types/form-types'
import {renderToString} from 'react-dom/server'
import {
    boundsOffsetCorrector,
    directionOfBounds,
    isOutOfBounds,
    positionsToCorrectBounds,
    positionToBoundsLine,
} from '../../utils/map-utils'
import {MaterialIcon} from '../common/material-icon/material-icon'
import {boldWrapper} from '../../utils/html-rebuilds'
import {parseToNormalMoney} from '../../utils/parsers'


type OwnProps = {}

// вынес статическую функцию из компонеты
const colorOfStatus = ( stat: EmployeeStatusType ): string =>
    stat === 'свободен'
        ? 'red'
        : stat === 'на заявке'
            ? 'green'
            : 'orange'

// основная карта (по кнопке меню)
export const MapSection: React.FC<OwnProps> = () => {

    const drivers = useSelector(getDriversBigMapStore)
    const responses = useSelector(getFilteredResponsesBigMapStore)
    const currentRequest = useSelector(getInitialValuesRequestStore)

    const isFetching = useSelector(getIsFetchingBigMapStore)
    const [ idToPortal, setIdToPortal ] = useState({ idEmployee: '', flag: false })
    const routes = useSelector(getRoutesStore)

    const polyline = useSelector(getRoutesParsedFromPolylineRequestStore)
    const authGeoPositionAsCenter = useSelector(getGeoPositionAuthStore)
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
                isOutOfBounds: position[0] !== 0 && isOutOfBounds({ bounds, position }),
                positionToBounds: positionToBoundsLine({ position, bounds }),
                directionOfBounds: directionOfBounds({ position, bounds }),
            } )),
        ))
    }, [ JSON.stringify(drivers) ])


    const contentOfListboxItem = ( idEmployee: string ): string => {
        const finded = responses?.find(( { idEmployee: id } ) => id === idEmployee)
        return finded
            ? ( ' ' + finded?.cargoWeight + 'тн. | '
                + parseToNormalMoney(+( finded?.responsePrice || 0 )) + 'руб.' )
            : '-'
    }

    // прогрузка водителя в модальное окно
    const activateDriverCard = ( idEmployee: string ) => {
        dispatch<any>(textAndActionGlobalModal({
            reactChildren: <AddDriversView idEmployee={ idEmployee } isModal={ true }/>,
            isFooterVisible: false,
            isTitleVisible: false,
            isBodyPadding: false,
        }))
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
                                content: renderToString(
                                    <span className={ styles.yandexMapComponent__menuItem }>
                                        <>
                                            <span className={ styles.yandexMapComponent__menuItemLeft + ' '
                                                + ( position[0] === 0 ? styles.yandexMapComponent__menuItemLeft_noPosition : '' )
                                            }>
                                                <MaterialIcon
                                                    style={ {
                                                        fontSize: '20px', paddingRight: '5px',
                                                        color: !!position[0] ? 'inherit' : 'gray',
                                                    } }
                                                    icon_name={ !!position[0] ? 'location_on' : 'wrong_location' }/>
                                                { ' ' + fio + ' ' }
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
                {/* отрисовка водителей вне видимости активной карты */ }
                { drivers.map(( {
                                    id,
                                    idEmployee,
                                    position,
                                    status,
                                    positionToBounds,
                                    fio,
                                    isOutOfBounds,
                                    directionOfBounds,
                                } ) =>
                    isOutOfBounds && <Placemark geometry={ positionToBounds }
                                                options={ {
                                                    preset: 'islands#blueDeliveryCircleIcon',
                                                    iconColor: colorOfStatus(status),
                                                    iconOffset: boundsOffsetCorrector(directionOfBounds),
                                                } }
                                                properties={ { hintContent: `<b>${ fio }</b>` } }
                                                onClick={ () => {
                                                    // плавное перемещение к указанной точке
                                                    map?.current?.panTo(position, { flying: 1 })
                                                    setSelectedDriver(idEmployee)
                                                    console.log(drivers)
                                                } }
                                                key={ idEmployee + id }
                    />)
                }
                {/* ВОДИТЕЛИ НА КАРТЕ */ }
                { drivers.map(( { id, idEmployee, position, status, fio, isSelected } ) =>
                    !!position[0] ?
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
                                   key={ id + idEmployee }
                                   onClick={ () => {
                                       // ставим в очередь промисов, чтобы сработало после отрисовки балуна
                                       setTimeout(() => {
                                           // flag нужен, чтобы каждый раз возвращалось новое значение,
                                           // иначе при повторном нажатии на балун, он не от-риcовывается через Portal
                                           setIdToPortal(( val ) => ( { idEmployee, flag: !val.flag } ))
                                           // пометка нажатого водителя
                                           setSelectedDriver(idEmployee)
                                       }, 0)
                                   } }
                                   onContextMenu={ extractCoordinatesToModal }
                        /> : null) }
            </YandexBigMap>
            {/* ждём, когда появится балун с нужным ID */ }
            <Portal getHTMLElementId={ `driver-${ idToPortal.idEmployee }` }><AddDriversView
                idEmployee={ idToPortal.idEmployee }/></Portal>
        </section>
    )
}
