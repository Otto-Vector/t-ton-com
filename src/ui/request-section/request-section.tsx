import React, {useEffect, useState} from 'react'
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
import {
    getCurrentRequestNumberStore,
    getDefaultInitialValuesRequestStore,
    getInitialValuesRequestStore,
    getIsNewRequestRequestStore,
} from '../../selectors/forms/request-form-reselect';
import {CancelButton} from '../common/cancel-button/cancel-button';
import {RequestFormDocumentsRight} from './request-form-documents-right/request-form-documents-right';
import {RequestMapCenter} from './request-map-center/request-map-center';
import {RequestFormLeft} from './request-form-left/request-form-left';
import {OneRequestType} from '../../types/form-types';
import {ddMmYearFormat} from '../../utils/date-formats';

// type OwnProps = {
//     mode: 'create' | 'status' | 'history'
// }

export type RequestModesType = { createMode: boolean, statusMode: boolean, historyMode: boolean, acceptDriverMode: boolean }

export const RequestSection: React.FC = React.memo(() => {


    const tabModesInitial = { left: false, center: false, right: false }
    const [ tabModes, setTabModes ] = useState({ ...tabModesInitial, left: true })
    const [ isFirstRender, setIsFirstRender ] = useState(true)

    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const { pathname } = useLocation()

    const requestModes: RequestModesType = {
        createMode: pathname.includes(routes.requestInfo.create),
        statusMode: pathname.includes(routes.requestInfo.status),
        historyMode: pathname.includes(routes.requestInfo.history),
        acceptDriverMode: pathname.includes(routes.requestInfo.driver),
    }

    const defaultInitialValues = useSelector(getDefaultInitialValuesRequestStore)
    const isNewRequest = useSelector(getIsNewRequestRequestStore) && reqNumber === 'new'
    const initialValues = useSelector(getInitialValuesRequestStore)
    const dispatch = useDispatch()


    // const oneRequest = useSelector(getOneRequestStore)
    const currentRequestNumber = useSelector(getCurrentRequestNumberStore)
    const currentRequest = ( requestModes.createMode && isNewRequest ) ? defaultInitialValues : initialValues
    // : oneRequest


    const onSubmit = ( values: OneRequestType ) => {

        dispatch<any>(changeCurrentRequest({ values }))
        dispatch(requestStoreActions.setIsNewRequest(false))
    }

    const exposeValuesToInitialBuffer = ( { values, valid }: { values: OneRequestType, valid: boolean } ) => {
        console.log(values, valid)
        dispatch(requestStoreActions.setIsNewRequest(false))
        dispatch(requestStoreActions.setInitialValues(values))
    }

    const activeTab = ( tab: string ) => {
        if (tab === 'left') return setTabModes({ ...tabModesInitial, left: true })
        if (tab === 'center') return setTabModes({ ...tabModesInitial, center: true })
        if (tab === 'right') return setTabModes({ ...tabModesInitial, right: true })
    }

    const cancelNavigate = (): To => {
        if (requestModes.statusMode) return routes.searchList
        if (requestModes.historyMode) return routes.historyList
        return -1 as To
    }

    const onCancelButton = () => {
        if (requestModes.createMode) {
            dispatch<any>(deleteCurrentRequestAPI({ requestNumber: +( currentRequest.requestNumber || 0 ) }))
        }
        navigate(cancelNavigate())
        dispatch(requestStoreActions.setCurrentRequestNumber(0))
        dispatch(requestStoreActions.setIsNewRequest(true))
        dispatch(requestStoreActions.setCurrentDistance(null))
    }

    useEffect(() => { // должен сработать ТОЛЬКО один раз

        setTabModes({ ...tabModesInitial, left: true })

        if (requestModes.createMode && isNewRequest) {
            // запрашиваем (и создаём пустую) номер заявки
            dispatch<any>(setNewRequestAPI())
            // обнуляем данные маршрута
            dispatch(requestStoreActions.setCurrentRoute(null))
            // отменяем запрос на новую заявку
            dispatch(requestStoreActions.setIsNewRequest(false))
        }
        if (requestModes.statusMode) {
            dispatch<any>(getOneRequestsAPI(+( reqNumber || 0 )))
        }
    }, [])

    useEffect(() => {
        if (isFirstRender) {
            dispatch(requestStoreActions.setCurrentRequestNumber(+( reqNumber || 0 ) || undefined))
            setIsFirstRender(false)
        }
    }, [ isFirstRender, dispatch, reqNumber, setIsFirstRender ])


    // if (!oneRequest && !requestModes.createMode) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>
    if (currentRequestNumber === 0 && !requestModes.createMode) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>

    const title = `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate) }`

    return (
        <section className={ styles.requestSection }>
            <div className={ styles.requestSection__subWrapper }>

                <div className={ styles.requestSection__wrapper }>

                    <header className={ styles.requestSection__header }>
                        { title }
                    </header>
                    <div
                        className={ !tabModes.center ? styles.requestSection__formsWrapper : styles.requestSection__mapsWrapper }>
                        { tabModes.left && <RequestFormLeft requestModes={ requestModes }
                                                            initialValues={ currentRequest }
                                                            onSubmit={ onSubmit }
                                                            exposeValues={ exposeValuesToInitialBuffer }
                        /> }
                        { tabModes.center && <RequestMapCenter requestModes={ requestModes }/> }
                        { tabModes.right && <RequestFormDocumentsRight requestModes={ requestModes }/> }
                    </div>

                    <CancelButton onCancelClick={ onCancelButton } mode={ 'blueAlert' }/>

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
                    <div className={ styles.requestSection__bottomTabsItem + ' ' +
                        ( tabModes.right && styles.requestSection__bottomTabsItem_active ) }
                         onClick={ () => activeTab('right') }>
                        { 'Документы' }
                    </div>
                </div>
            </div>
        </section>
    )
})
