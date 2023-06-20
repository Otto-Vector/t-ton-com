import React, {ChangeEvent, useState} from 'react'
import styles from './request-form-documents-right.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {
    getInfoTextModalsRequestValuesStore,
    getInitialValuesRequestStore,
    getLabelDocumentsRequestValuesStore,
    getLabelRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {RequestModesType} from '../request-section'

import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {InfoText} from '../../common/tiny/info-text/into-text'
import {hhmmDdMmYyFormat, timeDiff} from '../../../utils/date-formats'
import {InfoButtonToModal} from '../../common/buttons/info-button-to-modal/info-button-to-modal'
import {DownloadSampleFileWrapper} from '../../common/buttons/download-sample-file-wrapper/download-sample-file-wrapper'
import {ButtonMenuSaveLoad} from '../../common/buttons/button-menu-save-load/button-menu-save-load'
import {
    addRewriteCargoDocumentRequestAPI,
    addRewriteUPDDocumentRequestAPI,
    closeRequestAndUpdateDriverStatus,
    paymentHasBeenRecievedToRequest,
} from '../../../redux/request-form/request-store-reducer'
import {parseToNormalMoney, toNumber} from '../../../utils/parsers'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {boldWrapper} from '../../../utils/html-rebuilds'
import {RoleModesType} from '../../../types/form-types'
import {getInitialValuesEmployeesStore} from '../../../selectors/options/employees-reselect'
import {getRoutesStore} from '../../../selectors/routes-reselect'

type OwnProps = {
    requestModes: RequestModesType,
    roleModes: RoleModesType,
}


