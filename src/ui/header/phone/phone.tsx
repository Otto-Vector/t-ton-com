import React, {useState} from 'react'
import styles from './phone.module.scss'
import phone from './../../../media/phone.png'

type OwnProps = { directPhoneNumber: string }

export const Phone: React.FC<OwnProps> = ( { directPhoneNumber } ) => {

    const [isActive, setIsActive] = useState(false)

    return (
        <div className={ styles.phone }>
            <a href={ `tel:${ directPhoneNumber }` } role={ 'button' }>
                <div className={ styles.phone__text + ' ' +  (isActive && styles.phone__text_active)}>{ directPhoneNumber }</div>
            </a>
            <img className={ styles.phone__img }
                 src={ phone }
                 alt="phone"
                 title={ directPhoneNumber }
                 onClick={()=>{setIsActive(!isActive)}}
            />
        </div>
    )
}
