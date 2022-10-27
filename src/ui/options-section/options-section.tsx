import React from 'react'
import styles from './options-section.module.scss'
import {getRoutesStore} from '../../selectors/routes-reselect';
import {useDispatch, useSelector} from 'react-redux';
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
import {SizedPreloader} from '../common/preloader/preloader';
import {getIsFetchingEmployeesStore} from '../../selectors/options/employees-reselect';
import {getIsFetchingTrailerStore} from '../../selectors/options/trailer-reselect';
import {getIsFetchingTransportStore} from '../../selectors/options/transport-reselect';
import {InfoButtonToModal} from '../common/info-button-to-modal/info-button-to-modal';
import {getPersonalOrganizationRequisites} from '../../redux/options/requisites-store-reducer';


type OwnProps = {}


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

    const showRequisitesOnClick = () => {
        navigate(requisites + 'old')
    }


    return (
        <section className={ styles.optionsSection }>
            {/*ГОЛОВА С КНОПКОЙ РЕКВИЗИТЫ*/ }
            <header className={ styles.optionsSection__header }>
                <h3>{ titleHeader }</h3>
                <div className={ styles.optionsSection__buttonRequisites }>
                    <Button type={ 'button' }
                            title={ 'Реквизиты' }
                            colorMode={ 'blue' }
                            rounded
                            onClick={ showRequisitesOnClick }> Реквизиты </Button>
                    <InfoButtonToModal textToModal={ requisitesInfoText }/>
                </div>
            </header>
            {/*СПИСКИ*/ }
            <div className={ styles.optionsSection__table }>
                { shipperIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ shippersList } route={ optionsEdit.shippers }/> }
                { employeeIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ employeesList } route={ optionsEdit.employees }/> }
                { transportIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ transportList } route={ optionsEdit.transport } isPlacemarked/> }
                { trailerIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ trailerList } route={ optionsEdit.trailer } isPlacemarked/> }
                { consigneeIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ consigneesList } route={ optionsEdit.consignees }/> }
            </div>
        </section>
    )
}
