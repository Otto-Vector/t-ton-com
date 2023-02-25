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
import {DownloadSampleFile} from '../../common/download-sample-file/download-sample-file'

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
    const initialValuesR = useSelector(getInitialValuesRequestStore)
    const modalsText = useSelector(getInfoTextModalsRequestValuesStore)

    const buttonsAction = {
        acceptRequest: () => {
        },
        sendTtnECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendContractECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendUploadDocument: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendUpdECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendCustomerToConsigneeECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
    }
    const disabledButtonOnMode = requestModes.acceptDriverMode || requestModes.createMode

    useEffect(() => {
    }, [ initialValues ])


    return (
        <div className={ styles.requestFormDocumentRight }>
            {/*////////Транспортные документы Сторон//////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.proxyWay.header }</label>
                <div
                    className={ styles.requestFormDocumentRight__documentsPanel + ' ' + styles.requestFormDocumentRight__documentsPanel_top }>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        {/*///////////ДОВЕРЕННОСТЬ ГРУЗОВЛАДЕЛЬЦУ/////////////*/ }
                        <Button colorMode={ !initialValues.proxyWay?.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                disabled={ disabledButtonOnMode }
                                wordWrap
                        >
                            <DownloadSampleFile
                                label={ labels.proxyWay?.proxyFreightLoader?.toString() }
                                // urlShort={ initialValues.proxyWay?.proxyFreightLoader+''}
                                urlShort={ 'emploee_image/employeeImage_KbIz0sf.jpg' }
                                // disabled={ !initialValues.proxyWay?.proxyFreightLoader }
                            />
                        </Button>
                    </div>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay?.proxyDriver ? 'grayAlert' : 'blue' }
                                disabled={ disabledButtonOnMode }
                                wordWrap
                        >
                            <DownloadSampleFile
                                label={ labels.proxyWay?.proxyDriver?.toString() }
                                urlShort={ initialValues.proxyWay?.proxyDriver + '' }
                                disabled={ !initialValues.proxyWay?.proxyDriver }
                            />
                        </Button>
                    </div>
                </div>
                <div
                    className={ styles.requestFormDocumentRight__documentsPanel + ' ' + styles.requestFormDocumentRight__documentsPanel_top }>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay?.waybillDriver ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay?.waybillDriver?.toString() }
                                disabled={ disabledButtonOnMode }
                                wordWrap
                        >
                            <DownloadSampleFile
                                label={ labels.proxyWay?.waybillDriver?.toString() }
                                urlShort={ initialValues.proxyWay?.waybillDriver + '' }
                                disabled={ !initialValues.proxyWay?.waybillDriver }
                            />
                        </Button>
                    </div>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay?.itineraryList ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay?.itineraryList?.toString() }
                                disabled={ disabledButtonOnMode }
                                wordWrap
                        >
                            <DownloadSampleFile
                                label={ labels.proxyWay?.itineraryList?.toString() }
                                urlShort={ initialValues.proxyWay?.itineraryList + '' }
                                disabled={ !initialValues.proxyWay?.itineraryList }
                            />
                        </Button>
                    </div>
                </div>
            </div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА///1/////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.uploadTime }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { hhMmDdMmFormat(new Date()) }
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__infoBreaker }></div>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.cargoWeight }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValuesR.cargoWeight }
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__infoBreaker }></div>
                <div className={ styles.requestFormDocumentRight__buttonItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.cargoDocuments }</label>
                    <Button colorMode={ 'whiteBlueDoc' }
                            disabled={ requestModes.historyMode }
                    >
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { initialValues.cargoDocuments || 'Загрузить' }</span>
                        <MaterialIcon icon_name={ 'attach_file' }/>
                        <input type={ 'file' }
                               className={ styles.requestFormDocumentRight__hiddenAttachFile }
                               accept={ '.png, .jpeg, .pdf, .jpg' }
                               onChange={ buttonsAction.sendUploadDocument }
                               disabled={ requestModes.historyMode }
                        />
                    </Button>
                </div>
            </div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА///2/////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_duo }>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labelsR.responsePrice }</label></div>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValuesR.responsePrice }
                    </div>
                </div>

            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*/////////ТТН или ЭТрН с ЭЦП////////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.ttnECP.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP?.customerIsSubscribe?.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP?.carrierIsSubscribe?.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP?.consigneeIsSubscribe?.toString() }
                        />
                    </div>
                </div>

            </div>
            <div className={ styles.requestFormDocumentRight__documentsPanel }>
                <div className={ styles.requestFormDocumentRight__buttonItem }>
                    <Button colorMode={ 'whiteBlueDoc' }
                            disabled={ requestModes.historyMode }
                    >
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.ttnECP?.documentDownload }</span>
                        <MaterialIcon icon_name={ 'attach_file' }/>
                        <input type={ 'file' }
                               className={ styles.requestFormDocumentRight__hiddenAttachFile }
                               accept={ '.png, .jpeg, .pdf, .jpg' }
                               onChange={ buttonsAction.sendTtnECPFile }
                               disabled={ requestModes.historyMode }
                        />
                    </Button>
                    <InfoButtonToModal textToModal={ modalsText.ttnECP }/>
                </div>
            </div>
            {/*/////////Договор оказания транспортных услуг с ЭЦП//////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.contractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.contractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.contractECP?.customerIsSubscribe?.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.contractECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.contractECP?.carrierIsSubscribe?.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }
                                disabled={ requestModes.historyMode }
                        >
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.contractECP?.documentDownload }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendContractECPFile }
                                   disabled={ requestModes.historyMode }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={ modalsText.contractECP }/>
                    </div>
                </div>
            </div>
            {/*/////////УПД от Перевозчика для Заказчика с ЭЦП//////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.updECP.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.updECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.updECP?.customerIsSubscribe?.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.updECP?.carrierIsSubscribe ? 'grayAlert' : 'blue' }
                                title={ labels.updECP?.carrierIsSubscribe?.toString() }
                        />

                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }
                                disabled={ requestModes.historyMode }
                        >
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.updECP?.documentDownload }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendUpdECPFile }
                                   disabled={ requestModes.historyMode }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={ modalsText.updECP }/>
                    </div>
                </div>
            </div>
            {/*//////Документы от Заказчика для Получателя с ЭЦП/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.customerToConsigneeContractECP?.header }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button
                            colorMode={ !initialValues.customerToConsigneeContractECP?.customerIsSubscribe ? 'grayAlert' : 'blue' }
                            title={ labels.customerToConsigneeContractECP?.customerIsSubscribe?.toString() }
                            disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button
                            colorMode={ !initialValues.customerToConsigneeContractECP?.consigneeIsSubscribe ? 'grayAlert' : 'blue' }
                            title={ labels.customerToConsigneeContractECP?.consigneeIsSubscribe?.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }
                                disabled={ requestModes.historyMode }
                        >
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.customerToConsigneeContractECP?.documentDownload }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendCustomerToConsigneeECPFile }
                                   disabled={ requestModes.historyMode }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={ modalsText.customerToConsigneeContractECP }/>
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
