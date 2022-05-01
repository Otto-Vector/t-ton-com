import React, {useState} from 'react'
import styles from './options-section.module.scss'
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

type OwnProps = {
}

export const OptionsSection: React.FC<OwnProps> = () => {

    const {requisites} = useSelector(getRoutesStore)
    const navigate = useNavigate()

    return (
        <section className={ styles.optionsSection }>
            <header className={styles.optionsSection__header}>
                <h3>Настройки</h3>
                <div className={styles.optionsSection__buttonRequisites}>
                <Button type={'button'}
                        title={'Реквизиты'}
                        colorMode={'blue'}
                        rounded onClick={()=>{navigate(requisites)}}> Реквизиты </Button>
                </div>
            </header>
                </section>
                )
            }
