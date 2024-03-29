import React, {ChangeEvent} from 'react'
import {ProjectButton} from '../../buttons/project-button/project-button'
import {MaterialIcon} from '../../tiny/material-icon/material-icon'
import styles from './with-attach-form.module.scss'

type OwnProps = {
    title?: string
    onChange: ( event: ChangeEvent<HTMLInputElement> ) => void
    children: React.ReactNode
    disabledAttach?: boolean
    // для дополнительной кнопки
    addViewButton?: boolean
    disabledView?: boolean
    onViewClick?: () => void
}
//
export const WithAttachForm: React.ComponentType<OwnProps> = (
    {
        title = '',
        onChange, children,
        disabledAttach,
        addViewButton,
        disabledView,
        onViewClick,
    } ) => {

    return (
        <div className={ styles.withAttach }>
            { children }
            <div
                className={ styles.withAttach__button + ' '
                    + styles.withAttach__button_absolute + ' '
                    + ( addViewButton ? styles.withAttach__button_absolute_withView : '' ) }>
                <ProjectButton colorMode={ 'noFill' }
                               title={ 'Добавить' + title }
                               disabled={ disabledAttach }
                               rounded
                >
                    <MaterialIcon icon_name={ 'attach_file' }/>
                    <input type={ 'file' }
                           className={ styles.withAttach__hiddenAttachInput + ' '
                               + ( disabledAttach ? styles.withAttach__hiddenAttachInput_disabled : '' ) }
                           accept={ '.png, .jpeg, .pdf, .jpg' }
                           onChange={ onChange }/>
                </ProjectButton>
            </div>
            { addViewButton &&
                <div className={ styles.withAttach__button }>
                    <ProjectButton colorMode={ 'white' }
                                   title={ 'Просмотреть' + title }
                                   disabled={ disabledView }
                                   onClick={ onViewClick }
                                   rounded
                    >
                        <MaterialIcon icon_name={ 'search' }/>
                    </ProjectButton>
                </div>
            }
        </div>
    )
}
