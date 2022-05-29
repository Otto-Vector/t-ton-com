import React from 'react'
import styles from './request-map-center.module.scss'

import searchMap from '../../../media/mapsicle-map-create.png'
import historyMap from '../../../media/mapsicle-map-history.png'
import {RequestModesType} from '../request-section';

type OwnProps = {
        requestModes: RequestModesType,
}

export const RequestMapCenter: React.FC<OwnProps> = ( { requestModes } ) => {


    return (
            <div className={ styles.requestMapCenter }>
                <div className={ styles.requestMapCenter__wrapper }>
                    {!requestModes.historyMode
                        ? <img src={ searchMap } alt="карта маршрутa"/>
                        : <img src={ historyMap } alt="карта маршрута и водителя"/>
                    }
                </div>
            </div>


    )
}
