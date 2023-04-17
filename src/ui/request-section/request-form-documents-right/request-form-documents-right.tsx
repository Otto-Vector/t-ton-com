import React, {ChangeEvent, useEffect} from 'react'
import styles from './request-form-documents-right.module.scss'
import {useDispatch, useSelector} from 'react-redux'
import {
    getInfoTextModalsRequestValuesStore,
    getInitialValuesRequestStore,
    getLabelDocumentsRequestValuesStore,
    getLabelRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {RequestModesType} from '../request-section'

import {Button} from '../../common/button/button'
import {InfoText} from '../../common/info-text/into-text'
import {hhMmDdMmFormat, hhmmDdMmYyFormat} from '../../../utils/date-formats'
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal'
import {DownloadSampleFileWrapper} from '../../common/download-sample-file/download-sample-file-wrapper'
import {ButtonMenuSaveLoad} from '../../common/button-menu-save-load/button-menu-save-load'
import {addRewriteCargoDocumentRequestAPI} from '../../../redux/forms/request-store-reducer'
import {parseToNormalMoney} from '../../../utils/parsers'

type OwnProps = {
    requestModes: RequestModesType,
}


export const RequestFormDocumentsRight: React.FC<OwnProps> = (
    {
        requestModes,
    } ) => {

    const labelsDocumentsTab = useSelector(getLabelDocumentsRequestValuesStore)
    const labelsRequestHead = useSelector(getLabelRequestStore)
    // const initialValuesDocuments = useSelector(getInitialDocumentsRequestValuesStore)
    const initialValuesRequest = useSelector(getInitialValuesRequestStore)
    const requestNumber = initialValuesRequest.requestNumber
    const initialValuesDocuments = initialValuesRequest.documents
    const modalsText = useSelector(getInfoTextModalsRequestValuesStore)
    const dispatch = useDispatch()
    const price = parseToNormalMoney(+( initialValuesRequest?.addedPrice || 0 ) || +( initialValuesRequest?.responsePrice || 0 ))
    const buttonsAction = {
        acceptRequest: () => {
        },
        sendUploadDocument: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) {
                const cargoDocuments = event.target.files[0]
                console.log(cargoDocuments.name)
                dispatch<any>(addRewriteCargoDocumentRequestAPI({ requestNumber, cargoDocuments }))
            }
        },
        sendTtnECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendContractECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendUpdECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendCustomerToConsigneeECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
    }
    // блокировка кнопок загрузки данных
    const disabledButtonOnMode = requestModes.acceptDriverMode || requestModes.createMode

    useEffect(() => {
    }, [ initialValuesDocuments ])


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
                            <Button
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
                            <Button colorMode={ !initialValuesDocuments.proxyWay?.proxyDriver ? 'grayAlert' : 'blue' }
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
                            <Button colorMode={ !initialValuesDocuments.proxyWay?.waybillDriver ? 'grayAlert' : 'blue' }
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
                            <Button colorMode={ !initialValuesDocuments.proxyWay?.itineraryList ? 'grayAlert' : 'blue' }
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
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                {/* Вес груза */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsRequestHead.cargoWeight }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValuesRequest.cargoWeight }
                    </div>
                </div>
                {/* Цена по заявке */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsRequestHead.responsePrice }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { price }
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                {/* Время погрузки */ }
                <div
                    className={ styles.requestFormDocumentRight__inputsItem + ' ' + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsRequestHead.uploadTime }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { hhmmDdMmYyFormat(initialValuesRequest?.shipmentDate) }
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
                        onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendUploadDocument }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendTtnECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.ttnECP?.carrierIsSubscribe }
                            colorMode={ !initialValuesDocuments.ttnECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.ttnECP?.documentDownload }
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendTtnECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ГРУЗОПОЛУЧАТЕЛЬ */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad
                            title={ labelsDocumentsTab.ttnECP?.consigneeIsSubscribe }
                            colorMode={ !initialValuesDocuments.ttnECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                            loadUrl={ initialValuesDocuments.ttnECP?.documentDownload }
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendTtnECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendContractECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendContractECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendUpdECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendUpdECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendCustomerToConsigneeECPFile }
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
                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendCustomerToConsigneeECPFile }
                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*///////////////////ПАНЕЛЬ КНОПОК/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__buttonsPanel }>
                { !requestModes.historyMode && <>
                    <div className={ styles.requestFormDocumentRight__panelButton }>
                        <Button colorMode={ 'gray' }
                                wordWrap rounded
                                title={ labelsRequestHead.localStatus?.paymentHasBeenReceived }
                                onClick={ () => {
                                } }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__panelButton }>
                        <Button colorMode={ 'gray' }
                                wordWrap
                                rounded
                                title={ labelsRequestHead.localStatus?.cargoHasBeenReceived }
                                onClick={ () => {
                                } }
                        />
                    </div>
                </>
                }
            </div>
            { !requestModes.historyMode && <InfoText/> }
        </div>
    )
}
