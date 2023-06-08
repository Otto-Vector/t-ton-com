import React, {memo, useCallback, useEffect, useMemo, useState} from 'react'
import styles from './request-form-left.module.scss'
import {getAllShippersSelectFromLocal, getOneShipperFromLocal} from '../../../selectors/options/shippers-reselect'
import {useDispatch, useSelector} from 'react-redux'
import {cargoConstType, OneRequestType, RoleModesType} from '../../../types/form-types'
import {
    getCurrentDistanceIsFetchingRequestStore,
    getInfoTextModalsRequestValuesStore,
    getLabelRequestStore,
    getPlaceholderRequestStore,
    getPreparedInfoDataRequestStore,
    getValidatorsRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {useNavigate} from 'react-router-dom'
import {FormSelector} from '../../common/inputs/final-form-inputs/form-selector/form-selector'
import {RequestModesType} from '../request-section'
import {Field, Form} from 'react-final-form'
import {InfoField} from './info-field'
import {
    getAllConsigneesSelectFromLocal,
    getOneConsigneesFromLocal,
} from '../../../selectors/options/consignees-reselect'
import {InfoText} from '../../common/tiny/info-text/into-text'
import {addNDay, ddMmYearFormat, yearMmDdFormat} from '../../../utils/date-formats'
import {
    cargoHasBeenRecievedOnCurrentRequest,
    changeCurrentRequestOnCreate,
    getRouteFromAPI,
    requestStoreActions,
} from '../../../redux/forms/request-store-reducer'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer'
import {Preloader} from '../../common/tiny/preloader/preloader'
import {InfoButtonToModal} from '../../common/buttons/info-button-to-modal/info-button-to-modal'
import {stringArrayToSelectValue} from '../../common/inputs/final-form-inputs/form-selector/selector-utils'
import {addRequestCashPay} from '../../../redux/options/requisites-store-reducer'
import {setCargoCompositionSelector} from '../../../redux/api/cargo-composition-response-reducer'
import {getCargoCompositionSelectorStore} from '../../../selectors/api/cargo-composition-reselect'
import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {FormSpySimple} from '../../common/inputs/final-form-inputs/form-spy-simple/form-spy-simple'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {getCargoTypeBaseStore} from '../../../selectors/base-reselect'
import {getStoredValuesRequisitesStore} from '../../../selectors/options/requisites-reselect'
import createDecorator from 'final-form-focus'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {CargoWeightInputToModal} from '../cargo-weight-input-to-modal/cargo-weight-input-to-modal'
import truckPNG from '../../../media/trackToRight.png'
import truckLoadFuelPNG from '../../../media/trackLoadFuel.png'
import truckLeftPNG from '../../../media/truckLeft.png'

type OwnProps = {
    requestModes: RequestModesType,
    roleModes: RoleModesType,
    initialValues: OneRequestType,
}


export const RequestFormLeft: React.ComponentType<OwnProps> = memo((
    {
        requestModes: { isHistoryMode, isAcceptDriverMode, isCreateMode, isStatusMode },
        roleModes,
        initialValues,
    } ) => {

    const isAcceptDriverModePlaceholder = 'данные будут доступны после принятия заявки'
    const routes = useSelector(getRoutesStore)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ isFirstRender, setIsFirstRender ] = useState(true)
    // заявка создана данной организацией и находится в статусе "новая заявка"
    const isMyRequestAndNew = roleModes?.isCustomer && initialValues.globalStatus === 'новая заявка'

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
        if (isCreateMode) {
            await dispatch<any>(changeCurrentRequestOnCreate(oneRequestValues))
        }
    }, [ isCreateMode ])

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
                // груз передан (груз у водителя)
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
                    if (!values.localStatus?.cargoHasBeenReceived) {
                        dispatch<any>(textAndActionGlobalModal({
                            title: 'Вопрос',
                            text: [
                                'Вы подтверждаете получение груза?',
                                initialValues.cargoComposition + '',
                                initialValues.cargoWeight + 'тн',
                            ],
                            action: () => {
                                dispatch<any>(cargoHasBeenRecievedOnCurrentRequest(values.requestNumber + ''))
                            },
                        }))
                    }
                },
                submitRequestAndSearch: async ( values: OneRequestType ) => {
                    await onSubmit(values)
                    // оплата за создание заявки
                    dispatch<any>(addRequestCashPay())
                    navigate(routes.searchList)
                },
                // самовывоз при создани заявки
                submitRequestAndDrive: async ( values: OneRequestType ) => {
                    await onSubmit(values)
                    // оплата за создание заявки
                    dispatch<any>(addRequestCashPay())
                    navigate(routes.selfExportDriver + values.requestNumber)
                },
                // самовывоз при повторном просмотре своей заявки
                toSelfExportDriverFromStatusAndAccept: ( values: OneRequestType ) => {
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
            if (isCreateMode) {
                dispatch(shippersStoreActions.setCurrentId(''))
                dispatch(consigneesStoreActions.setCurrentId(''))
            }
            if (isHistoryMode) {
                dispatch(shippersStoreActions.setCurrentId(initialValues.idSender + ''))
                dispatch(consigneesStoreActions.setCurrentId(initialValues.idRecipient + ''))
            }
            setIsFirstRender(false) //первый рендер отработал
        }
    }, [ isFirstRender ])

    // подсчёт маршрута, если выбраны оба селектора грузополучателя и грузоотправителя
    useEffect(() => {
        if (isCreateMode && !isFirstRender) {
            if (oneShipper.idSender && oneConsignee.idRecipient) {
                dispatch<any>(
                    getRouteFromAPI({ oneShipper, oneConsignee }))
            }
        }
    }, [ oneShipper, oneConsignee, isFirstRender ])

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
                    ( { submitError, hasValidationErrors, handleSubmit, form, submitting, values } ) => (
                        <form onSubmit={ handleSubmit } className={ styles.requestFormLeft__form }>
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                {/* ВИД ГРУЗА */ }
                                <div className={ styles.requestFormLeft__selector }>
                                    <label className={ styles.requestFormLeft__label }>
                                        { labels.cargoComposition }</label>
                                    { isCreateMode
                                        ? <FormSelector nameForSelector={ 'cargoComposition' }
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
                                    { isCreateMode
                                        ?
                                        <Field name={ 'shipmentDate' }
                                               component={ FormInputType }
                                               resetFieldBy={ form }
                                               inputType={ 'date' }
                                               value={ yearMmDdFormat(initialValues.shipmentDate || new Date()) }
                                               // для ввода от сегодняшнего дня value обязателен
                                               min={ yearMmDdFormat(new Date()) }
                                               max={ yearMmDdFormat(addNDay(new Date(), 14)) }
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
                                    { isCreateMode
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
                                <label className={ styles.requestFormLeft__label +
                                    ( !isCreateMode && roleModes?.isCustomer ? ' ' + styles.requestFormLeft__label_marked : '' )
                                }>{ labels.idCustomer }</label>
                                { isCreateMode
                                    ? <FormSelector nameForSelector={ 'idCustomer' }
                                                    placeholder={ placeholders.idCustomer }
                                                    options={ customersSelect }
                                                    validate={ validators.idCustomer }
                                                    onDisableHandleClick={ onDisableOptionIdCustomerSelectorHandleClick }
                                                    isClearable
                                    />
                                    : <InfoField
                                        isMarked={ roleModes?.isCustomer }
                                        textData={ !isAcceptDriverMode ? infoData.customerData : undefined }
                                        phoneData={ !isAcceptDriverMode ? infoData.customerPhoneData : undefined }
                                        placeholder={ isAcceptDriverMode ? isAcceptDriverModePlaceholder : placeholders.idCustomer + '' }
                                    />
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.customer } mode={ 'inForm' }/>
                            </div>
                            {/* ГРУЗООТПРАВИТЕЛЬ */ }
                            <div className={ styles.requestFormLeft__selector }>
                                <label className={ styles.requestFormLeft__label +
                                    ( !isCreateMode && roleModes?.isSender ? ' ' + styles.requestFormLeft__label_marked : '' )
                                }>{ labels.idSender }</label>
                                { isCreateMode
                                    ? <FormSelector nameForSelector={ 'idSender' }
                                                    placeholder={ placeholders.idSender }
                                                    options={ shippersSelect }
                                                    validate={ validators.idSender }
                                                    handleChanger={ setOneShipper }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <InfoField
                                        isMarked={ roleModes?.isSender }
                                        textData={ !isAcceptDriverMode ? infoData.shipperSenderData : undefined }
                                        phoneData={ !isAcceptDriverMode ? infoData.shipperSenderPhoneData : undefined }
                                        placeholder={ isAcceptDriverMode ? isAcceptDriverModePlaceholder : placeholders.idSender + '' }
                                    />
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.shipper } mode={ 'inForm' }/>
                            </div>
                            {/* ГРУЗОПОЛУЧАТЕЛЬ */ }
                            <div className={ styles.requestFormLeft__selector }>
                                <label
                                    className={ styles.requestFormLeft__label +
                                        ( !isCreateMode && roleModes?.isRecipient ? ' ' + styles.requestFormLeft__label_marked : '' )
                                    }>{ labels.idRecipient }</label>
                                { isCreateMode
                                    ? <FormSelector nameForSelector={ 'idRecipient' }
                                                    placeholder={ placeholders.idRecipient }
                                                    options={ consigneesSelect }
                                                    validate={ validators.idRecipient }
                                                    handleChanger={ setOneConsignee }
                                                    isSubLabelOnOption
                                                    isClearable
                                    /> : <InfoField
                                        isMarked={ roleModes?.isRecipient }
                                        textData={ !isAcceptDriverMode ? infoData.consigneeRecipientData : undefined }
                                        phoneData={ !isAcceptDriverMode ? infoData.consigneeRecipientPhoneData : undefined }
                                        placeholder={ isAcceptDriverMode ? isAcceptDriverModePlaceholder : placeholders.idRecipient + '' }
                                    />
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.consignee } mode={ 'inForm' }/>
                            </div>
                            {/* ПЕРЕВОЗЧИК */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label +
                                    ( !isCreateMode && roleModes?.isCarrier ? ' ' + styles.requestFormLeft__label_marked : '' )
                                }>{ labels.requestCarrierId }</label>
                                <InfoField
                                    isMarked={ roleModes?.isCarrier }
                                    textData={ !isAcceptDriverMode ? infoData.acceptedCarrierData : undefined }
                                    phoneData={ !isAcceptDriverMode ? infoData.acceptedCarrierPhoneData : undefined }
                                    placeholder={ initialValues.requestCarrierId ? placeholders.requestCarrierId + '' : 'Перевозчик не выбран' }
                                />
                                <InfoButtonToModal textToModal={ fieldInformation.carrier } mode={ 'inForm' }/>
                            </div>
                            {/* ВОДИТЕЛЬ */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.idEmployee }</label>
                                <InfoField
                                    textData={ !isAcceptDriverMode ? infoData.acceptedEmployeeData : undefined }
                                    phoneData={ !isAcceptDriverMode ? infoData.acceptedEmployeePhoneData : undefined }
                                    placeholder={ initialValues.idEmployee ? placeholders.requestCarrierId + '' : 'Водитель не выбран' }
                                />
                                <InfoButtonToModal textToModal={ fieldInformation.driver } mode={ 'inForm' }/>
                            </div>
                            {/* ПРИМЕЧАНИЕ */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.note }</label>
                                { isCreateMode
                                    ? <Field name={ 'note' }
                                             component={ FormInputType }
                                             resetFieldBy={ form }
                                             placeholder={ placeholders.note }
                                             inputType={ 'text' }
                                    />
                                    : <InfoField placeholder={ initialValues.note + '' || 'Примечание отсутствует' }/>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation.note } mode={ 'inForm' }/>
                            </div>
                            {/* ПЛОМБЫ ДЛЯ ГРУЗА */ }
                            <div className={ styles.requestFormLeft__inputsPanel }>
                                <label className={ styles.requestFormLeft__label }>
                                    { labels.cargoStamps }</label>
                                { isCreateMode
                                    ? <Field name={ 'cargoStamps' }
                                             component={ FormInputType }
                                             resetFieldBy={ form }
                                             placeholder={ placeholders.cargoStamps }
                                             inputType={ 'text' }
                                    />
                                    : <InfoField placeholder={ initialValues.cargoStamps + '' || 'Пломбы не внесены' }/>
                                }
                                <InfoButtonToModal textToModal={ fieldInformation?.cargoStamps } mode={ 'inForm' }/>
                            </div>
                            {/*КНОПКИ И НЕ КНОПКИ*/ }
                            <div className={ styles.requestFormLeft__buttonsPanel }
                                 style={ isStatusMode && initialValues.globalStatus !== 'новая заявка' ? {
                                     backgroundImage: `url(${ !values.localStatus?.cargoHasBeenTransferred ? truckPNG
                                         : !values.localStatus?.cargoHasBeenReceived ? truckLoadFuelPNG : truckLeftPNG })`,
                                     backgroundRepeat: 'no-repeat',
                                     backgroundPositionX: !values.localStatus?.cargoHasBeenTransferred ? 'left'
                                         : !values.localStatus?.cargoHasBeenReceived ? 'center' : 'right',
                                 } : undefined }
                            >
                                { !isHistoryMode ? <>
                                    {/* ПОИСК ИСПОЛНИТЕЛЯ | ПРИНЯТЬ ЗАЯВКУ | ГРУЗ У ВОДИТЕЛЯ*/ }
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <ProjectButton
                                            colorMode={ !values.localStatus?.cargoHasBeenTransferred ? 'green' : 'blue' }
                                            type={ hasValidationErrors ? 'submit' : 'button' }
                                            title={ (
                                                ( isCreateMode && 'Поиск исполнителя' ) ||
                                                ( ( isAcceptDriverMode ||
                                                    ( isStatusMode && isMyRequestAndNew )
                                                ) && 'Принять заявку' ) ||
                                                ( isStatusMode && 'Груз у водителя'
                                                    + ( !values.localStatus?.cargoHasBeenTransferred ? '?' : '' ) ) ) + ''
                                            }
                                            onClick={ () => {
                                                if (!hasValidationErrors) {
                                                    if (isCreateMode) {
                                                        buttonsAction.submitRequestAndSearch(values)
                                                    }
                                                    if (isAcceptDriverMode) {
                                                        buttonsAction.acceptRequest(values)
                                                    }
                                                    if (isStatusMode) {
                                                        isMyRequestAndNew
                                                            ? buttonsAction.acceptRequest(values)
                                                            : buttonsAction.cargoHasBeenTransferred(values)
                                                    }
                                                }
                                            } }
                                            disabled={ submitting || submitError }
                                            rounded/>
                                    </div>
                                    {/* САМОВЫВОЗ | ОТКАЗАТЬСЯ | ГРУЗ У ПОЛУЧАТЕЛЯ */ }
                                    <div className={ styles.requestFormLeft__panelButton }>
                                        <ProjectButton colorMode={
                                            ( ( isCreateMode || isMyRequestAndNew ) && 'blue' ) ||
                                            ( isAcceptDriverMode && 'red' ) ||
                                            ( isStatusMode && values.localStatus?.cargoHasBeenReceived ? 'blue' : 'green' )
                                        }
                                                       type={ hasValidationErrors ? 'submit' : 'button' }
                                                       title={ (
                                                    ( ( isCreateMode || isMyRequestAndNew ) && 'Cамовывоз' ) ||
                                                    ( isAcceptDriverMode && 'Отказаться' ) ||
                                                    ( isStatusMode && 'Груз у получателя'
                                                        + ( !values.localStatus?.cargoHasBeenReceived ? '?' : '' ) ) ) + ''
                                                }
                                                       onClick={ () => {
                                                    if (!hasValidationErrors) {
                                                        isCreateMode && buttonsAction.submitRequestAndDrive(values)
                                                        if (isAcceptDriverMode) {
                                                            isMyRequestAndNew
                                                                // САМОВЫВОЗ (при создании заявки)
                                                                ? buttonsAction.toSelfExportDriverFromStatusAndAccept(values)
                                                                // ОТКАЗАТЬСЯ
                                                                : buttonsAction.cancelRequest()
                                                        }
                                                        if (isStatusMode) {
                                                            isMyRequestAndNew
                                                                // САМОВЫВОЗ (при повторном просмотре своей заявки)
                                                                ? buttonsAction.toSelfExportDriverFromStatusAndAccept(values)
                                                                // ГРУЗ У ПОЛУЧАТЕЛЯ
                                                                : buttonsAction.cargoHasBeenReceived(values)
                                                        }
                                                    }
                                                } }
                                                       disabled={ isStatusMode ? ( !isMyRequestAndNew && !values.localStatus?.cargoHasBeenTransferred ) : submitting || submitError }
                                                       rounded/>
                                        { isCreateMode &&
                                            <InfoButtonToModal textToModal={ fieldInformation.selfDeliveryButton }
                                                               mode={ 'outClose' }/>
                                        }
                                    </div>
                                </> : null
                                }
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                            { isCreateMode &&
                                <FormSpySimple form={ form }
                                               onChange={ exposeValues }
                                               isOnActiveChange
                                /> }
                        </form>
                    )
                }/>
            { isCreateMode && <InfoText/> }
        </div>
    )
}, valuesAreEqual)
