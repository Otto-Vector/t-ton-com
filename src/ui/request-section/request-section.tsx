import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {To, useLocation, useNavigate, useParams} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {
    deleteCurrentRequestAPI,
    getOneRequestsAPI,
    setCarrierDataToLocalRequest,
    setNewRequestAPI,
} from '../../redux/forms/request-store-reducer';
import {getInitialValuesRequestStore, getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect';
import {CancelButton} from '../common/cancel-button/cancel-button';
import {RequestFormDocumentsRight} from './request-form-documents-right/request-form-documents-right';
import {RequestMapCenter} from './request-map-center/request-map-center';
import {RequestFormLeft} from './request-form-left/request-form-left';
import {ddMmYearFormat} from '../../utils/date-formats';
import {SizedPreloader} from '../common/preloader/preloader';
import {valuesAreEqual} from '../../utils/reactMemoUtils';
import {getOneEmployeeFromAPI} from '../../redux/options/employees-store-reducer';
import {getInitialValuesEmployeesStore} from '../../selectors/options/employees-reselect';

// type OwnProps = { }

export type RequestModesType = { createMode: boolean, statusMode: boolean, historyMode: boolean, acceptDriverMode: boolean }

export const RequestSection: React.FC = React.memo(() => {

    const [ tabModes, setTabModes ] = useState({ left: false, center: false, right: false })
    const activeTab = useCallback(( tab: 'left' | 'center' | 'right' ) => {
        setTabModes({ ...{ left: false, center: false, right: false }, [tab]: true })
    }, [])

    const [ isFirstRender, setIsFirstRender ] = useState(true)

    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()

    const requestModes: RequestModesType = useMemo(() => ( {
        createMode: pathname.includes(routes.requestInfo.create),
        statusMode: pathname.includes(routes.requestInfo.status),
        historyMode: pathname.includes(routes.requestInfo.history),
        acceptDriverMode: pathname.includes(routes.requestInfo.accept),
    } ), [ pathname ])

    const isFetching = useSelector(getIsFetchingRequestStore)
    const initialValues = useSelector(getInitialValuesRequestStore)
    const oneEmployee = useSelector(getInitialValuesEmployeesStore)

    const dispatch = useDispatch()

    const cancelNavigate = (): To => {
        if (requestModes.acceptDriverMode) return routes.searchList
        if (requestModes.statusMode) return routes.requestsList
        if (requestModes.historyMode) return routes.historyList
        return -1 as To
    }


    const onCancelButton = () => {
        if (requestModes.createMode) {
            dispatch<any>(deleteCurrentRequestAPI({ requestNumber: +( initialValues.requestNumber || 0 ) }))
        }
        navigate(cancelNavigate())
    }


    useEffect(() => {// должен сработать ТОЛЬКО один раз
        if (isFirstRender) {
            activeTab('left')
            if (requestModes.createMode) {
                // создаём пустую и записываем номер заявки
                dispatch<any>(setNewRequestAPI())
            }
            if (requestModes.statusMode || requestModes.acceptDriverMode || requestModes.historyMode) {
                if (initialValues.requestNumber !== +( reqNumber || 0 ))
                    dispatch<any>(getOneRequestsAPI(+( reqNumber || 0 )))
            }
            if (requestModes.statusMode) { // для прогрузки данных искомого водителя в форму
                dispatch<any>(getOneEmployeeFromAPI)
            }
            setIsFirstRender(false)
        }
    }, [ isFirstRender ])

    useEffect(() => { //подгружаем данные грузо-перевозчика
        if (initialValues.requestUserCarrierId && !initialValues.requestCarrier) {
            if (requestModes.historyMode || requestModes.statusMode) {
                dispatch<any>(setCarrierDataToLocalRequest(initialValues.requestUserCarrierId + ''))
            }
        }
    })

    if (!requestModes.createMode && !initialValues.requestNumber) return <div>
        <br/><br/> { 'ДАННАЯ ЗАЯВКА НЕДОСТУПНА !' }
    </div>

    return (
        <section className={ styles.requestSection }>
            <div className={ styles.requestSection__subWrapper }>
                <div className={ styles.requestSection__wrapper }>
                    { isFetching ? <SizedPreloader sizeHW={ '400px' } marginH={ '25%' }/> :
                        <>
                            <header className={ styles.requestSection__header }>
                                { `Заявка №${ initialValues.requestNumber } от ${ ddMmYearFormat(initialValues.requestDate) }` }
                            </header>
                            <div
                                className={ !tabModes.center ? styles.requestSection__formsWrapper : styles.requestSection__mapsWrapper }>
                                { tabModes.left && <RequestFormLeft requestModes={ requestModes }
                                                                    initialValues={ initialValues }
                                /> }
                                { tabModes.center && <RequestMapCenter requestModes={ requestModes }
                                                                       driverCoords={ oneEmployee.coordinates }
                                /> }
                                { tabModes.right && <RequestFormDocumentsRight requestModes={ requestModes }/> }
                            </div>

                            <CancelButton onCancelClick={ onCancelButton } mode={ 'blueAlert' }/>
                        </> }
                </div>
                <div className={ styles.requestSection__bottomTabsPanel }>
                    <div className={ styles.requestSection__bottomTabsItem + ' ' +
                        ( tabModes.left && styles.requestSection__bottomTabsItem_active ) }
                         onClick={ () => activeTab('left') }>
                        { 'Данные' }
                    </div>
                    <div className={ styles.requestSection__bottomTabsItem + ' ' +
                        ( tabModes.center && styles.requestSection__bottomTabsItem_active ) }
                         onClick={ () => activeTab('center') }>
                        { 'Маршрут' }
                    </div>
                    <div className={ styles.requestSection__bottomTabsItem +
                        ( tabModes.right ? ' ' + styles.requestSection__bottomTabsItem_active : '' ) +
                        ( ( requestModes.createMode || requestModes.acceptDriverMode ) ? ' ' + styles.requestSection__bottomTabsItem_disabled : '' ) }
                         onClick={ () => ( requestModes.createMode || requestModes.acceptDriverMode ) ? undefined : activeTab('right') }>
                        { 'Документы' }
                    </div>
                </div>
            </div>
        </section>
    )
}, valuesAreEqual)
