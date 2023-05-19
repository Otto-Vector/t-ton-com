import React from 'react'
import styles from './just-select.module.scss'
import {MaterialIcon} from '../material-icon/material-icon'

type OwnProps = {
    titleValue: string
    optionItems: string[]
    onChange: ( agr: string ) => void
    selectedValue: string
    iconsBgValue?: string[]
}

// самодельный селектор для фильтра в таблице
export const JustSelect: React.FC<OwnProps> = ( {
                                                    optionItems,
                                                    onChange,
                                                    selectedValue,
                                                    titleValue,
                                                    iconsBgValue,
                                                } ) => {
    const isIconsBg = !!iconsBgValue?.length
    return ( <div className={ styles.justSelect } title={ titleValue }
                  style={ isIconsBg ? { backgroundImage: `url(${ iconsBgValue[2] })` } : undefined }
        >
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
                { optionItems.map(( item, index ) =>
                    <option
                        className={ styles.justSelect__option }
                        key={ item }
                        value={ item }
                        // style={ isIconsBg ? {
                        //     backgroundImage: `url('${ iconsBgValue[index] }')`,
                        // } : { backgroundImage: 'gradient(green,blue)' } }
                    >
                        { item }</option>,
                ) }
            </select>
        </div>
    )
}
