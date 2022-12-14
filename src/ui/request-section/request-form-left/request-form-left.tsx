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
    getCurrentDistanceIsFetchingRequestStore,
    getInfoTextModalsRequestValuesStore,
    getLabelRequestStore,
    getPlaceholderRequestStore, getPreparedInfoDataRequestStore,
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
    changeCurrentRequestOnCreate,
    changeSomeValuesOnCurrentRequest,
    getRouteFromAPI,
    requestStoreActions,
} from '../../../redux/forms/request-store-reducer'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer'
import {Preloader} from '../../common/preloader/preloader';
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal';
import {stringArrayToSelectValue} from '../../common/form-selector/selector-utils';
import {FormSpySimple} from '../../common/form-spy-simple/form-spy-simple';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';
import {addRequestCashPay} from '../../../redux/options/requisites-store-reducer';
import {parseFamilyToFIO} from '../../../utils/parsers';
import {setCargoCompositionSelector} from '../../../redux/api/cargo-composition-response-reducer';
import {getCargoCompositionSelectorStore} from '../../../selectors/api/cargo-composition-reselect';


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

    /* данные из стейта заявки для заполнения и обработки полей */
    // заголовки
    const labels = useSelector(getLabelRequestStore)
    // плейсхолдеры
    const placeholders = useSelector(getPlaceholderRequestStore)
    // валидаторы
    const validators = useSelector(getValidatorsRequestStore)
    // данные для вспомогательных вопросительных знаков
    const fieldInformation = useSelector(getInfoTextModalsRequestValuesStore)
    // для отображения данных в режиме статуса/истории
    const infoData = useSelector(getPreparedInfoDataRequestStore)

    // изменяемый селектор состава груза
    const cargoComposition = useSelector(getCargoCompositionSelectorStore)
    // для отображения статуса обработки данных в дистанции
    const currentDistanceIfFetching = useSelector(getCurrentDistanceIsFetchingRequestStore)

    // прогруз грузоотправителя для подсчёта маршрута
    const oneShipper = useSelector(getOneShipperFromLocal)
    const setOneShipper = ( searchId: string | undefined ) => {
        dispatch(shippersStoreActions.setCurrentId(searchId || ''))
    }
    // прогруз грузополучателя для подсчёта маршрута
    const oneConsignee = useSelector(getOneConsigneesFromLocal)
    const setOneConsignee = ( searchId: string | undefined ) => {
        dispatch(consigneesStoreActions.setCurrentId(searchId || ''))
    }

    // преобразователь в строку и placeholder при отсутствии данных
    const textFromStrArrOrPlaceholder = ( str: string[] ) => str.join(', ') || 'Нет данных'

    const shippersSelect = useSelector(getAllShippersSelectFromLocal)
    const consigneesSelect = useSelector(getAllConsigneesSelectFromLocal)
    const customersSelect = shippersSelect

    const onSubmit = async ( oneRequestValues: OneRequestType ) => {
        await dispatch<any>(changeCurrentRequestOnCreate(oneRequestValues))
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
        // груз передан
        cargoHasBeenTransferred: ( values: OneRequestType ) => {
            if (!values.localStatus?.cargoHasBeenTransferred) {
                // меняем одновременно в двух местах, чтобы не переподгружаться
                dispatch(requestStoreActions.setInitialValues({
                    ...values,
                    localStatus: { ...values.localStatus, cargoHasBeenTransferred: true },
                }))
                dispatch<any>(changeSomeValuesOnCurrentRequest({
                    requestNumber: values.requestNumber + '',
                    localStatuscargoHasBeenTransferred: true,
                }))
            }
        },
        // груз получен
        cargoHasBeenReceived: ( values: OneRequestType ) => {
            if (!values.localStatus?.cargoHasBeenReceived) {
                // меняем одновременно в двух местах, чтобы не переподгружаться
                dispatch(requestStoreActions.setInitialValues({
                    ...values,
                    localStatus: { ...values.localStatus, cargoHasBeenReceived: true },
                }))
                dispatch<any>(changeSomeValuesOnCurrentRequest({
                    requestNumber: values.requestNumber + '',
                    localStatuscargoHasBeenReceived: true,
                }))
            }
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
    } ), [ routes ])

    // добавляем позицию в изменяемый селектор
    const onCreateCompositionValue = async ( newCargoCompositionItem: string ) => {
        if (newCargoCompositionItem) {
            await dispatch<any>(setCargoCompositionSelector(newCargoCompositionItem))
        }
    }

    // зачистка & присвоение значений при первом рендере
    useEffect(() => {
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

    // подсчёт маршрута, если выбраны оба селектора грузополучателя и грузоотправителя
    useEffect(() => {
        if (requestModes.createMode && !isFirstRender) {
            if (oneShipper.idSender && oneConsignee.idRecipient) {
                dispatch<any>(
                    getRouteFromAPI({ oneShipper, oneConsignee }))
            }
        }
    }, [ oneShipper, oneConsignee ])

    // присваивается первое значение селектора, если поле пустое
    useEffect(() => {
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
                            {/* ЗАКАЗЧИК */ }
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
                                        { requestModes.acceptDriverMode
                                            ? acceptDriverModePlaceholder
                                            : textFromStrArrOrPlaceholder(infoData.customerData)
                                        }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.customer } mode={ 'inForm' }/>
                            </div>
                            {/* ГРУЗООТПРАВИТЕЛЬ */ }
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
                                        { requestModes.acceptDriverMode
                                            ? acceptDriverModePlaceholder
                                            : textFromStrArrOrPlaceholder(infoData.shipperSenderData) }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.shipper } mode={ 'inForm' }/>
                            </div>
                            {/* ГРУЗОПОЛУЧАТЕЛЬ */ }
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
                                        { requestModes.acceptDriverMode
                                            ? acceptDriverModePlaceholder
                                            : textFromStrArrOrPlaceholder(infoData.cosigneeRecipientData) }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.consignee } mode={ 'inForm' }/>
                            </div>
                            {/* ПЕРЕВОЗЧИК */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.requestCarrierId }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { infoData.acceptedCarrierData.join(', ') || placeholders.requestCarrierId }
                                </div>
                                <InfoButtonToModal textToModal={ fieldInformation.carrier } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idEmployee }</label>
                                <div className={ styles.requestFormLeft__info + ' ' +
                                    styles.requestFormLeft__info_leftAlign }>
                                    { infoData.acceptedEmployeeData.join(', ') || placeholders.idEmployee }
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
                                        <Button
                                            colorMode={ !values.localStatus?.cargoHasBeenTransferred ? 'green' : 'blue' }
                                            type={ hasValidationErrors ? 'submit' : 'button' }
                                            title={ (
                                                ( requestModes.createMode && 'Поиск исполнителя' ) ||
                                                ( requestModes.acceptDriverMode && 'Принять заявку' ) ||
                                                ( requestModes.statusMode && 'Груз у водителя' ) ) + ''
                                            }
                                            onClick={ () => {
                                                if (!hasValidationErrors) {
                                                    requestModes.createMode && buttonsAction.submitRequestAndSearch(values)
                                                    requestModes.acceptDriverMode && buttonsAction.acceptRequest(values)
                                                    requestModes.statusMode && buttonsAction.cargoHasBeenTransferred(values)
                                                }
                                            } }
                                            disabled={ submitting || submitError }
                                            rounded/>
                                    </div>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={
                                            ( requestModes.createMode && 'blue' ) ||
                                            ( requestModes.acceptDriverMode && 'red' ) ||
                                            ( requestModes.statusMode && values.localStatus?.cargoHasBeenReceived ? 'blue' : 'green' )
                                        }
                                                type={ hasValidationErrors ? 'submit' : 'button' }
                                                title={ (
                                                    ( requestModes.createMode && 'Cамовывоз' ) ||
                                                    ( requestModes.acceptDriverMode && 'Отказаться' ) ||
                                                    ( requestModes.statusMode && 'Груз у получателя' ) ) + ''
                                                }
                                                onClick={ () => {
                                                    if (!hasValidationErrors) {
                                                        requestModes.createMode && buttonsAction.submitRequestAndDrive(values)
                                                        requestModes.acceptDriverMode && buttonsAction.cancelRequest()
                                                        requestModes.statusMode && buttonsAction.cargoHasBeenReceived(values)
                                                    }
                                                } }
                                                disabled={ requestModes.statusMode ? !values.localStatus?.cargoHasBeenTransferred : submitting || submitError }
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
