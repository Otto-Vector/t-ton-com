import React, {useEffect} from 'react'
import styles from './request-section.module.scss'
import {useSelector} from 'react-redux'
import {getContentTableStore} from '../../selectors/table/table-reselect';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {addOneDay, ddMmYearFormat} from '../../utils/parsers';
import {OneRequest} from '../../redux/table/table-store-reducer';


type OwnProps = {
    mode: 'driver' | 'create' | 'status' | 'history'
}

export type RequestModesType = { driverMode: boolean, createMode: boolean, statusMode: boolean, historyMode: boolean }

export const RequestSection: React.FC<OwnProps> = ( { mode } ) => {

    const requestModes: RequestModesType = {
        driverMode: mode === 'driver',
        createMode: mode === 'create',
        statusMode: mode === 'status',
        historyMode: mode === 'history',
    }

    const label = requestModes.driverMode ? 'Статус (для водителя)'
        : requestModes.createMode ? 'Создать'
            : requestModes.historyMode ? 'История' : 'Статус'

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const TABLE_CONTENT = useSelector(getContentTableStore)

    const currentRequest = requestModes.createMode ? {
            requestNumber: 1000,
            cargoType: 'Битумовоз',
            requestDate: new Date(),
            distance: 1120,
            route: 'Ангарск в Чита',
            answers: Math.floor(Math.random() * 99),
            price: Math.floor(Math.random() * 200),
        } as OneRequest
        : TABLE_CONTENT.filter(( { requestNumber } ) => requestNumber === +( reqNumber || 0 ))[0]

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

    useEffect(() => {
    }, [ mode ])

    if (!currentRequest) return <div> ДАННАЯ ЗАЯВКА НЕДОСТУПНА</div>
    const title = `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate) }`


    return (
        <section className={ styles.requestSection }>
            <header className={ styles.requestSection__header }>
                <h3 className={ styles.requestSection__label }>{ label }</h3>
                <h4 className={ styles.requestSection__title }>{ title }</h4>
                <div className={ styles.requestSection__buttonsPanel }>
                    { !requestModes.historyMode ? <>
                        <div className={ styles.requestSection__panelButton }>
                            <Button colorMode={ 'green' }
                                    title={ requestModes.driverMode ? 'Принять заявку' : 'Поиск исполнителя' }
                                    onClick={ () => {
                                        requestModes.driverMode
                                            ? buttonsAction.acceptRequest()
                                            : buttonsAction.submitRequestAndSearch()
                                    } }
                                    disabled={ requestModes.createMode }
                                    rounded/>
                        </div>
                        <div className={ styles.requestSection__panelButton }>
                            <Button colorMode={ requestModes.driverMode ? 'red' : 'blue' }
                                    title={ requestModes.driverMode ? 'Отказаться' : 'Самовывоз' }
                                    onClick={ () => {
                                        requestModes.driverMode
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
            <div className={ styles.requestSection__requestForm }>
                <p>{ `Дата погрузки: ${ ddMmYearFormat(currentRequest.requestDate) }` }</p>
                <p>{ `Расстояние: ${ currentRequest.distance }` }</p>
                <p>{ `Тип груза: ${ currentRequest.cargoType }` }</p>
            </div>
        </section>


    )
}
