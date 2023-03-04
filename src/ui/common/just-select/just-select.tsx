import React from 'react'
import styles from './just-select.module.scss'
import {MaterialIcon} from '../material-icon/material-icon'


type OwnProps = {
    titleValue: string
    optionItems: string[]
    onChange: ( agr: string ) => void
    selectedValue: string
}

// самодельный селектор для фильтра в таблице
export const JustSelect: React.FC<OwnProps> = ( { optionItems, onChange, selectedValue, titleValue } ) => {

    return ( <div className={ styles.justSelect } title={ titleValue }>
            <span className={ styles.justSelect_after }><MaterialIcon icon_name={ 'expand_more' }/></span>
            <select className={ styles.justSelect__select }
                    name="cargoFilter" id="cargoFilter"
                    onChange={ ( e ) => {
                        onChange(e.target.value)
                    } }
                    value={ selectedValue }
            >
                <option className={ styles.justSelect__option }
                        value={ '' }>{ titleValue }</option>
                { optionItems.map(( item ) =>
                    <option className={ styles.justSelect__option }
                            key={ item } value={ item }>{ item }</option>,
                ) }
            </select>
        </div>
    )
}
