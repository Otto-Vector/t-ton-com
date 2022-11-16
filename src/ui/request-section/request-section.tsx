import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {To, useLocation, useNavigate, useParams} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {
    changeCurrentRequest,
    deleteCurrentRequestAPI,
    getOneRequestsAPI,
    requestStoreActions,
    setNewRequestAPI,
} from '../../redux/forms/request-store-reducer';
import {getInitialValuesRequestStore, getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect';
import {CancelButton} from '../common/cancel-button/cancel-button';
import {RequestFormDocumentsRight} from './request-form-documents-right/request-form-documents-right';
import {RequestMapCenter} from './request-map-center/request-map-center';
import {RequestFormLeft} from './request-form-left/request-form-left';
import {OneRequestType} from '../../types/form-types';
import {ddMmYearFormat} from '../../utils/date-formats';
import {SizedPreloader} from '../common/preloader/preloader';
import {valuesAreEqual} from '../../utils/reactMemoUtils';

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
        acceptDriverMode: pathname.includes(routes.requestInfo.driver),
    } ), [ pathname ])

    const isFetching = useSelector(getIsFetchingRequestStore)
    const initialValues = useSelector(getInitialValuesRequestStore)
    const title = `Заявка №${ initialValues.requestNumber } от ${ ddMmYearFormat(initialValues.requestDate) }`
    const dispatch = useDispatch()



    const cancelNavigate = (): To => {
        if (requestModes.statusMode) return routes.searchList
        if (requestModes.historyMode) return routes.historyList
        return -1 as To
    }

    const onCancelButton = () => {
        if (requestModes.createMode) {
            dispatch<any>(deleteCurrentRequestAPI({ requestNumber: +( initialValues.requestNumber || 0 ) }))
        }
        navigate(cancelNavigate())
        dispatch(requestStoreActions.setCurrentDistance(null))
    }

    useEffect(() => {// должен сработать ТОЛЬКО один раз
        if (isFirstRender) {
            activeTab('left')
            if (requestModes.createMode) {
                // запрашиваем (и создаём пустую) номер заявки
                dispatch<any>(setNewRequestAPI())
                // обнуляем данные маршрута
                dispatch(requestStoreActions.setCurrentRoute(null))
            }
            if (requestModes.statusMode) {
                dispatch<any>(getOneRequestsAPI(+( reqNumber || 0 )))
            }
            if (requestModes.historyMode) {
                dispatch<any>(getOneRequestsAPI(+( reqNumber || 0 )))
            }
            setIsFirstRender(false)
        }
    }, [ isFirstRender ])


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
                                { title }
                            </header>
                            <div
                                className={ !tabModes.center ? styles.requestSection__formsWrapper : styles.requestSection__mapsWrapper }>
                                { tabModes.left && <RequestFormLeft requestModes={ requestModes }
                                                                    initialValues={ initialValues }
                                /> }
                                { tabModes.center && <RequestMapCenter requestModes={ requestModes }/> }
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
                        ( requestModes.createMode ? ' ' + styles.requestSection__bottomTabsItem_disabled : '' ) }
                         onClick={ () => !requestModes.createMode ? activeTab('right') : undefined }>
                        { 'Документы' }
                    </div>
                </div>
            </div>
        </section>
    )
}, valuesAreEqual)
