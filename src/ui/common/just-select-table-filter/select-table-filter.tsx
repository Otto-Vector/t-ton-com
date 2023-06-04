import React, {useEffect, useRef, useState} from 'react'
import styles from './select-table-filter.module.scss'
import {MaterialIcon} from '../material-icon/material-icon'

type OwnProps = {
    titleValue: string
    optionItems: string[]
    onChange: ( agr: string ) => void
    selectedValue: string
    iconsBgValue?: string[]
}

// самодельный селектор для фильтра в таблице
export const SelectTableFilter: React.FC<OwnProps> = ( {
                                                           optionItems,
                                                           onChange,
                                                           selectedValue,
                                                           titleValue,
                                                           iconsBgValue,
                                                       } ) => {
    const isIconsBg = !!iconsBgValue?.length
    const selectRef = useRef(null)
    const [ isOpen, setIsOpen ] = useState(false)

    // заколхозили проверку клика вне селектора, чтобы корректно отображать иконки
    useEffect(() => {
        if (isIconsBg) {

            const handleClickOutside = ( event: any ) => {
                // @ts-ignore-next-line
                if (selectRef.current && !selectRef.current?.contains(event?.target)) {
                    setIsOpen(false)
                }
            }

            document.addEventListener('mousedown', handleClickOutside)
            // выполнить определенные действия при потере фокуса на window
            window.addEventListener('blur', () => setIsOpen(false))
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
                window.removeEventListener('blur', () => setIsOpen(false))
            }
        }
    }, [ selectRef, isIconsBg ])

    const handleSelectClick = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className={ styles.justSelect }
             title={ titleValue }
             ref={ selectRef }>
            <span className={ styles.justSelect_after }><MaterialIcon icon_name={ 'expand_more' }/></span>
            { isIconsBg && isOpen &&
                <div className={ styles.justSelect_icons }>
                    { iconsBgValue.map(val =>
                        <img className={ styles.justSelect_icon }
                             alt={ 'icon' }
                             src={ val }
                             key={ val }
                        />,
                    ) }
                </div> }
            <select className={ styles.justSelect__select }
                    onClick={ handleSelectClick }
                    name="cargoFilter" id="cargoFilter"
                    onChange={ ( e ) => {
                        onChange(e.target.value)
                    } }
                    value={ selectedValue }
            >
                <option className={ styles.justSelect__option }
                        value={ '' }>{ titleValue }</option>
                { optionItems.map(item =>
                    <option className={ styles.justSelect__option }
                            key={ item } value={ item }>{ item }</option>,
                ) }
            </select>
        </div>
    )
}
