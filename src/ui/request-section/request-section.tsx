import React, {useEffect} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {useNavigate, useParams} from 'react-router-dom';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {OneRequestType, requestStoreActions} from '../../redux/forms/request-store-reducer';
import {getInitialValuesRequestStore, getOneRequestStore} from '../../selectors/forms/request-form-reselect';
import {ddMmYearFormat} from '../../utils/parsers';
import {CancelButton} from '../common/cancel-button/cancel-button';
import {RequestFormLeft} from './request-form-left/request-form-left';

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

    const initialValues = useSelector(getInitialValuesRequestStore)
    const oneRequest = useSelector(getOneRequestStore)
    const currentRequest = requestModes.createMode ? initialValues : oneRequest || initialValues

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: OneRequestType ) => {
        console.log('данные из заявки: ',values);
    }

    const buttonsAction = {
        acceptRequest: () => {
            navigate(routes.addDriver)
        },
        cancelRequest: () => {
            navigate(-1)
        },
        submitRequestAndSearch: () => {
            navigate(routes.searchList)
        },
        submitRequestAndDrive: () => {
            navigate(routes.myDrivers)
        },
    }

    useEffect(()=>{
        dispatch(requestStoreActions.setRequestNumber(+(reqNumber||0) || undefined))
    })

    if (!oneRequest) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>
    const title = `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate || new Date()) }`
    return (
        <section className={ styles.requestSection }>
            <div className={styles.requestSection__wrapper}>

            <header className={ styles.requestSection__header }>
                {title}
            </header>
                <RequestFormLeft requestModes={requestModes} initialValues={initialValues} onSubmit={onSubmit}/>
                <CancelButton onCancelClick={()=>navigate(-1)} mode={'blueAlert'}/>
            </div>
        </section>


    )
}
