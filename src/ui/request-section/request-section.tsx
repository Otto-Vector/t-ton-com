import React, {useEffect, useState} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {To, useNavigate, useParams} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {requestStoreActions} from '../../redux/forms/request-store-reducer';
import {getInitialValuesRequestStore, getOneRequestStore} from '../../selectors/forms/request-form-reselect';
import {CancelButton} from '../common/cancel-button/cancel-button';
import {RequestFormDocumentsRight} from './request-form-documents-right/request-form-documents-right';
import {RequestMapCenter} from './request-map-center/request-map-center';
import {RequestFormLeft} from './request-form-left/request-form-left';
import {OneRequestType} from '../../types/form-types';
import {ddMmYearFormat} from '../../utils/date-formats';

type OwnProps = {
    mode: 'create' | 'status' | 'history'
}

export type RequestModesType = { createMode: boolean, statusMode: boolean, historyMode: boolean }

export const RequestSection: React.FC<OwnProps> = ( { mode } ) => {

    const requestModes: RequestModesType = {
        createMode: mode === 'create',
        statusMode: mode === 'status',
        historyMode: mode === 'history',
    }

    const tabModesInitial = { left: false, center: false, right: false }

    const [ tabModes, setTabModes ] = useState({ ...tabModesInitial, left: true })


    const initialValues = useSelector(getInitialValuesRequestStore)
    const oneRequest = useSelector(getOneRequestStore)
    const currentRequest = requestModes.createMode ? initialValues : oneRequest || initialValues

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: OneRequestType ) => {
        console.log('данные из заявки: ', values);
    }

    const activeTab = (tab: string) =>{
        if (tab==='left') return setTabModes({...tabModesInitial, left: true})
        if (tab==='center') return setTabModes({...tabModesInitial, center: true})
        if (tab==='right') return setTabModes({...tabModesInitial, right: true})
    }

    const cancelNavigate = (): To => {
        if (requestModes.statusMode) return routes.searchList
        if (requestModes.historyMode) return routes.historyList
        return -1 as To
    }
    const onCancelButton = () => {
        navigate(cancelNavigate())
    }

    useEffect(() => {
        setTabModes({...tabModesInitial, left: true})
    },[navigate])

    useEffect(() => {
        dispatch(requestStoreActions.setRequestNumber(+( reqNumber || 0 ) || undefined))
    },[])

    if (!oneRequest) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>
    const title = `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate || new Date()) }`
    return (
        <section className={ styles.requestSection }>
            <div className={ styles.requestSection__subWrapper }>

                <div className={ styles.requestSection__wrapper }>

                    <header className={ styles.requestSection__header }>
                        { title }
                    </header>
                    <div className={!tabModes.center ? styles.requestSection__formsWrapper : styles.requestSection__mapsWrapper}>
                    { tabModes.left && <RequestFormLeft requestModes={ requestModes } initialValues={ currentRequest }
                                                         onSubmit={ onSubmit }/> }
                    { tabModes.center && <RequestMapCenter requestModes={requestModes}/> }
                    { tabModes.right && <RequestFormDocumentsRight requestModes={requestModes} /> }
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
}
