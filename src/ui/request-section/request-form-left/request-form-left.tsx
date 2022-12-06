import React, {memo, useEffect, useMemo, useState} from 'react'
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
    getInfoTextModalsRequestValuesStore,
    getLabelRequestStore,
    getPlaceholderRequestStore,
    getValidatorsRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {FormSelector} from '../../common/form-selector/form-selector'
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
    changeCurrentRequest,
    getRouteFromAPI,
    requestStoreActions,
    setCargoCompositionSelector,
} from '../../../redux/forms/request-store-reducer'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer'
import {Preloader} from '../../common/preloader/preloader';
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal';
import {stringArrayToSelectValue} from '../../common/form-selector/selector-utils';
import {FormSpySimple} from '../../common/form-spy-simple/form-spy-simple';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';
import {addRequestCashPay} from '../../../redux/options/requisites-store-reducer';


type OwnProps = {
    requestModes: RequestModesType,
    initialValues: OneRequestType,
}

export const RequestFormLeft: React.FC<OwnProps> = memo((
    {
        requestModes, initialValues,
    } ) => {

    const acceptDriverModePlaceholder = 'данные будут доступны после принятия заявки'
    const routes = useSelector(getRoutesStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ isFirstRender, setIsFirstRender ] = useState(true)

    const cargoComposition = useSelector(getCargoCompositionRequestStore)
    const labels = useSelector(getLabelRequestStore)
    const placeholders = useSelector(getPlaceholderRequestStore)
    const validators = useSelector(getValidatorsRequestStore)
    const fieldInformation = useSelector(getInfoTextModalsRequestValuesStore)

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

    const oneCustomer = allShippers.find(( { idSender } ) => idSender === initialValues.idCustomer)
    const oneCarrier = allShippers.find(( { idSender } ) => idSender === initialValues.requestCarrierId)

    const shippersSelect = useSelector(getAllShippersSelectFromLocal)
    const consigneesSelect = useSelector(getAllConsigneesSelectFromLocal)
    const customersSelect = shippersSelect

    const onSubmit = async ( values: OneRequestType ) => {
        await dispatch<any>(changeCurrentRequest({ ...values, globalStatus: 'новая заявка' }))
    }

    // для сохранения отображаемых данных при переключении вкладок
    const exposeValues = ( values: OneRequestType ) => {
        dispatch(requestStoreActions.setInitialValues(values))
    }

    const buttonsAction = useMemo(() => ( {
        acceptRequest: async ( values: OneRequestType ) => {
            // оплата за принятие заявки в работу
            // dispatch<any>(+( values.distance || 0 ) <= 100 ? acceptShorRoutePay() : acceptLongRoutePay())
            navigate(routes.addDriver + values.requestNumber)
        },
        cancelRequest: () => {
            navigate(-1)
        },
        submitRequestAndSearch: async ( values: OneRequestType ) => {
            await onSubmit(values)
            // оплата за создание заявки
            dispatch<any>(addRequestCashPay())
            navigate(routes.searchList)
        },
        submitRequestAndDrive: async ( values: OneRequestType ) => {
            await onSubmit(values)
            // оплата за создание заявки
            dispatch<any>(addRequestCashPay())
            navigate(routes.selfExportDriver + values.requestNumber)
        },
    } ), [])

    const onCreateCompositionValue = ( newCargoCompositionItem: string ) => {
        dispatch<any>(setCargoCompositionSelector(newCargoCompositionItem))
    }

    useEffect(() => { // зачистка & присвоение значений при первом рендере
        if (isFirstRender) {
            // зачистка значений при первом рендере
            if (requestModes.createMode) {
                dispatch(shippersStoreActions.setCurrentId(''))
                dispatch(consigneesStoreActions.setCurrentId(''))
            }

            if (requestModes.historyMode) {
                dispatch(shippersStoreActions.setCurrentId(initialValues.idSender + ''))
                dispatch(consigneesStoreActions.setCurrentId(initialValues.idRecipient + ''))
            }
            setIsFirstRender(false) //первый рендер отработал
        }
    }, [ isFirstRender ])


    useEffect(() => {
        if (requestModes.createMode && !isFirstRender) {
            if (oneShipper.idSender && oneConsignee.idRecipient) {
                dispatch<any>(
                    getRouteFromAPI({ oneShipper, oneConsignee }))
            }
        }
    }, [ oneShipper, oneConsignee ])

    useEffect(() => { // присваивается первое значение селектора, если поле пустое
        if (!initialValues.idCustomer) {
            dispatch(requestStoreActions.setInitialValues({
                ...initialValues,
                idCustomer: customersSelect.length > 0 ? customersSelect[0].value : undefined,
            }))
        }
    }, [ customersSelect ])


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
                                        ? <FormSelector nameForSelector={ 'cargoComposition' }
                                                        placeholder={ placeholders.cargoComposition }
                                                        values={ stringArrayToSelectValue(cargoComposition) }
                                                        validate={ validators.cargoComposition }
                                                        isCreatableSelect
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
                                               min={ yearMmDdFormat(new Date()) }// для ввода от сегодняшнего дня value обязателен
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
                                            !currentDistanceIfFetching
                                                ? ( values.distance || placeholders.distance )
                                                : <Preloader/>
                                        }
                                    </div>
                                    <InfoButtonToModal textToModal={ fieldInformation.distance } mode={ 'inForm' }/>
                                </div>
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoType }</label>
                                    { requestModes.createMode
                                        ? <FormSelector nameForSelector={ 'cargoType' }
                                                        placeholder={ labels.cargoType }
                                                        values={ stringArrayToSelectValue([ ...cargoConstType.filter(x => x !== 'Тягач') ]) }
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
                                    className={ styles.requestFormLeft__label }>{ labels.idCustomer }</label>
                                { requestModes.createMode
                                    ? <FormSelector nameForSelector={ 'idCustomer' }
                                                    placeholder={ placeholders.idCustomer }
                                                    values={ customersSelect }
                                                    validate={ validators.idCustomer }
                                                    isClearable
                                    />
                                    : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { requestModes.acceptDriverMode ? acceptDriverModePlaceholder : oneCustomer?.title }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.customer } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.idSender }</label>
                                { requestModes.createMode
                                    ? <FormSelector nameForSelector={ 'idSender' }
                                                    placeholder={ placeholders.idSender }
                                                    values={ shippersSelect }
                                                    validate={ validators.idSender }
                                                    handleChanger={ setOneShipper }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { requestModes.acceptDriverMode ? acceptDriverModePlaceholder
                                            : `${ oneShipper?.title + ', ' + oneShipper?.city }` }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.shipper } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label }>{ labels.idRecipient }</label>
                                { requestModes.createMode
                                    ? <FormSelector nameForSelector={ 'idRecipient' }
                                                    placeholder={ placeholders.idRecipient }
                                                    values={ consigneesSelect }
                                                    validate={ validators.idRecipient }
                                                    handleChanger={ setOneConsignee }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { requestModes.acceptDriverMode ? acceptDriverModePlaceholder
                                            : `${ oneConsignee?.title + ', ' + oneConsignee?.city }` }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.consignee } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.requestCarrierId }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { oneCarrier ? ( oneCarrier.title + ', ' + oneCarrier.city ) : placeholders.requestCarrierId }
                                </div>
                                <InfoButtonToModal textToModal={ fieldInformation.carrier } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idEmployee }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { initialValues.idEmployee || placeholders.idEmployee }
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
                                             placeholder={ placeholders.note }
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
                                                type={ hasValidationErrors ? 'submit' : 'button' }
                                                title={ requestModes.acceptDriverMode ? 'Принять заявку' : 'Поиск исполнителя' }
                                                onClick={ () => {
                                                    !hasValidationErrors &&
                                                    ( requestModes.acceptDriverMode
                                                            ? buttonsAction.acceptRequest(values)
                                                            : buttonsAction.submitRequestAndSearch(values)
                                                    )
                                                } }
                                                disabled={ submitting || submitError }
                                                rounded/>
                                    </div>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={ requestModes.acceptDriverMode ? 'red' : 'blue' }
                                                type={ hasValidationErrors ? 'submit' : 'button' }
                                                title={ requestModes.acceptDriverMode ? 'Отказаться' : 'Cамовывоз' }
                                                onClick={ () => {
                                                    !hasValidationErrors &&
                                                    ( requestModes.acceptDriverMode
                                                            ? buttonsAction.cancelRequest()
                                                            : buttonsAction.submitRequestAndDrive(values)
                                                    )
                                                } }
                                                disabled={ submitting || submitError }
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
                            { requestModes.createMode &&
                                <FormSpySimple form={ form }
                                               onChange={ exposeValues }
                                               isOnActiveChange
                                /> }
                        </form>
                    )
                }/>
            { requestModes.createMode && <InfoText/> }
        </div>
    )
}, valuesAreEqual)
