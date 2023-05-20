import {Placemark, Polyline} from 'react-yandex-maps'

export type coordinatesFromTargetType = { originalEvent: { target: { geometry: { _coordinates: number[] } } } }

type MapRequestRoadType = {
    polyline: number[][]
    onContextMenu?: ( a: coordinatesFromTargetType ) => void
    senderCity: string
    recipientCity: string
}

// отрисовка дороги И точки погрузки/разгрузки с контекстом
export const MapRequestRoad: React.FC<MapRequestRoadType> = ( {
                                                                  polyline,
                                                                  recipientCity,
                                                                  senderCity,
                                                                  onContextMenu,
                                                              } ) => {
    const placemarkOptions = { preset: 'islands#nightStretchyIcon' }
    const polylineOptions = {
        strokeColor: '#023E8A',
        strokeWidth: 4,
        opacity: 0.8,
    }
    return ( <>
        {/* ДОРОГА */ }
        <Polyline geometry={ polyline }
                  options={ polylineOptions }/>
        {/* ТОЧКА ПОГРУЗКИ */ }
        <Placemark geometry={ polyline[0] }
                   options={ placemarkOptions }
                   properties={ {
                       iconContent: `из ${ senderCity }`,
                       hintContent: `Грузоотправитель`,
                   } }
                   onContextMenu={ onContextMenu }
        />
        {/* ТОЧКА РАЗГРУЗКИ */ }
        <Placemark geometry={ polyline[polyline.length - 1] }
                   options={ placemarkOptions }
                   properties={ {
                       iconContent: `в ${ recipientCity }`,
                       hintContent: `Грузополучатель`,
                   } }
                   onContextMenu={ onContextMenu }
        />
    </> )
}
