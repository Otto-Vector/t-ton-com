import React, {useEffect} from 'react'
import styles from './request-section.module.scss'
import {useSelector} from 'react-redux'
import {getContentTableStore} from '../../selectors/table/table-reselect';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '../common/button/button';
import {getRoutesStore} from '../../selectors/routes-reselect';
import {ddMmYearFormat} from '../../utils/parsers';
import {Form, Field} from 'react-final-form'
import {
    getCargoСompositionRequestStore,
    getInitialValuesRequestStore, getLabelRequestStore, getPlaceholderRequestStore,
} from '../../selectors/forms/request-form-reselect';
import {FormSelector, stringArrayToSelectValue} from '../common/form-selector/form-selector';
import {OneRequestType} from '../../redux/forms/request-store-reducer';
import {FormInputType} from '../common/form-input-type/form-input-type';
import {cargoType} from '../../types/form-types';
import {getAllShippersStore} from '../../selectors/options/shippers-reselect';
import requestMap from '../../media/request-map.jpg'
import {getConsigneesOptionsStore} from '../../selectors/options/options-reselect';

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

    const labelTitle = requestModes.driverMode ? 'Статус (для водителя)'
        : requestModes.createMode ? 'Создать'
            : requestModes.historyMode ? 'История' : 'Статус'

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()


    const cargoComposition = useSelector(getCargoСompositionRequestStore)
    const initialValues = useSelector(getInitialValuesRequestStore)
    const labels = useSelector(getLabelRequestStore)
    const placehoders = useSelector(getPlaceholderRequestStore)
    const customers = useSelector(getAllShippersStore)
        .map(( { id, title } ) => ( { key: id?.toString(), value: id.toString(), label: title?.toString() || '' } ))
    const shippers = customers // пока присвоил те что есть...
    const consignees = useSelector(getConsigneesOptionsStore).content
        .map(( { id, title })=> ({key: id.toString(), value: title, label: title}))
    const TABLE_CONTENT = useSelector(getContentTableStore)

    const currentRequest = requestModes.createMode ? initialValues
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

    const onSubmit = ( values: OneRequestType ) => {
    }

    useEffect(() => {
    }, [ initialValues ])

    if (!currentRequest) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>
    const title = `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate) }`

    return (
        <section className={ styles.requestSection }>
            <header className={ styles.requestSection__header }>
                <h3 className={ styles.requestSection__label }>{ labelTitle }</h3>
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
                                    title={ requestModes.driverMode ? 'Отказаться' : 'Cамовывоз' }
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
                <div className={ styles.requestForm__top }>
                    <div className={ styles.requestFormLeft }>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { submitError, handleSubmit, pristine, form, submitting, values } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.requestFormLeft__form }>
                                        <div className={ styles.requestFormLeft__inputsPanel }>
                                            <div className={ styles.requestFormLeft__selector }>
                                                <label className={ styles.requestFormLeft__label }>
                                                    { labels.cargoComposition }</label>
                                                <FormSelector named={ 'cargoComposition' }
                                                              placeholder={ placehoders.cargoComposition }
                                                              values={ stringArrayToSelectValue(cargoComposition) }/>
                                            </div>
                                            <div className={ styles.requestFormLeft__inputsPanel + ' ' +
                                                styles.requestFormLeft__inputsPanel_trio }>
                                                <div className={ styles.requestFormLeft__inputsItem }>
                                                    <label className={ styles.requestFormLeft__label }>
                                                        { labels.shipmentDate }</label>
                                                    <Field name={ 'shipmentDate' }
                                                           component={ FormInputType }
                                                           resetFieldBy={ form }
                                                           inputType={ 'date' }
                                                    />
                                                </div>
                                                    <div className={ styles.requestFormLeft__inputsItem }>
                                                        <label className={ styles.requestFormLeft__label }>
                                                            { labels.distance }</label>
                                                        <div className={ styles.requestFormLeft__info }>
                                                            { initialValues.distance || placehoders.distance }
                                                        </div>
                                                    </div>
                                                    <div className={ styles.requestFormLeft__inputsItem }>
                                                        <label className={ styles.requestFormLeft__label }>
                                                            { labels.cargoType }</label>
                                                        <FormSelector named={ 'cargoType' }
                                                                      placeholder={ labels.cargoType }
                                                                      values={ stringArrayToSelectValue(cargoType.map(x => x)) }/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={ styles.requestFormLeft__selector }>
                                                <label
                                                    className={ styles.requestFormLeft__label }>{ labels.customer }</label>
                                                <FormSelector named={ 'customer' }
                                                              placeholder={ placehoders.customer }
                                                              values={ customers }/>
                                            </div>
                                            <div className={ styles.requestFormLeft__selector }>
                                                <label
                                                    className={ styles.requestFormLeft__label }>{ labels.shipper }</label>
                                                <FormSelector named={ 'shipper' }
                                                              placeholder={ placehoders.shipper }
                                                              values={ shippers }/>
                                            </div>
                                            <div className={ styles.requestFormLeft__selector }>
                                                <label
                                                    className={ styles.requestFormLeft__label }>{ labels.consignee }</label>
                                                <FormSelector named={ 'consignee' }
                                                              placeholder={ placehoders.consignee }
                                                              values={ consignees }/>
                                            </div>
                                            <div className={ styles.requestFormLeft__inputsPanel }>
                                                <label className={ styles.requestFormLeft__label }>
                                                    { labels.carrier }</label>
                                                <div className={ styles.requestFormLeft__info+ ' ' +
                                                styles.requestFormLeft__info_leftAlign}>
                                                    { initialValues.carrier || placehoders.carrier }
                                                </div>
                                            </div>
                                            <div className={ styles.requestFormLeft__inputsPanel }>
                                                <label className={ styles.requestFormLeft__label }>
                                                    { labels.driver }</label>
                                                <div className={ styles.requestFormLeft__info+ ' ' +
                                                styles.requestFormLeft__info_leftAlign}>
                                                    { initialValues.driver || placehoders.driver }
                                                </div>
                                            </div>
                                            <div className={ styles.requestFormLeft__inputsPanel }>
                                                <label className={ styles.requestFormLeft__label }>
                                                    { labels.note }</label>
                                                <Field name={ 'note' }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }

                                                       placeholder={ placehoders.note }
                                                       inputType={ 'text' }
                                                />
                                            </div>

                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/ }
                                    </form>
                                )
                            }/>
                    </div>
                    <div className={styles.requestForm__map}>
                        <label className={styles.requestFormLeft__label}>{'Местоположение и маршрут'}</label>
                        <img src={requestMap} alt={'Карта маршрута'} title={"Карта маршрута"}/>
                    </div>
                </div>
                <div className={ styles.requestForm__middle }>

                </div>
                <div className={ styles.requestForm__bottom }>

                </div>
            </div>
        </section>


    )
}
