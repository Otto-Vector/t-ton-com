import React from 'react'
import styles from './options-section.module.scss'
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {ColumnDataList} from './column-data-list/column-data-list';
import {
    getConsigneesOptionsStore,
    getEmployeesOptionsStore,
    getShippersOptionsStore,
    getTrailerOptionsStore, getTransportOptionsStore,
} from '../../selectors/options-reselect';

type OwnProps = {
}

export const OptionsSection: React.FC<OwnProps> = () => {

    const {requisites, optionsEdit} = useSelector(getRoutesStore)
    const shippers = useSelector(getShippersOptionsStore)
    const employees = useSelector(getEmployeesOptionsStore)
    const transport = useSelector(getTransportOptionsStore)
    const trailer = useSelector(getTrailerOptionsStore)
    const consignees = useSelector(getConsigneesOptionsStore)
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
            <div className={styles.optionsSection__table}>
                <ColumnDataList label={shippers.label} content={shippers.content} route={optionsEdit.shippers}/>
                <ColumnDataList label={employees.label} content={employees.content} route={optionsEdit.employees}/>
                <ColumnDataList label={transport.label} content={transport.content} route={optionsEdit.transport}/>
                <ColumnDataList label={trailer.label} content={trailer.content} route={optionsEdit.trailer}/>
                <ColumnDataList label={consignees.label} content={consignees.content} route={optionsEdit.consignees}/>
            </div>
                </section>
                )
            }
