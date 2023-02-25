import React, {useState} from 'react'
import styles from './button-menu-save-load.module.scss'
import {Button} from '../button/button'
import {MaterialIcon} from '../material-icon/material-icon'

type OwnProps = {
    titleValue: string
    loadUrl: string
    onUpload: () => void
}


export const ButtonMenuSaveLoad: React.FC<OwnProps> = ( { titleValue, loadUrl, onUpload } ) => {

    const [ isOpen, setIsOpen ] = useState(false)

    const onClick = () => {
        setIsOpen(open => !open)
    }

    return ( <div className={ styles.buttonMenuSaveLoad }>
            <Button
                onClick={ onClick }
                colorMode={ 'blue' }
            >
                <span className={ styles.buttonMenuSaveLoad__text }>{ titleValue }</span>
                <MaterialIcon style={ { fontWeight: '100' } } icon_name={ 'expand_circle_down' }/>
            </Button>
            { isOpen && <p>{ 'open' }</p> }
        </div>
    )
}
