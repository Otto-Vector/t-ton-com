import React from 'react'
import styles from './options-section.module.scss'
import {getRoutesStore} from '../../selectors/routes-reselect';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {
    getConsigneesOptionsStore,
    getEmployeesOptionsStore,
    getRequisitesInfoOptionsStore,
    getShippersOptionsStore,
    getTrailerOptionsStore,
    getTransportOptionsStore,
} from '../../selectors/options/options-reselect';
import {getIsFetchingShippersStore} from '../../selectors/options/shippers-reselect';
import {getIsFetchingConsigneesStore} from '../../selectors/options/consignees-reselect';

import {Button} from '../common/button/button';
import {ColumnDataList} from './column-data-list/column-data-list';
import {Preloader} from '../common/preloader/preloader';
import {getIsFetchingEmployeesStore} from '../../selectors/options/employees-reselect';
import {getIsFetchingTrailerStore} from '../../selectors/options/trailer-reselect';
import {getIsFetchingTransportStore} from '../../selectors/options/transport-reselect';
import {InfoButtonToModal} from '../common/info-button-to-modal/info-button-to-modal';


type OwnProps = {}

const ColumnPreloader: React.FC = () => <div style={ { height: '260px', width: '260px' } }><Preloader/></div>

export const OptionsSection: React.FC<OwnProps> = () => {

    const titleHeader = 'Настройки'

    const { requisites, optionsEdit } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const shippersList = useSelector(getShippersOptionsStore)
    const shipperIsFetching = useSelector(getIsFetchingShippersStore)

    const consigneesList = useSelector(getConsigneesOptionsStore)
    const consigneeIsFetching = useSelector(getIsFetchingConsigneesStore)

    const transportList = useSelector(getTransportOptionsStore)
    const transportIsFetching = useSelector(getIsFetchingTransportStore)

    const trailerList = useSelector(getTrailerOptionsStore)
    const trailerIsFetching = useSelector(getIsFetchingTrailerStore)

    const employeesList = useSelector(getEmployeesOptionsStore)
    const employeeIsFetching = useSelector(getIsFetchingEmployeesStore)

    const requisitesInfoText = useSelector(getRequisitesInfoOptionsStore)


    return (
        <section className={ styles.optionsSection }>
            {/*ГОЛОВА С КНОПКОЙ РЕКВИЗИТЫ*/ }
            <header className={ styles.optionsSection__header }>
                <h3>{titleHeader}</h3>
                <div className={ styles.optionsSection__buttonRequisites }>
                    <Button type={ 'button' }
                            title={ 'Реквизиты' }
                            colorMode={ 'blue' }
                            rounded onClick={ () => {
                        navigate(requisites)
                    } }> Реквизиты </Button>
                    <InfoButtonToModal textToModal={ requisitesInfoText }/>
                </div>
            </header>
            {/*СПИСКИ*/ }
            <div className={ styles.optionsSection__table }>
                { shipperIsFetching ? <ColumnPreloader/> :
                    <ColumnDataList item={ shippersList } route={ optionsEdit.shippers }/> }
                { employeeIsFetching ? <ColumnPreloader/> :
                    <ColumnDataList item={ employeesList } route={ optionsEdit.employees }/> }
                { transportIsFetching ? <ColumnPreloader/> :
                    <ColumnDataList item={ transportList } route={ optionsEdit.transport }/> }
                { trailerIsFetching ? <ColumnPreloader/> :
                    <ColumnDataList item={ trailerList } route={ optionsEdit.trailer }/> }
                { consigneeIsFetching ? <ColumnPreloader/> :
                    <ColumnDataList item={ consigneesList } route={ optionsEdit.consignees }/> }
            </div>
        </section>
    )
}
