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
    getRequisitesInfoOptionsStore,
    getShippersOptionsStore,
    getTrailerOptionsStore,
    getTransportOptionsStore,
} from '../../selectors/options/options-reselect';
import {InfoButtonToModal} from '../common/info-button-to-modal/info-button-to-modal';
import {getIsFetchingShippersStore} from '../../selectors/options/shippers-reselect';
import {Preloader} from '../common/preloader/preloader';

type OwnProps = {}

export const OptionsSection: React.FC<OwnProps> = () => {

    const { requisites, optionsEdit } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const shippersList = useSelector(getShippersOptionsStore)
    const shipperIsFetching = useSelector(getIsFetchingShippersStore)

    const consigneesList = useSelector(getConsigneesOptionsStore)
    const transportList = useSelector(getTransportOptionsStore)
    const trailerList = useSelector(getTrailerOptionsStore)
    const employeesList = useSelector(getEmployeesOptionsStore)

    const requisitesInfoText = useSelector(getRequisitesInfoOptionsStore)


    return (
        <section className={ styles.optionsSection }>
            <header className={ styles.optionsSection__header }>
                <h3>Настройки</h3>
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
            <div className={ styles.optionsSection__table }>
                { shipperIsFetching ? <div style={{height: '260px', width: '260px'}}><Preloader/></div> :
                    <ColumnDataList item={ shippersList } route={ optionsEdit.shippers }/> }
                <ColumnDataList item={ employeesList } route={ optionsEdit.employees }/>
                <ColumnDataList item={ transportList } route={ optionsEdit.transport }/>
                <ColumnDataList item={ trailerList } route={ optionsEdit.trailer }/>
                <ColumnDataList item={ consigneesList } route={ optionsEdit.consignees }/>
            </div>
        </section>
    )
}
