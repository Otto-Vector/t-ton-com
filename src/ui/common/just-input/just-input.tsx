import React from 'react'
import styles from './just-input.module.scss'
import {useAsyncDebounce} from 'react-table'
import {MaterialIcon} from '../material-icon/material-icon'


type OwnProps = {
    value: string
    onChange: ( agr: string ) => void
}

// самодельный input для фильтра в таблице
export const JustInput: React.FC<OwnProps> = ( { value, onChange } ) => {

    const onChangeDebounce = useAsyncDebounce(value => {
        onChange(value?.slice(0, 20) || '')
    }, 100)

    return (
        <div className={ styles.justInput }>
            <span className={ styles.justInput_after }><MaterialIcon icon_name={ 'search' }/></span>
            <input className={ styles.justInput__input }
                   name="globalFilter" id="globalFilter"
                   value={ value }
                   onChange={ ( e ) => {
                       onChangeDebounce(e?.target?.value)
                   } }
            />
        </div>
    )
}
