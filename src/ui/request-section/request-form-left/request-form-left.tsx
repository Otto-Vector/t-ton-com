import React, {memo, useCallback, useEffect, useMemo, useState} from 'react'
import styles from './request-form-left.module.scss'
import {getAllShippersSelectFromLocal, getOneShipperFromLocal} from '../../../selectors/options/shippers-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {cargoConstType, OneRequestType} from '../../../types/form-types'
import {
    getCurrentDistanceIsFetchingRequestStore,
    getInfoTextModalsRequestValuesStore,
    getLabelRequestStore,
    getPlaceholderRequestStore,
    getPreparedInfoDataRequestStore,
    getValidatorsRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {FormSelector} from '../../common/form-selector/form-selector'
import {RequestModesType} from '../request-section'
import {Field, Form} from 'react-final-form'
import {InfoField} from './info-field'
import {
    getAllConsigneesSelectFromLocal,
    getOneConsigneesFromLocal,
} from '../../../selectors/options/consignees-reselect'
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
import {Preloader} from '../../common/preloader/preloader'
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal'
import {stringArrayToSelectValue} from '../../common/form-selector/selector-utils'
import {
    acceptLongRoutePay,
    acceptShorRoutePay,
    addRequestCashPay,
} from '../../../redux/options/requisites-store-reducer'
import {setCargoCompositionSelector} from '../../../redux/api/cargo-composition-response-reducer'
import {getCargoCompositionSelectorStore} from '../../../selectors/api/cargo-composition-reselect'
import {Button} from '../../common/button/button'
import {FormSpySimple} from '../../common/form-spy-simple/form-spy-simple'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {getCargoTypeBaseStore} from '../../../selectors/base-reselect'
import {getAuthIdAuthStore} from '../../../selectors/auth-reselect'
import {getStoredValuesRequisitesStore} from '../../../selectors/options/requisites-reselect'
import createDecorator from 'final-form-focus'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {CargoWeightInputToModal} from '../cargo-weight-input-to-modal/cargo-weight-input-to-modal'


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
    // заявка создана данной организацией и находится в статусе "новая заявка"
    const isMyRequestAndNew = ( initialValues.idUserCustomer === useSelector(getAuthIdAuthStore) ) && initialValues.globalStatus === 'новая заявка'

    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])

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
    // типы груза
    const cargoTypes = useSelector(getCargoTypeBaseStore) as typeof cargoConstType
    // изменяемый селектор состава груза
    const cargoComposition = useSelector(getCargoCompositionSelectorStore)
    // для отображения статуса обработки данных в дистанции
    const currentDistanceIfFetching = useSelector(getCurrentDistanceIsFetchingRequestStore)

    const { innNumber } = useSelector(getStoredValuesRequisitesStore)

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

    const shippersSelect = useSelector(getAllShippersSelectFromLocal)
    const consigneesSelect = useSelector(getAllConsigneesSelectFromLocal)
    // заказчик не должен быть левым, иначе капут докам
    const customersSelect = shippersSelect.map(( { extendInfo, ...props } ) => ( {
        ...props,
        isDisabled: extendInfo !== innNumber,
    } ))

    const onSubmit = useCallback(async ( oneRequestValues: OneRequestType ) => {
        if (requestModes.createMode) {
            await dispatch<any>(changeCurrentRequestOnCreate(oneRequestValues))
        }
    }, [ requestModes.createMode ])

    // для сохранения отображаемых данных при переключении вкладок
    const exposeValues = ( values: OneRequestType ) => {
        dispatch(requestStoreActions.setInitialValues(values))
    }


    const buttonsAction =
        useMemo(() => (
            {
                acceptRequest: ( values: OneRequestType ) => {
                    navigate(routes.addDriver + values.requestNumber)
                },
                cancelRequest: () => {
                    navigate(-1)
                },
                // груз передан
                cargoHasBeenTransferred: ( values: OneRequestType ) => {
                    if (!values.localStatus?.cargoHasBeenTransferred) {
                        dispatch<any>(textAndActionGlobalModal({
                            title: 'Вопрос',
                            reactChildren: <CargoWeightInputToModal/>,
                            isFooterVisible: false,
                        }))
                    }
                },
                // груз получен
                cargoHasBeenReceived: ( values: OneRequestType ) => {
                    console.log('груз получен')
                    if (!values.localStatus?.cargoHasBeenReceived) {
                        // меняем одновременно в двух местах, чтобы не переподгружаться
                        // dispatch(requestStoreActions.setInitialValues({
                        //     ...values,
                        //     localStatus: { ...values.localStatus, cargoHasBeenReceived: true },
                        // }))
                        // dispatch<any>(changeSomeValuesOnCurrentRequest({
                        //     requestNumber: values.requestNumber + '',
                        //     localStatuscargoHasBeenReceived: true,
                        // }))
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
                toSelfExportDriver: async ( values: OneRequestType ) => {
                    navigate(routes.selfExportDriver + values.requestNumber)
                },
                toSelfExportDriverFromStatus: async ( values: OneRequestType ) => {
                    navigate(routes.selfExportDriverFromStatus + values.requestNumber)
                },
            }
        ), [ routes, dispatch, navigate, onSubmit ])

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
                // выставляется первый по списку допустимый вариант
                idCustomer: customersSelect?.find(( { isDisabled } ) => !isDisabled)?.value,
            }))
        }
    }, [ customersSelect ])

    // при клике на выбор отключенного элемента селектора Заказчика
    const onDisableOptionIdCustomerSelectorHandleClick = () => {
        dispatch<any>(textAndActionGlobalModal({
            text: `Нельзя добавить, данный элемент НЕ соответствует ИНН заказчика: <b>${ innNumber }</b>`,
        }))
    }

    return (
        <div className={ styles.requestFormLeft }>
            <Form
                onSubmit={ onSubmit }
                initialValues={ initialValues }
                //@ts-ignore-next-line
                decorators={ [ focusOnError ] }
                render={
                    ( { submitError, hasValidationErrors, handleSubmit, pristine, form, submitting, values } ) => (
                        <form onSubmit={ handleSubmit } className={ styles.requestFormLeft__form }>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                {/* ВИД ГРУЗА */ }
                                <div className={ styles.requestFormLeft__selector }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoComposition }</label>
                                    { requestModes.createMode
                                        ? <FormSelector nameForSelector={ 'cargoComposition' }
                                            // placeholder={ placeholders.cargoComposition }
                                                        options={ stringArrayToSelectValue(cargoComposition) }
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
                            {/* ДАТА ПОГРУЗКИ */ }
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
                                {/* РАССТОЯНИЕ, ДИСТАНЦИЯ */ }
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
                                {/* ТИП ГРУЗА */ }
                                <div className={ styles.requestFormLeft__inputsItem }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoType }</label>
                                    { requestModes.createMode
                                        ? <FormSelector nameForSelector={ 'cargoType' }
                                                        placeholder={ labels.cargoType }
                                                        options={ stringArrayToSelectValue([ ...cargoTypes.filter(x => x !== 'Тягач') ]) }
                                                        validate={ validators.cargoType }
                                            // isClearable
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
                                                    options={ customersSelect }
                                                    validate={ validators.idCustomer }
                                                    onDisableHandleClick={ onDisableOptionIdCustomerSelectorHandleClick }
                                                    isClearable
                                    />
                                    : <InfoField textData={ infoData.customerData }
                                                 phoneData={ infoData.customerPhoneData }
                                                 placeholder={ requestModes.acceptDriverMode ? acceptDriverModePlaceholder : placeholders.idCustomer + '' }
                                    />
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
                                                    options={ shippersSelect }
                                                    validate={ validators.idSender }
                                                    handleChanger={ setOneShipper }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <InfoField textData={ infoData.shipperSenderData }
                                                    phoneData={ infoData.shipperSenderPhoneData }
                                                    placeholder={ requestModes.acceptDriverMode ? acceptDriverModePlaceholder : placeholders.idSender + '' }
                                    />
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
                                                    options={ consigneesSelect }
                                                    validate={ validators.idRecipient }
                                                    handleChanger={ setOneConsignee }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <InfoField textData={ infoData.consigneeRecipientData }
                                                    phoneData={ infoData.consigneeRecipientPhoneData }
                                                    placeholder={ requestModes.acceptDriverMode ? acceptDriverModePlaceholder : placeholders.idRecipient + '' }
                                    />
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.consignee } mode={ 'inForm' }/>
                            </div>
                            {/* ПЕРЕВОЗЧИК */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.requestCarrierId }</label>
                                <InfoField textData={ infoData.acceptedCarrierData }
                                           phoneData={ infoData.acceptedCarrierPhoneData }
                                           placeholder={ !infoData.acceptedCarrierData.join(', ') ? placeholders.requestCarrierId + '' : 'Перевозчик не выбран' }
                                />
                                <InfoButtonToModal textToModal={ fieldInformation.carrier } mode={ 'inForm' }/>
                            </div>
                            {/* ВОДИТЕЛЬ */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idEmployee }</label>
                                <InfoField textData={ infoData.acceptedEmployeeData }
                                           phoneData={ infoData.acceptedEmployeePhoneData }
                                           placeholder={ !infoData.acceptedEmployeeData.join(', ') ? placeholders.idEmployee + '' : 'Водитель не выбран' }
                                />
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
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.cargoStamps }</label>
                                { requestModes.createMode
                                    ? <Field name={ 'cargoStamps' }
                                             component={ FormInputType }
                                             resetFieldBy={ form }
                                             placeholder={ placeholders.cargoStamps }
                                             inputType={ 'text' }
                                    /> : <div className={ styles.requestFormLeft__info + ' ' +
                                        styles.requestFormLeft__info_leftAlign }>
                                        { initialValues.cargoStamps }
                                    </div>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation?.cargoStamps } mode={ 'inForm' }/>
                            </div>
                            <div className={ styles.requestFormLeft__buttonsPanel }>
                                { !requestModes.historyMode ? <>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button
                                            colorMode={ !values.localStatus?.cargoHasBeenTransferred ? 'green' : 'blue' }
                                            type={ hasValidationErrors ? 'submit' : 'button' }
                                            title={ (
                                                ( requestModes.createMode && 'Поиск исполнителя' ) ||
                                                ( ( requestModes.acceptDriverMode ||
                                                    ( requestModes.statusMode && isMyRequestAndNew )
                                                ) && 'Принять заявку' ) ||
                                                ( requestModes.statusMode && 'Груз у водителя' ) ) + ''
                                            }
                                            onClick={ () => {
                                                if (!hasValidationErrors) {
                                                    if (requestModes.createMode) {
                                                        buttonsAction.submitRequestAndSearch(values)
                                                    }
                                                    if (requestModes.acceptDriverMode) {
                                                        buttonsAction.acceptRequest(values)
                                                    }
                                                    if (requestModes.statusMode) {
                                                        isMyRequestAndNew
                                                            ? buttonsAction.acceptRequest(values)
                                                            : buttonsAction.cargoHasBeenTransferred(values)
                                                    }

                                                }
                                            } }
                                            disabled={ submitting || submitError }
                                            rounded/>
                                    </div>
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <Button colorMode={
                                            ( ( requestModes.createMode || isMyRequestAndNew ) && 'blue' ) ||
                                            ( requestModes.acceptDriverMode && 'red' ) ||
                                            ( requestModes.statusMode && values.localStatus?.cargoHasBeenReceived ? 'blue' : 'green' )
                                        }
                                                type={ hasValidationErrors ? 'submit' : 'button' }
                                                title={ (
                                                    ( ( requestModes.createMode || isMyRequestAndNew ) && 'Cамовывоз' ) ||
                                                    ( requestModes.acceptDriverMode && 'Отказаться' ) ||
                                                    ( requestModes.statusMode && 'Груз у получателя' ) ) + ''
                                                }
                                                onClick={ () => {
                                                    if (!hasValidationErrors) {
                                                        requestModes.createMode && buttonsAction.submitRequestAndDrive(values)
                                                        if (requestModes.acceptDriverMode) {
                                                            isMyRequestAndNew
                                                                ? buttonsAction.toSelfExportDriver(values)
                                                                : buttonsAction.cancelRequest()
                                                        }
                                                        if (requestModes.statusMode) {
                                                            isMyRequestAndNew
                                                                ? buttonsAction.toSelfExportDriverFromStatus(values)
                                                                : buttonsAction.cargoHasBeenReceived(values)
                                                        }
                                                    }
                                                } }
                                                disabled={ requestModes.statusMode ? ( !isMyRequestAndNew && !values.localStatus?.cargoHasBeenTransferred ) : submitting || submitError }
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
