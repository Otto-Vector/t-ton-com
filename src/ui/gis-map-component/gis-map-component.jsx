import React, { useEffect} from 'react'
import styles from './gis-map-component.module.scss'
import { load } from '@2gis/mapgl';



export const GisMapComponent = () => {
    // const [_, setMapInstance] = React.useContext(MapContext);

    useEffect(() => {
        let map
        load().then((mapglAPI) => {
            map = new mapglAPI.Map('map-container', {
                center: [55.31878, 25.23584],
                zoom: 13,
                key: 'rukixb6891',
            });
        });
        // Сохраняем ссылку на карту
        // setMapInstance(map);
        // Удаляем карту при размонтировании компонента
        return () => map && map.destroy();
    }, []);

   return (<div className={styles.gisMapComponent}>
           <MapWrapper/>
        </div>
    )
}

const MapWrapper = React.memo(
    () => {
        return <div id="map-container" style={{ width: '100%', height: '100%' }}></div>;
    },
    () => true,
);