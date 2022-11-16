import React from 'react';
import styles from './preloader.module.css'
import preLoader from './svg/Spinner.svg'

export const Preloader: React.FC = () => {

    return (
        <div className={ styles.preloader }>
            <img className={ styles.image } src={ preLoader } alt="preload"/>
        </div>
    )
}

type OwnProps = { sizeHW: string, marginH?: string}
export const SizedPreloader: React.FC<OwnProps> = ( { sizeHW ,marginH} ) =>
    <div style={ { height: `${ sizeHW }`, width: `${ sizeHW }`, margin: `${marginH || 'auto'} auto` } }>
        <Preloader/>
    </div>