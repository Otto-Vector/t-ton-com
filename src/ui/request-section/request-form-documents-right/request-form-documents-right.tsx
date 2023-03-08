import React, {ChangeEvent, useEffect} from 'react'
import styles from './request-form-documents-right.module.scss'
import {useSelector} from 'react-redux'
import {
    getInfoTextModalsRequestValuesStore,
    getInitialDocumentsRequestValuesStore,
    getInitialValuesRequestStore,
    getLabelDocumentsRequestValuesStore,
    getLabelRequestStore,
} from '../../../selectors/forms/request-form-reselect'
import {RequestModesType} from '../request-section'

import {Button} from '../../common/button/button'
import {InfoText} from '../../common/info-text/into-text'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {hhMmDdMmFormat} from '../../../utils/date-formats'
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal'
import {DownloadSampleFileWrapper} from '../../common/download-sample-file/download-sample-file-wrapper'
import {ButtonMenuSaveLoad} from '../../common/button-menu-save-load/button-menu-save-load'

type OwnProps = {
    requestModes: RequestModesType,
}


export const RequestFormDocumentsRight: React.FC<OwnProps> = (
    {
        requestModes,
    } ) => {

    const labels = useSelector(getLabelDocumentsRequestValuesStore)
    const labelsR = useSelector(getLabelRequestStore)
    const initialValues = useSelector(getInitialDocumentsRequestValuesStore)
    const initialValuesRequest = useSelector(getInitialValuesRequestStore)
    const modalsText = useSelector(getInfoTextModalsRequestValuesStore)

    const buttonsAction = {
        acceptRequest: () => {
        },
        sendUploadDocument: ( event: ChangeEvent<HTMLInputElement> ) => {
            if (event.target.files?.length) console.log(event.target.files[0].name)
            // dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
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
    }, [ initialValues ])


    return (
        <div className={ styles.requestFormDocumentRight }>
            {/*////////Транспортные документы Сторон//////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.proxyWay.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel + ' '
                    + styles.requestFormDocumentRight__documentsPanel_top }>
                    {/* Доверенность грузовладельцу */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValues.proxyWay?.proxyFreightLoader }>
                            <Button colorMode={ !initialValues.proxyWay?.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                    title={ labels.proxyWay?.proxyFreightLoader }
                                    disabled={ !initialValues.proxyWay?.proxyFreightLoader }
                                    wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                    {/* Доверенность на водителя */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValues.proxyWay?.proxyDriver }>
                            <Button colorMode={ !initialValues.proxyWay?.proxyDriver ? 'grayAlert' : 'blue' }
                                    title={ labels.proxyWay?.proxyDriver?.toString() }
                                    disabled={ !initialValues.proxyWay?.proxyDriver }
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
                        <DownloadSampleFileWrapper urlShort={ initialValues.proxyWay?.waybillDriver }>
                            <Button colorMode={ !initialValues.proxyWay?.waybillDriver ? 'grayAlert' : 'blue' }
                                    title={ labels.proxyWay?.waybillDriver?.toString() }
                                    disabled={ !initialValues.proxyWay?.waybillDriver }
                                    wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                    {/* Маршрутный лист водителя */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' '
                        + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <DownloadSampleFileWrapper urlShort={ initialValues.proxyWay?.itineraryList }>
                            <Button colorMode={ !initialValues.proxyWay?.itineraryList ? 'grayAlert' : 'blue' }
                                    title={ labels.proxyWay?.itineraryList?.toString() }
                                    disabled={ !initialValues.proxyWay?.itineraryList }
                                    wordWrap
                            />
                        </DownloadSampleFileWrapper>
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА///1/////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                {/* Вес груза */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.cargoWeight }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValuesRequest.cargoWeight }
                    </div>
                </div>
                {/* Цена по заявке */ }
                <div className={ styles.requestFormDocumentRight__inputsItem + ' '
                    + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.responsePrice }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValuesRequest.responsePrice }
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                {/* Время погрузки */ }
                <div
                    className={ styles.requestFormDocumentRight__inputsItem + ' ' + styles.requestFormDocumentRight__buttonItem_long }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.uploadTime }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { hhMmDdMmFormat(initialValuesRequest?.shipmentDate) }
                    </div>
                </div>
                {/* Документы груза */ }
                <div
                    className={ styles.requestFormDocumentRight__inputsItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { ( labels.cargoDocuments + '' ).split('+')[0] }</label>
                    <ButtonMenuSaveLoad title={ ( labels.cargoDocuments + '' ).split('+').reverse()[0] }
                                        loadUrl={ initialValues.cargoDocuments }
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
                    { labels.ttnECP.header }</label>
                <InfoButtonToModal textToModal={ modalsText.ttnECP } mode={ 'inForm' }/>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad title={ labels.ttnECP?.customerIsSubscribe }
                                            colorMode={ !initialValues.ttnECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.ttnECP?.documentDownload }
                                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendTtnECPFile }
                                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad title={ labels.ttnECP?.carrierIsSubscribe }
                                            colorMode={ !initialValues.ttnECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.ttnECP?.documentDownload }
                                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendTtnECPFile }
                                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ГРУЗОПОЛУЧАТЕЛЬ */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <ButtonMenuSaveLoad title={ labels.ttnECP?.consigneeIsSubscribe }
                                            colorMode={ !initialValues.ttnECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.ttnECP?.documentDownload }
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
                    { labels.contractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.contractECP?.customerIsSubscribe }
                                            colorMode={ !initialValues.contractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.contractECP?.documentDownload }
                                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendContractECPFile }
                                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.contractECP?.carrierIsSubscribe }
                                            colorMode={ !initialValues.contractECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.contractECP?.documentDownload }
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
                    { labels.updECP.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.updECP?.customerIsSubscribe }
                                            colorMode={ !initialValues.updECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.updECP?.documentDownload }
                                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendUpdECPFile }
                                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.updECP?.carrierIsSubscribe }
                                            colorMode={ !initialValues.updECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.updECP?.documentDownload }
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
                    { labels.customerToConsigneeContractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    {/* ЗАКАЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.customerToConsigneeContractECP?.customerIsSubscribe }
                                            colorMode={ !initialValues.customerToConsigneeContractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.customerToConsigneeContractECP?.documentDownload }
                                            onUpload={ requestModes.historyMode ? undefined : buttonsAction.sendCustomerToConsigneeECPFile }
                                            disabled={ disabledButtonOnMode }
                        />
                    </div>
                    {/* ПЕРЕВОЗЧИК */ }
                    <div className={ styles.requestFormDocumentRight__buttonItem + ' ' +
                        styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <ButtonMenuSaveLoad title={ labels.customerToConsigneeContractECP?.consigneeIsSubscribe }
                                            colorMode={ !initialValues.customerToConsigneeContractECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                                            loadUrl={ initialValues.customerToConsigneeContractECP?.documentDownload }
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
                                title={ labelsR.localStatus?.paymentHasBeenReceived }
                                onClick={ () => {
                                } }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__panelButton }>
                        <Button colorMode={ 'gray' }
                                wordWrap
                                rounded
                                title={ labelsR.localStatus?.cargoHasBeenReceived }
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
