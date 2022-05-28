import React, {useEffect} from 'react'
import styles from './tab-data-request.module.scss'
import {getAllShippersStore} from '../../../selectors/options/shippers-reselect';
import {useSelector} from 'react-redux';
import {cargoTypeType} from '../../../types/form-types';
import {
    getCargoСompositionRequestStore, getInitialValuesRequestStore,
    getLabelRequestStore, getOneRequestStore,
    getPlaceholderRequestStore,
} from '../../../selectors/forms/request-form-reselect';
import {FormInputType} from '../../common/form-input-type/form-input-type';
import {OneRequestType} from '../../../redux/forms/request-store-reducer';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {getConsigneesOptionsStore} from '../../../selectors/options/options-reselect';
import {ddMmYearFormat} from '../../../utils/parsers';
import {useNavigate} from 'react-router-dom';
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector';
import {RequestModesType} from '../request-section';
import {Field, Form} from 'react-final-form'
import {getAllConsigneesStore} from '../../../selectors/options/consignees-reselect';

type OwnProps = {
    requestModes: RequestModesType,
}


export const TabDataRequest: React.FC<OwnProps> = ( { requestModes } ) => {

    const routes = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const cargoComposition = useSelector(getCargoСompositionRequestStore)
    const initialValues = useSelector(getInitialValuesRequestStore)
    const oneRequest = useSelector(getOneRequestStore)
    const labels = useSelector(getLabelRequestStore)
    const placehoders = useSelector(getPlaceholderRequestStore)

    const customers = useSelector(getAllShippersStore)
        .map(( { id, title } ) => ( { key: id?.toString(), value: id.toString(), label: title?.toString() || '' } ))
    const shippers = customers // пока присвоил те что есть...
    const consignees = useSelector(getAllConsigneesStore)
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title?.toString() || '' } ))


    const currentRequest = requestModes.createMode ? initialValues : oneRequest || initialValues

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

    if (!oneRequest) return <div><br/><br/> ДАННАЯ ЗАЯВКА НЕДОСТУПНА ! </div>
    const title = !oneRequest ? 'ДАННАЯ ЗАЯВКА НЕДОСТУПНА !'
        : `Заявка №${ currentRequest.requestNumber } от ${ ddMmYearFormat(currentRequest.requestDate || new Date()) }`

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
                                                      values={ stringArrayToSelectValue(cargoTypeType.map(x => x)) }/>
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
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { initialValues.carrier || placehoders.carrier }
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


    )
}
