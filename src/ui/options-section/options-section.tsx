import React, {useLayoutEffect} from 'react'
import styles from './options-section.module.scss'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {
    getConsigneesOptionsStore,
    getEmployeesOptionsStore,
    getRequisitesInfoOptionsStore,
    getShippersOptionsStore,
    getTrailerOptionsStore,
    getTransportOptionsStore,
} from '../../selectors/options/options-reselect'
import {getIsFetchingShippersStore} from '../../selectors/options/shippers-reselect'
import {getIsFetchingConsigneesStore} from '../../selectors/options/consignees-reselect'

import {ProjectButton} from '../common/buttons/project-button/project-button'
import {ColumnDataList} from './column-data-list/column-data-list'
import {SizedPreloader} from '../common/tiny/preloader/preloader'
import {getIsFetchingEmployeesStore} from '../../selectors/options/employees-reselect'
import {getIsFetchingTrailerStore} from '../../selectors/options/trailer-reselect'
import {getIsFetchingTransportStore} from '../../selectors/options/transport-reselect'
import {InfoButtonToModal} from '../common/buttons/info-button-to-modal/info-button-to-modal'
import {initializedAllOptionsList} from '../../redux/options/options-store-reducer'
import {AppStateType} from '../../redux/redux-store'


type OwnProps = {}


export const OptionsSection: React.ComponentType<OwnProps> = () => {

    const titleHeader = 'Настройки'
    const initialazed = useSelector(( state: AppStateType ) => state.appStoreReducer.initialized)
    const dispatch = useDispatch()

    // переподгрузка данных для обновления индикации на списках
    useLayoutEffect(() => {
        // минус одна подгрузка при инициализации
        if (initialazed)
            dispatch<any>(initializedAllOptionsList())
    }, [ initialazed ])

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
                    <ProjectButton type={ 'button' }
                                   title={ 'Реквизиты' }
                                   colorMode={ 'blue' }
                                   rounded
                                   onClick={ showRequisitesOnClick }> Реквизиты </ProjectButton>
                    <InfoButtonToModal textToModal={ requisitesInfoText }/>
                </div>
            </header>
            {/*СПИСКИ*/ }
            <div className={ styles.optionsSection__table }>
                { shipperIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ shippersList } route={ optionsEdit.shippers } isPlacemarked/> }
                { employeeIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ employeesList } route={ optionsEdit.employees } isPlacemarked/> }
                { transportIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ transportList } route={ optionsEdit.transport } isPlacemarked/> }
                { trailerIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ trailerList } route={ optionsEdit.trailer } isPlacemarked/> }
                { consigneeIsFetching ? <SizedPreloader sizeHW={ '260px' }/> :
                    <ColumnDataList item={ consigneesList } route={ optionsEdit.consignees } isPlacemarked/> }
            </div>
        </section>
    )
}