export const RequestFormDocumentsRight: React.ComponentType<OwnProps> = (
    {
        requestModes: { isHistoryMode, isAcceptDriverMode, isCreateMode },
        roleModes,
    } ) => {

    const labelsDocumentsTab = useSelector(getLabelDocumentsRequestValuesStore)
    const labelsRequestHead = useSelector(getLabelRequestStore)
    const initialValuesRequest = useSelector(getInitialValuesRequestStore)
    const oneEmployee = useSelector(getInitialValuesEmployeesStore)
    const requestNumber = initialValuesRequest.requestNumber
    const routes = useSelector(getRoutesStore)

    /* весы груза */
    const transportCargoWeight = toNumber(initialValuesRequest?.responseTransport?.cargoWeight)
    const tralerCagoWeigth = toNumber(initialValuesRequest?.responseTrailer?.cargoWeight)
    const driverCanCargoWeight = transportCargoWeight + tralerCagoWeigth

    const initialValuesDocuments = initialValuesRequest.documents
    const modalsText = useSelector(getInfoTextModalsRequestValuesStore)
    const dispatch = useDispatch()
    const price = parseToNormalMoney(
        toNumber(initialValuesRequest?.localStatus?.cargoHasBeenTransferred
            ? initialValuesRequest?.addedPrice : initialValuesRequest?.responsePrice),
    )

    const buttonsAction = {
        acceptRequest: () => {
        },
        // получили деньги?
        paymentHasBeenReceived: () => {
            dispatch<any>(textAndActionGlobalModal({
                text: `Вы подтверждаете получение денежных средств ${
                    boldWrapper(parseToNormalMoney(toNumber(initialValuesRequest.addedPrice)) + ' руб.')
                } за выполненную заявку?`,
                action: () => {
                    dispatch<any>(paymentHasBeenRecievedToRequest(initialValuesRequest.requestNumber))
                },
            }))
        },
        // отправка доп. документов
        sendUploadDocument: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) {
                dispatch<any>(addRewriteCargoDocumentRequestAPI({
                    requestNumber,
                    cargoDocuments: event.target.files[0],
                }))
            }
        },
        sendTtnECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
        },
        sendContractECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
        },
        sendUpdECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) {
                dispatch<any>(addRewriteUPDDocumentRequestAPI({ requestNumber, document: event.target.files[0] }))
            }
        },
        sendCustomerToConsigneeECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
        },

        // закрываем заявку
        closeRequest: () => {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Вопрос',
                text: 'Вы всё проверили и готовы закрыть заявку?',
                action: () => {
                    dispatch<any>(closeRequestAndUpdateDriverStatus({
                        requestNumber: initialValuesRequest.requestNumber + '',
                        idEmployee: oneEmployee.idEmployee,
                        employeeOnNextRequest: oneEmployee.onNextRequest + '',
                        employeeAddedToResponse: oneEmployee.addedToResponse + '',
                    }))
                },
                navigateOnOk: routes.historyList,
            }))
        },
    }
    // блокировка кнопок загрузки данных
    const disabledButtonOnMode = isAcceptDriverMode || isCreateMode
    // какую инфу показывать модуле "Время погрузки"
    const [ uploadMode, setUploadMode ] = useState<'Время погрузки' | 'Время разгрузки' | 'Время в пути'>(initialValuesRequest?.localStatus?.cargoHasBeenReceived ? 'Время разгрузки' : 'Время погрузки')
    // микро-всплывашка над "Вес груза" & "Цена по заявке'
    const tnKmTitle = 'тн.км.: ' + initialValuesRequest.responseStavka + 'руб. / ' + initialValuesRequest.distance + 'км'
    // что писать над весом груза
    const cargoWeightLabel = initialValuesRequest?.localStatus?.cargoHasBeenTransferred ? labelsRequestHead.cargoWeight : 'Вес ДО погрузки'
    // что именно отображается в грузе
    const cargoWeightInfo = initialValuesRequest?.localStatus?.cargoHasBeenTransferred ? initialValuesRequest.cargoWeight : driverCanCargoWeight
    // логика разрешающая закрытие заявки (пока может закрыть только заказчик)
    const isRequestReadyToClose = roleModes.isCustomer && initialValuesRequest?.localStatus?.paymentHasBeenReceived
    // проверка завершена ли заявка
    const isRequestClosed = initialValuesRequest.globalStatus === 'завершена'

    return (
        <div className={ styles.requestFormDocumentRight }>
            {/*////////Транспортные документы Сторон//////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labelsDocumentsTab.proxyWay.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel + ' '
                    + styles.requestFormDocumentRight__documentsPanel_top }>
                    {/* Доверенность грузовладельцу */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValuesDocuments.proxyWay?.proxyFreightLoader }>
                            <ProjectButton
                                colorMode={ !initialValuesDocuments.proxyWay?.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labelsDocumentsTab.proxyWay?.proxyFreightLoader }
                                disabled={ !initialValuesDocuments.proxyWay?.proxyFreightLoader }
                                wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                    {/* Доверенность на водителя */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValuesDocuments.proxyWay?.proxyDriver }>
                            <ProjectButton
                                colorMode={ !initialValuesDocuments.proxyWay?.proxyDriver ? 'grayAlert' : 'blue' }
                                title={ labelsDocumentsTab.proxyWay?.proxyDriver?.toString() }
                                disabled={ !initialValuesDocuments.proxyWay?.proxyDriver }
                                wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__documentsPanel + ' '
                    + styles.requestFormDocumentRight__documentsPanel_top }>
                    {/* Путевой лист водителя */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValuesDocuments.proxyWay?.waybillDriver }>
                            <ProjectButton
                                colorMode={ !initialValuesDocuments.proxyWay?.waybillDriver ? 'grayAlert' : 'blue' }
                                title={ labelsDocumentsTab.proxyWay?.waybillDriver?.toString() }
                                disabled={ !initialValuesDocuments.proxyWay?.waybillDriver }
                                wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                    {/* Маршрутный лист водителя */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValuesDocuments.proxyWay?.itineraryList }>
                            <ProjectButton
                                colorMode={ !initialValuesDocuments.proxyWay?.itineraryList ? 'grayAlert' : 'blue' }
                                title={ labelsDocumentsTab.proxyWay?.itineraryList?.toString() }
                                disabled={ !initialValuesDocuments.proxyWay?.itineraryList }
                                wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА////////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }
                 title={ tnKmTitle }
            >
                {/* Вес груза */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { cargoWeightLabel }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { cargoWeightInfo }
                    </div>
                </div>
                {/* Цена по заявке */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { initialValuesRequest?.localStatus?.cargoHasBeenTransferred ? labelsRequestHead.responsePrice : 'Цена ДО погрузки' }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { price }
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                {/* Время погрузки // (изменяется при клике левой кнопкой мыши) */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }
                     style={ {
                         cursor: initialValuesRequest?.unloadTime ? 'pointer' : 'auto',
                         // для InfoButtonToModal
                         position: 'relative',
                     } }
                     onClick={ () => {
                         initialValuesRequest?.unloadTime &&
                         setUploadMode(( prevState ) =>
                             prevState === 'Время погрузки' ? 'Время разгрузки' :
                                 prevState === 'Время разгрузки' ? 'Время в пути' : 'Время погрузки',
                         )
                     } }
                >
                    <InfoButtonToModal textToModal={ modalsText.uploadTime } mode={ 'inForm' }/>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { uploadMode }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { uploadMode === 'Время погрузки' ? hhmmDdMmYyFormat(initialValuesRequest?.uploadTime as Date) || '-'
                            : uploadMode === 'Время разгрузки' ? hhmmDdMmYyFormat(initialValuesRequest?.unloadTime as Date) || '-'
                                : timeDiff(initialValuesRequest?.uploadTime as Date, initialValuesRequest?.unloadTime as Date)
                        }
                    </div>
                </div>
                {/* Документы груза */ }
                <div
                    className={ styles.requestFormDocumentRight__inputsItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { ( labelsDocumentsTab.cargoDocuments + '' ).split('+')[0] }</label>
                    <ButtonMenuSaveLoad
                        title={ ( labelsDocumentsTab.cargoDocuments + '' ).split('+').reverse()[0] }
                        loadUrl={ initialValuesDocuments.cargoDocuments }
                        onUpload={ isHistoryMode ? undefined : buttonsAction.sendUploadDocument }
                        disabled={ disabledButtonOnMode }
                    />
                </div>
            </div>
            {/*--<->--*/ }
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*/////////ТТН или ЭТрН с ЭЦП////////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labelsDocumentsTab.ttnECP.header }</label>
                <InfoButtonToModal textToModal={ modalsText.ttnECP } mode={ 'inForm' }/>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.ttnECP?.customerIsSubscribe }
                            colorMode={ !initialValuesDocuments.ttnECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.ttnECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendTtnECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.ttnECP?.carrierIsSubscribe }
                            colorMode={ !initialValuesDocuments.ttnECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.ttnECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendTtnECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ГРУЗОПОЛУЧАТЕЛЬ */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.ttnECP?.consigneeIsSubscribe }
                            colorMode={ !initialValuesDocuments.ttnECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.ttnECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendTtnECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                </div>
            </div>
            {/*/////////Договор оказания транспортных услуг с ЭЦП//////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <InfoButtonToModal textToModal={ modalsText.contractECP } mode={ 'inForm' }/>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labelsDocumentsTab.contractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.contractECP?.customerIsSubscribe }
                            colorMode={ !initialValuesDocuments.contractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.contractECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendContractECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.contractECP?.carrierIsSubscribe }
                            colorMode={ !initialValuesDocuments.contractECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.contractECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendContractECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                </div>
            </div>
            {/*/////////УПД от Перевозчика для Заказчика//////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <InfoButtonToModal textToModal={ modalsText.updECP } mode={ 'inForm' }/>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labelsDocumentsTab.updECP.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.updECP?.customerIsSubscribe }
                            colorMode={ !initialValuesDocuments.updECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.updECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendUpdECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.updECP?.carrierIsSubscribe }
                            colorMode={ !initialValuesDocuments.updECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.updECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendUpdECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                </div>
            </div>
            {/*//////Документы от Заказчика для Получателя/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <InfoButtonToModal textToModal={ modalsText.customerToConsigneeContractECP } mode={ 'inForm' }/>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labelsDocumentsTab.customerToConsigneeContractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.customerToConsigneeContractECP?.customerIsSubscribe }
                            colorMode={ !initialValuesDocuments.customerToConsigneeContractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.customerToConsigneeContractECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendCustomerToConsigneeECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.customerToConsigneeContractECP?.consigneeIsSubscribe }
                            colorMode={ !initialValuesDocuments.customerToConsigneeContractECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.customerToConsigneeContractECP?.documentDownload }
                            onUpload={ isHistoryMode ? undefined : buttonsAction.sendCustomerToConsigneeECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*///////////////////ПАНЕЛЬ КНОПОК/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__buttonsPanel }>
                { !isHistoryMode && <>
                    <div className={ styles.requestFormDocumentRight__panelButton }>
                        <ProjectButton
                            colorMode={ initialValuesRequest?.localStatus?.paymentHasBeenReceived ? 'green' : 'blue' }
                            title={ labelsRequestHead.localStatus?.paymentHasBeenReceived +
                                ( !initialValuesRequest?.localStatus?.paymentHasBeenReceived ? '?' : '' ) }
                            wordWrap
                            rounded
                            onClick={ buttonsAction.paymentHasBeenReceived }
                            disabled={ !initialValuesRequest?.localStatus?.cargoHasBeenReceived }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__panelButton }>
                        <ProjectButton colorMode={ isRequestReadyToClose ? 'blue' : isRequestClosed ? 'red' : 'gray' }
                                       wordWrap
                                       rounded
                                       title={ labelsRequestHead.localStatus?.cargoHasBeenReceived }
                                       disabled={ !isRequestReadyToClose || isRequestClosed }
                                       onClick={ () => {
                                           buttonsAction.closeRequest()
                                       } }
                        />
                    </div>
                </>
                }
            </div>
            { !isHistoryMode && <InfoText/> }
        </div>
    )
}
