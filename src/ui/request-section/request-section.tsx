import React, {useEffect} from 'react'
import styles from './request-section.module.scss'
import {useDispatch, useSelector} from 'react-redux'

import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {requestStoreActions} from '../../redux/forms/request-store-reducer';

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

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()


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
    return (
        <section className={ styles.requestSection }>
            <header className={ styles.requestSection__header }>

                <div className={ styles.requestSection__buttonsPanel }>
                    { !requestModes.historyMode ? <>
                        <div className={ styles.requestSection__panelButton }>
                            <Button colorMode={ 'green' }
                                    title={ requestModes.statusMode ? 'Принять заявку' : 'Поиск исполнителя' }
                                    onClick={ () => {
                                        requestModes.statusMode
                                            ? buttonsAction.acceptRequest()
                                            : buttonsAction.submitRequestAndSearch()
                                    } }
                                    disabled={ requestModes.createMode }
                                    rounded/>
                        </div>
                        <div className={ styles.requestSection__panelButton }>
                            <Button colorMode={ requestModes.statusMode ? 'red' : 'blue' }
                                    title={ requestModes.statusMode ? 'Отказаться' : 'Cамовывоз' }
                                    onClick={ () => {
                                        requestModes.statusMode
                                            ? buttonsAction.cancelRequest()
                                            : buttonsAction.submitRequestAndDrive()
                                    } }
                                    disabled={ requestModes.createMode }
                                    rounded/>
                        </div>
                    </> : null
                    }
                </div>
            </header>

        </section>


    )
}
