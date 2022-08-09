import React, {useEffect, useState} from 'react'
import styles from './request-form-left.module.scss'
import {
    getAllShippersSelectFromLocal,
    getAllShippersStore,
    getOneShipperFromLocal,
} from '../../../selectors/options/shippers-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {cargoConstType, OneRequestType} from '../../../types/form-types'
import {
    getCargoCompositionRequestStore,
    getCurrentDistanceIsFetchingRequestStore,
    getCurrentDistanceRequestStore,
    getInfoTextModalsRequestValuesStore,
    getLabelRequestStore,
    getPlaceholderRequestStore,
    getValidatorsRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector'
import {RequestModesType} from '../request-section'
import {Field, Form} from 'react-final-form'
import {
    getAllConsigneesSelectFromLocal,
    getOneConsigneesFromLocal,
} from '../../../selectors/options/consignees-reselect'
import {Button} from '../../common/button/button'
import {InfoText} from '../../common/info-text/into-text'
import {ddMmYearFormat, yearMmDdFormat} from '../../../utils/date-formats'
import {
    getRouteFromAPI,
    requestStoreActions,
    setCargoCompositionSelector,
} from '../../../redux/forms/request-store-reducer'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer'
import {Preloader} from '../../common/preloader/preloader';
import {FormSpySimpleRequest} from '../../common/form-spy-simple/form-spy-simple';
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal';


type OwnProps = {
    requestModes: RequestModesType,
    initialValues: OneRequestType,
    onSubmit: ( value: OneRequestType ) => void
    exposeValues?: ( { values, valid }: { values: any, valid: boolean } ) => void
}

export const RequestFormLeft: React.FC<OwnProps> = (
    {
        requestModes, initialValues, onSubmit, exposeValues,
    } ) => {

    const routes = useSelector(getRoutesStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ isFirstRender, setIsFirstRender ] = useState(true)

    const cargoComposition = useSelector(getCargoCompositionRequestStore)
    const labels = useSelector(getLabelRequestStore)
    const placehoders = useSelector(getPlaceholderRequestStore)
    const validators = useSelector(getValidatorsRequestStore)
    const fieldInformation = useSelector(getInfoTextModalsRequestValuesStore)
    const currentDistance = useSelector(getCurrentDistanceRequestStore)
    const currentDistanceIfFetching = useSelector(getCurrentDistanceIsFetchingRequestStore)

    const allShippers = useSelector(getAllShippersStore)
    const oneShipper = useSelector(getOneShipperFromLocal)
    const setOneShipper = ( searchId: string | undefined ) => {
        dispatch(shippersStoreActions.setCurrentId(searchId || ''))
    }

    const oneConsignee = useSelector(getOneConsigneesFromLocal)
    const setOneConsignee = ( searchId: string | undefined ) => {
        dispatch(consigneesStoreActions.setCurrentId(searchId || ''))
    }

    const oneCustomer = allShippers.filter(( { idSender } ) => idSender === initialValues.idUserCustomer)[0]
    const oneCarrier = allShippers.filter(( { idSender } ) => idSender === initialValues.idCarrier)[0]


    const shippersSelect = useSelector(getAllShippersSelectFromLocal)
    const customersSelect = shippersSelect// пока присвоил те что есть...
    const consigneesSelect = useSelector(getAllConsigneesSelectFromLocal)

    const buttonsAction = {
        acceptRequest: async ( values: OneRequestType ) => {
            navigate(routes.addDriver + values.requestNumber)
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

    const onCreateCompositionValue = ( newCargoCompositionItem: string ) => {
        dispatch<any>(setCargoCompositionSelector(newCargoCompositionItem))
    }

    useEffect(() => { // зачистка / присвоение значений при первом рендере
        if (isFirstRender) {
            // зачистка значений при первом рендере
            if (requestModes.createMode) {
                dispatch(shippersStoreActions.setCurrentId(''))
                dispatch(consigneesStoreActions.setCurrentId(''))
            }

            if (currentDistance) dispatch(requestStoreActions.setCurrentDistance(0))

            if (requestModes.historyMode) {
                dispatch(shippersStoreActions.setCurrentId(initialValues.idSender + ''))
                dispatch(consigneesStoreActions.setCurrentId(initialValues.idRecipient + ''))
            }
            setIsFirstRender(false) //первый рендер отработал
        }
    }, [isFirstRender])


    useEffect(() => {
        if (requestModes.createMode && !isFirstRender) {
            if (oneShipper.idSender && oneConsignee.idRecipient) {
                dispatch<any>(
                    getRouteFromAPI({
                        from: oneShipper.coordinates as string,
                        to: oneConsignee.coordinates as string,
                    }))
            } else {
                dispatch(requestStoreActions.setCurrentDistance(0))
            }
        }
    }, [ oneShipper, oneConsignee ])


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
                                                        handleCreate={ onCreateCompositionValue }
                                                        isClearable
                                        />
                                        : <div className={ styles.requestFormLeft__info + ' ' +
                                            styles.requestFormLeft__info_leftAlign }>
                                            { initialValues.cargoComposition }
                                        </div>
                                    }
                                    <InfoButtonToModal textToModal={ fieldInformation.cargoComposition }
                                                       mode={ 'inForm' }/>
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel + ' ' +
                                styles.requestFormLeft__inputsPanel_trio }>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.shipmentDate }</label>
                                    { requestModes.createMode
                                        ?
                                        <Field name={ 'shipmentDate' }
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
                                    <InfoButtonToModal textToModal={ fieldInformation.shipmentDate } mode={ 'inForm' }/>
                                </div>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.distance }</label>
                                    <div className={ styles.requestFormLeft__info }>
                                        {
                                            !currentDistanceIfFetching ?
                                                (
                                                    // корявый, но рабочий костыль toDo: cделать по феншую
                                                    ( values.distance = currentDistance || initialValues.distance )
                                                    // currentDistance
                                                    || placehoders.distance
                                                )
                                                : <Preloader/>
                                        }
                                    </div>
                                    <InfoButtonToModal textToModal={ fieldInformation.distance } mode={ 'inForm' }/>
                                </div>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoType }</label>
                                    { requestModes.createMode
                                        ? <FormSelector named={ 'cargoType' }
                                                        placeholder={ labels.cargoType }
                                                        values={ stringArrayToSelectValue([ ...cargoConstType ]) }
                                                        validate={ validators.cargoType }
                                                        isClearable
                                        />
                                        : <div className={ styles.requestFormLeft__info }>
                                            { initialValues.cargoType }
                                        </div>
                                    }
                                    <InfoButtonToModal textToModal={ fieldInformation.cargoType } mode={ 'inForm' }/>
                                </div>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.idUserCustomer }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'customer' }
                                                    placeholder={ placehoders.idUserCustomer }
                                                    values={ customersSelect }
                                                    validate={ validators.idUserCustomer }
                                                    isClearable
                                    />
                                    : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneCustomer?.title + ', ' + oneCustomer?.city }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.customer } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.idSender }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'shipper' }
                                                    placeholder={ placehoders.idSender }
                                                    values={ shippersSelect }
                                                    validate={ validators.idSender }
                                                    handleChanger={ setOneShipper }
                                                    isClearable
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneShipper?.title + ', ' + oneShipper?.city }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.shipper } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.idRecipient }</label>
                                { requestModes.createMode
                                    ? <FormSelector named={ 'consignee' }
                                                    placeholder={ placehoders.idRecipient }
                                                    values={ consigneesSelect }
                                                    validate={ validators.idRecipient }
                                                    handleChanger={ setOneConsignee }
                                                    isClearable
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { oneConsignee?.title + ', ' + oneConsignee?.city }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.consignee } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idCarrier }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { oneCarrier ? ( oneCarrier.title + ', ' + oneCarrier.city ) : placehoders.idCarrier }
                                </div>
                                <InfoButtonToModal textToModal={ fieldInformation.carrier } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idEmployee }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { initialValues.idEmployee || placehoders.idEmployee }
                                </div>
                                <InfoButtonToModal textToModal={ fieldInformation.driver } mode={ 'inForm' }/>
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
                                <InfoButtonToModal textToModal={ fieldInformation.note } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__buttonsPanel }>
                                { !requestModes.historyMode ? <>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={ 'green' }
                                                type={ 'submit' }
                                                title={ requestModes.statusMode ? 'Принять заявку' : 'Поиск исполнителя' }
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
                                                title={ requestModes.statusMode ? 'Отказаться' : 'Cамовывоз' }
                                                onClick={ () => {
                                                    requestModes.statusMode
                                                        ? buttonsAction.cancelRequest()
                                                        : buttonsAction.submitRequestAndDrive(values)
                                                } }
                                                disabled={ hasValidationErrors }
                                                rounded/>
                                        { requestModes.createMode &&
                                            <InfoButtonToModal textToModal={ fieldInformation.selfDeliveryButton }
                                                               mode={ 'outClose' }/>
                                        }
                                    </div>
                                </> : null
                                }
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                            {/*{ ( requestModes.createMode && !isFirstRender ) &&*/}
                            {/*    <FormSpySimpleRequest*/}
                            {/*        form={ form }*/}
                            {/*        onChange={ ( { values, valid } ) => {*/}
                            {/*            if (exposeValues) exposeValues({ values, valid })*/}
                            {/*        } }/>*/}
                            {/*}*/}
                        </form>
                    )
                }/>
            <InfoText/>
        </div>
    )
}
