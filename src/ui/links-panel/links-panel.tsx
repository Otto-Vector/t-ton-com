import React from 'react'
import styles from './links.module.scss'
import { useSelector} from 'react-redux'
import {getLinksStore} from '../../selectors/base-reselect'

type OwnProps = {}

export const LinksPanel: React.FC<OwnProps> = () => {
    const links = useSelector( getLinksStore )

    return (
        <div className={ styles.links }>
            { links.map( ( {domain, title} ) =>
                <a href={ domain } target="_blank" rel="noopener noreferrer"
                   type={'button'} key={domain}>
                    <div className={ styles.links__item } title={title}>
                        <img className={ styles.links__img } src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt={ domain }/>
                    </div>
                </a>)}
                </div>
                )
            }
