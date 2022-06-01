import React, {useEffect} from 'react'
import styles from './request-form-left.module.scss'
import {getAllShippersStore} from '../../../selectors/options/shippers-reselect';
import {useSelector} from 'react-redux';
import {cargoTypeType, OneRequestType} from '../../../types/form-types';
import {
    getCargoCompositionRequestStore,
    getLabelRequestStore,
    getPlaceholderRequestStore, getValidatorsRequestStore,
} from '../../../selectors/forms/request-form-reselect';
import {FormInputType} from '../../common/form-input-type/form-input-type';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {useNavigate} from 'react-router-dom';
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector';
import {RequestModesType} from '../request-section';
import {Field, Form} from 'react-final-form'
import {getAllConsigneesStore} from '../../../selectors/options/consignees-reselect';
import {Button} from '../../common/button/button';
import {InfoText} from '../../common/info-text/into-text';
import {ddMmYearFormat, yearMmDdFormat} from '../../../utils/parsers';

type OwnProps = {
    requestModes: RequestModesType,
    initialValues: OneRequestType,
    onSubmit: ( value: OneRequestType ) => void
}


export const RequestFormLeft: React.FC<OwnProps> = (
    {
        requestModes, initialValues, onSubmit,
    } ) => {

    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const cargoComposition = useSelector(getCargoCompositionRequestStore)
    const labels = useSelector(getLabelRequestStore)
    const placehoders = useSelector(getPlaceholderRequestStore)
    const validators = useSelector(getValidatorsRequestStore)

    const allCustomers = useSelector(getAllShippersStore)
    const oneCustomer = allCustomers.filter(( { id } ) => id === initialValues.customer)[0]
    const oneShipper = allCustomers.filter(( { id } ) => id === initialValues.shipper)[0]
    const oneCarrier = allCustomers.filter(( { id } ) => id === initialValues.carrier)[0]
    const customers = allCustomers
        .map(( { id, title } ) => ( { key: id?.toString(), value: id.toString(), label: title?.toString() || '' } ))
    const shippers = customers // пока присвоил те что есть...
    const allConsignees = useSelector(getAllConsigneesStore)
    const oneConsignee = allConsignees.filter(( { id } ) => id === initialValues.consignee)[0]
    const consignees = allConsignees
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title?.toString() || '' } ))


    const buttonsAction = {
        acceptRequest: () => {
            navigate(routes.addDriver)
        },
        cancelRequest: () => {
            navigate(-1)
        },
        submitRequestAndSearch: () => {
            // navigate(routes.searchList)
        },
        submitRequestAndDrive: () => {
            navigate(routes.addDriver)
        },
    }

    useEffect(() => {
    }, [ initialValues ])


    return (
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
                                    { requestModes.createMode
                                        ? <FormSelector named={ 'cargoComposition' }
                                                        placeholder={ placehoders.cargoComposition }
                                                        values={ stringArrayToSelectValue(cargoComposition) }
                                                        validate={ validators.cargoComposition }
                                        />
                                        : <div className={ styles.requestFormLeft__info + ' ' +
                                            styles.requestFormLeft__info_leftAlign }>
                                            { initialValues.cargoComposition }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel + ' ' +
                                styles.requestFormLeft__inputsPanel_trio }>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.shipmentDate }</label>
                                    { requestModes.createMode
                                        ? <Field name={ 'shipmentDate' }
                                                 component={ FormInputType }
                                                 resetFieldBy={ form }
                                                 inputType={ 'date' }
                                                 value={ yearMmDdFormat(initialValues.shipmentDate || new Date()) }
                                                 min={ yearMmDdFormat(new Date()) } // для ввода от сегодняшнего дня value обязателен
                                                 validate={ validators.shipmentDate }
                                                 errorBottom
                                        />
                                        : <div className={ styles.requestFormLeft__info }>
                                            { ddMmYearFormat(initialValues.shipmentDate) }
                                        </div>
                                    }
                                </div>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.distance }</label>
                                    <div className={ styles.requestFormLeft__info }>
                                        { ( initialValues.distance || placehoders.distance ) }
                                    </div>
                                </div>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoType }</label>
                                    { requestModes.createMode
                                        ? <FormSelector named={ 'cargoType' }
                                                        placeholder={ labels.cargoType }
                                                        values={ stringArrayToSelectValue(cargoTypeType.map(x => x)) }
                                                        validate={ validators.cargoType }
                                        />
                                        : <div className={ styles.requestFormLeft__info }>
                                            { initialValues.cargoType }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.customer }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'customer' }
                                                    placeholder={ placehoders.customer }
                                                    values={ customers }
                                                    validate={ validators.customer }
                                    />
                                    : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneCustomer?.title + ', ' + oneCustomer?.city }
                                    </div>
                                }
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.shipper }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'shipper' }
                                                    placeholder={ placehoders.shipper }
                                                    values={ shippers }
                                                    validate={ validators.shipper }
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneShipper?.title + ', ' + oneShipper?.city }
                                    </div>
                                }
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.consignee }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'consignee' }
                                                    placeholder={ placehoders.consignee }
                                                    values={ consignees }
                                                    validate={ validators.consignee }
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneConsignee?.title + ', ' + oneConsignee?.city }
                                    </div>
                                }
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.carrier }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { oneCarrier ? ( oneCarrier.title + ', ' + oneCarrier.city ) : placehoders.carrier }
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.driver }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { initialValues.driver || placehoders.driver }
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.note }</label>
                                { requestModes.createMode
                                    ? <Field name={ 'note' }
                                             component={ FormInputType }
                                             resetFieldBy={ form }
                                             placeholder={ placehoders.note }
                                             inputType={ 'text' }
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { initialValues.note }
                                    </div>
                                }
                            </div>
                            <div className={ styles.requestFormLeft__buttonsPanel }>
                                { !requestModes.historyMode ? <>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={ 'green' }
                                                type={ 'submit' }
                                                title={ requestModes.statusMode ? 'Принять заявку' : 'Поиск исполнителя' }
                                                onClick={ () => {
                                                    requestModes.statusMode
                                                        ? buttonsAction.acceptRequest()
                                                        : buttonsAction.submitRequestAndSearch()
                                                } }
                                                disabled={ requestModes.createMode }
                                                rounded/>
                                    </div>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={ requestModes.statusMode ? 'red' : 'blue' }
                                                type={ 'submit' }
                                                title={ requestModes.statusMode ? 'Отказаться' : 'Cамовывоз' }
                                                onClick={ () => {
                                                    requestModes.statusMode
                                                        ? buttonsAction.cancelRequest()
                                                        : buttonsAction.submitRequestAndDrive()
                                                } }
                                            // disabled={ requestModes.createMode }
                                                rounded/>
                                    </div>
                                </> : null
                                }
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                        </form>
                    )
                }/>
            <InfoText/>
        </div>


    )
}
