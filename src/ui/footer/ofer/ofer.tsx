import React from 'react';
import styles from './ofer.module.scss';
import docum from '../../../media/document.svg'

type OwnProps = {
    linkToOfer: string
}

export const Ofer: React.FC<OwnProps> = ( { linkToOfer } ) => {

    const oferText = 'Договор-оферта';

    return (
        <a href={ linkToOfer } className={ styles.ofer } role={ 'button' }>
            <img className={ styles.ofer__img } src={ docum } alt={ oferText }/>
            <span>{ oferText }</span>
        </a>
    )
}