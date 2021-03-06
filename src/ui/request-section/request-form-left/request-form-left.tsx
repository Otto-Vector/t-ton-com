import React, {useEffect} from 'react'
import styles from './request-form-left.module.scss'
import {getAllShippersStore} from '../../../selectors/options/shippers-reselect';
import {useDispatch, useSelector} from 'react-redux';
import {cargoConstType, OneRequestType} from '../../../types/form-types';
import {
    getCargoCompositionRequestStore,
    getLabelRequestStore,
    getPlaceholderRequestStore,
    getValidatorsRequestStore,
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
import {ddMmYearFormat, yearMmDdFormat} from '../../../utils/date-formats';
import {setCargoCompositionSelector} from '../../../redux/forms/request-store-reducer';

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
    const dispatch = useDispatch()
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
    const shippers = customers // ???????? ???????????????? ???? ?????? ????????...
    const allConsignees = useSelector(getAllConsigneesStore)
    const oneConsignee = allConsignees.filter(( { id } ) => id === initialValues.consignee)[0]
    const consignees = allConsignees
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title?.toString() || '' } ))


    const buttonsAction = {
        acceptRequest: async (values: OneRequestType) => {

            navigate(routes.addDriver+values.requestNumber)
        },
        cancelRequest: () => {
            navigate(-1)
        },
        submitRequestAndSearch: async ( values: OneRequestType ) => {
            await onSubmit(values)
            navigate(routes.searchList)
        },
        submitRequestAndDrive: async ( values: OneRequestType ) => {
            await onSubmit(values)
            navigate(routes.addDriver)
        },
    }

    const onCreateCompositionValue = (value: string) => {
        dispatch<any>(setCargoCompositionSelector([value, ...cargoComposition]))
    }


    useEffect(() => {
    }, [ initialValues ])


    return (
        <div className={ styles.requestFormLeft }>
            <Form
                onSubmit={ onSubmit }
                initialValues={ initialValues }
                render={
                    ( { submitError, hasValidationErrors, handleSubmit, pristine, form, submitting, values } ) => (
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
                                                        creatableSelect
                                                        handleCreate={onCreateCompositionValue}
                                                        isClearable
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
                                                 min={ yearMmDdFormat(new Date()) } // ?????? ?????????? ???? ???????????????????????? ?????? value ????????????????????
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
                                                        values={ stringArrayToSelectValue(cargoConstType.map(x => x)) }
                                                        validate={ validators.cargoType }
                                                        isClearable
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
                                                    isClearable
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
                                                    isClearable
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
                                                    isClearable
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
                                                title={ requestModes.statusMode ? '?????????????? ????????????' : '?????????? ??????????????????????' }
                                                onClick={ () => {
                                                    requestModes.statusMode
                                                        ? buttonsAction.acceptRequest(values)
                                                        : buttonsAction.submitRequestAndSearch(values)
                                                } }
                                                disabled={ hasValidationErrors }
                                                rounded/>
                                    </div>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={ requestModes.statusMode ? 'red' : 'blue' }
                                                type={ 'submit' }
                                                title={ requestModes.statusMode ? '????????????????????' : 'C????????????????' }
                                                onClick={ () => {
                                                    requestModes.statusMode
                                                        ? buttonsAction.cancelRequest()
                                                        : buttonsAction.submitRequestAndDrive(values)
                                                } }
                                                disabled={ hasValidationErrors }
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
