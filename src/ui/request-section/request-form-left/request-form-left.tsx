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
    getCargoCompositionRequestStore, getCurrentDistanceIsFetchingRequestStore, getCurrentDistanceRequestStore,
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
    getRouteFromAPI, requestStoreActions,
    setCargoCompositionSelector,
} from '../../../redux/forms/request-store-reducer'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer'
import {Preloader} from '../../common/preloader/preloader';
import { FormSpySimpleRequest} from '../../common/form-spy-simple/form-spy-simple';


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
    const currentDistance = useSelector(getCurrentDistanceRequestStore)
    const currentDistanceIfFetching = useSelector(getCurrentDistanceIsFetchingRequestStore)

    const allShippers = useSelector(getAllShippersStore)
    const oneShipper = useSelector(getOneShipperFromLocal)
    const setOneShipper = ( searchId: string | undefined ) => {
        dispatch(shippersStoreActions.setCurrentId(+( searchId || 0 )))
    }

    const oneConsignee = useSelector(getOneConsigneesFromLocal)
    const setOneConsignee = ( searchId: string | undefined ) => {
        dispatch(consigneesStoreActions.setCurrentId(+( searchId || 0 )))
    }

    const oneCustomer = allShippers.filter(( { id } ) => id === initialValues.customer)[0]
    const oneCarrier = allShippers.filter(( { id } ) => id === initialValues.carrier)[0]


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

    const onCreateCompositionValue = ( value: string ) => {
        dispatch<any>(setCargoCompositionSelector([ value, ...cargoComposition ]))
    }

    useEffect(() => { // зачистка значений при первом рендере
        if (requestModes.createMode) {
            dispatch(shippersStoreActions.setCurrentId(0))
            dispatch(consigneesStoreActions.setCurrentId(0))
        }
        if (currentDistance) dispatch(requestStoreActions.setCurrentDistance(0))
        setIsFirstRender(false) //первый рендер отработал
    }, [])

    useEffect(() => { // зачистка / присвоение значений при первом рендере
        if (requestModes.historyMode) {
            dispatch(shippersStoreActions.setCurrentId(initialValues.shipper || 0))
            dispatch(consigneesStoreActions.setCurrentId(initialValues.consignee || 0))
        }
    }, [])


    useEffect(() => {
        if (requestModes.createMode && !isFirstRender) {
            if (oneShipper.id && oneConsignee.id) {
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
                // validateOnBlur
                // keepDirtyOnReinitialize
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
                                                    || placehoders.distance
                                                )
                                                : <Preloader/>
                                        }
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
                                                    values={ customersSelect }
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
                                                    values={ shippersSelect }
                                                    validate={ validators.shipper }
                                                    handleChanger={ setOneShipper }
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
                                                    values={ consigneesSelect }
                                                    validate={ validators.consignee }
                                                    handleChanger={ setOneConsignee }
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
                                    </div>
                                </> : null
                                }
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                            { ( requestModes.createMode && !isFirstRender ) && <FormSpySimpleRequest
                                form={ form }
                                onChange={ ( { values, valid } ) => {
                                    if (exposeValues) exposeValues({ values, valid })
                                } }/>
                            }
                        </form>
                    )
                }/>
            <InfoText/>
        </div>


    )
}
