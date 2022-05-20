import React, {useEffect} from 'react'
import styles from './request-section.module.scss'
import {useSelector} from 'react-redux'
import {getContentTableStore} from '../../selectors/table/table-reselect';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {addOneDay, ddMmYearFormat} from '../../utils/parsers';


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
        }
        : TABLE_CONTENT.filter(( { requestNumber } ) => requestNumber === +( reqNumber || 0 ))[0]

    const buttonsAction = {
        acceptRequest: () => {
            navigate(routes.requestInfo.driver)
        },
        cancelRequest: () => {
            navigate(-1)
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
                    <div className={ styles.requestSection__panelButton }>
                        <Button colorMode={ 'green' }
                                onClick={ () => {
                                    buttonsAction.acceptRequest()
                                } }
                                rounded>{ 'Принять заявку' }</Button>
                    </div>
                    <div className={ styles.requestSection__panelButton }>
                        <Button colorMode={ 'red' }
                                onClick={ () => {
                                    buttonsAction.cancelRequest()
                                } }
                                rounded>{ 'Отказаться' }</Button>
                    </div>
                </div>
            </header>
            <div className={ styles.requestSection__requestForm }>
                <p>{ `Дата погрузки: ${ currentRequest.requestDate }` }</p>
                <p>{ `Расстояние: ${ currentRequest.distance }` }</p>
                <p>{ `Тип груза: ${ currentRequest.cargoType }` }</p>
            </div>
        </section>


    )
}
