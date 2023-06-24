import React from 'react'
import styles from '../map-section.module.scss'
import {MaterialIcon} from '../../common/tiny/material-icon/material-icon'
import {DriverOnMapType} from '../../../redux/maps/big-map-store-reducer'
import {MapModesType} from '../map-section'
import {distanceBetweenMeAndPointOnMap} from '../../../utils/map-utils'
import {parseToNormalMoney, toNumber} from '../../../utils/parsers'
import {colorOfStatus} from '../utilites'
import {EmployeeStatusType, ResponseToRequestCardType} from '../../../types/form-types'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'

type OwnProps = Pick<DriverOnMapType, 'fio' | 'position' | 'status' | 'idEmployee'> & {
    mapModes: MapModesType
    polyline?: number[][]
    responses?: ResponseToRequestCardType<string>[]
}

export const MapListBoxItem: React.ComponentType<OwnProps> = React.memo(( {
                                                                              fio,
                                                                              position,
                                                                              status,
                                                                              idEmployee,
                                                                              mapModes,
                                                                              polyline,
                                                                              responses,
                                                                          } ) => {
    const isCoordinatesOff = position[0] === 0

    return (
        <span className={ styles.yandexMapComponent__menuItem }>
                                        <>
                                            <span className={ styles.yandexMapComponent__menuItemLeft + ' '
                                                + ( isCoordinatesOff ? styles.yandexMapComponent__menuItemLeft_noPosition : '' )
                                            }>
                                                <LocationIcon isCoordinatesOff={ isCoordinatesOff }/>
                                                { fio }
                                            </span>
                                            { mapModes.answersMode ?
                                                <>
                                                    <ResponseDataOfListboxItem idEmployee={ idEmployee }
                                                                               responses={ responses }/>
                                                    <SpanDistanceInKm position={ position } polyline={ polyline }/>
                                                </>
                                                :
                                                <ListBoxItemStatus status={ status }/>
                                            }
                                        </>
                                    </span>
    )
}, valuesAreEqual)

// данные ответа по заявке
const ResponseDataOfListboxItem: React.ComponentType<{ idEmployee: string, responses?: ResponseToRequestCardType<string>[] }> = (
    {
        idEmployee,
        responses,
    } ) => {
    const responseWithCurrentIdEmployee = responses?.find(( { idEmployee: id } ) => id === idEmployee)
    return <span className={ styles.yandexMapComponent__menuItemRight }>
        { responseWithCurrentIdEmployee
            ? ( ' ' + responseWithCurrentIdEmployee?.cargoWeight + 'тн. | '
                + parseToNormalMoney(toNumber(responseWithCurrentIdEmployee?.responsePrice)) + 'руб.' )
            : '-' }
    </span>
}

// дорисовка расстояния (в радиусе)
const SpanDistanceInKm: React.ComponentType<{ position: number[], polyline?: number[][] }> = ( {
                                                                                                   position,
                                                                                                   polyline,
                                                                                               } ) => {
    const distance = !!position[0] && polyline
        ? distanceBetweenMeAndPointOnMap({
            firstPoint: position, secondPoint: polyline[0],
        })
        : null

    const distanceText = distance && (
        distance <= 1000
            ? '< 1'
            : '~' + Math.round(distance / 1000)
    )

    return ( distance ? <span>{ distanceText + 'км' }</span> : null )
}

// иконка отображения возможности локации
const LocationIcon: React.ComponentType<{ isCoordinatesOff: boolean }> = ( { isCoordinatesOff } ) =>
    <MaterialIcon
        style={ {
            fontSize: '20px', paddingRight: '5px',
            color: !isCoordinatesOff ? 'inherit' : 'gray',
        } }
        icon_name={ !isCoordinatesOff ? 'location_on' : 'wrong_location' }/>

// отображение статуса
const ListBoxItemStatus: React.ComponentType<{ status: EmployeeStatusType }> = ( { status } ) =>
    <b className={ styles.yandexMapComponent__menuItemRight }
       style={ { color: colorOfStatus(status) } }>
        { status }
    </b>
