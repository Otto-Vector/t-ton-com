import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './request-form-documents-right.module.scss'
import {useSelector} from 'react-redux';
import {
    getInfoTextModalsRequestValuesStore,
    getInitialDocumentsRequestValuesStore,
    getLabelDocumentsRequestValuesStore,
} from '../../../selectors/forms/request-form-reselect';
import {RequestModesType} from '../request-section';

import {Button} from '../../common/button/button';
import {InfoText} from '../../common/info-text/into-text';
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {hhMmDdMmFormat} from '../../../utils/date-formats';
import {InfoButtonToModal} from '../../common/info-button-to-modal/info-button-to-modal';

type OwnProps = {
    requestModes: RequestModesType,
}


export const RequestFormDocumentsRight: React.FC<OwnProps> = (
    {
        requestModes,
    } ) => {

    const labels = useSelector(getLabelDocumentsRequestValuesStore)
    const initialValues = useSelector(getInitialDocumentsRequestValuesStore)
    const modalsText = useSelector(getInfoTextModalsRequestValuesStore)

    const buttonsAction = {
        acceptRequest: () => {
        },
        sendContractECPFile: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendUploadDocument: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
        sendPaymentHasBeenTransferred: ( event: ChangeEvent<HTMLInputElement> ) => {
            // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
            // initialValues.contractECP.uploadDocument = event
        },
    }

    useEffect(() => {
    }, [ initialValues ])


    return (
        <div className={ styles.requestFormDocumentRight }>
            {/*////////Транспортные документы Сторон//////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.proxyWay.label }</label>
                <div
                    className={ styles.requestFormDocumentRight__documentsPanel + ' ' + styles.requestFormDocumentRight__documentsPanel_top }>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.proxyFreightLoader.toString() }
                                disabled={ false }
                                wordWrap
                        />
                    </div>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.proxyDriver.toString() }
                                wordWrap
                        />
                    </div>
                    <div
                        className={ styles.requestFormDocumentRight__buttonItem + ' ' + styles.requestFormDocumentRight__buttonItem_twoLines }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.waybillDriver.toString() }
                                wordWrap
                        />
                    </div>
                </div>
            </div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА///1/////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.uploadTime }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { hhMmDdMmFormat(new Date()) }
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__infoBreaker }></div>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.cargoWeight }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValues.cargoWeight }
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__infoBreaker }></div>
                <div className={ styles.requestFormDocumentRight__buttonItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.cargoDocuments }</label>
                    <Button colorMode={ 'whiteBlueDoc' }>
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { initialValues.cargoDocuments || 'Загрузить' }</span>
                        <MaterialIcon icon_name={ 'attach_file' }/>
                        <input type={ 'file' }
                               className={ styles.requestFormDocumentRight__hiddenAttachFile }
                               accept={ '.png, .jpeg, .pdf, .jpg' }
                               onChange={ buttonsAction.sendUploadDocument }
                        />
                    </Button>
                </div>
            </div>
            {/*/////////ПАНЕЛЬ РАСЧЁТА///2/////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel + ' '
                + styles.requestFormDocumentRight__inputsPanel_trio }>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.cargoPrice }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValues.cargoPrice }
                    </div>
                </div>
                <span className={ styles.requestFormDocumentRight__infoSpan }>{ '+' }</span>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.addedPrice }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValues.addedPrice }
                    </div>
                </div>
                <span className={ styles.requestFormDocumentRight__infoSpan }>{ '=' }</span>
                <div className={ styles.requestFormDocumentRight__inputsItem }>
                    <label className={ styles.requestFormDocumentRight__label }>
                        { labels.finalPrice }</label>
                    <div className={ styles.requestFormDocumentRight__info }>
                        { initialValues.finalPrice }
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*/////////ТТН или ЭТрН с ЭЦП////////////////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.ttnECP.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP.customer ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.customer.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP.carrier ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.carrier.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP.consignee ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.consignee.toString() }
                        />
                    </div>
                </div>
            </div>
            {/*/////////Договор оказания транспортных услуг с ЭЦП//////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.contractECP.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.contractECP.customer ? 'grayAlert' : 'blue' }
                                title={ labels.contractECP.customer.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.contractECP.carrier ? 'grayAlert' : 'blue' }
                                title={ labels.contractECP.carrier.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }>
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.contractECP.uploadDocument }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendContractECPFile }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={modalsText.contractECP}/>
                    </div>
                </div>
            </div>
            {/*/////////УПД от Перевозчика для Заказчика с ЭЦП//////////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.updECP.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.updECP.customer ? 'grayAlert' : 'blue' }
                                title={ labels.updECP.customer.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.updECP.carrier ? 'grayAlert' : 'blue' }
                                title={ labels.updECP.carrier.toString() }
                        />

                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }>
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.updECP.uploadDocument }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendContractECPFile }
                            />
                        </Button>
                       <InfoButtonToModal textToModal={modalsText.updECP}/>
                    </div>
                </div>
            </div>
            {/*//////Документы от Заказчика для Получателя с ЭЦП/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label }>
                    { labels.customerToConsigneeContractECP.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button
                            colorMode={ !initialValues.customerToConsigneeContractECP.customer ? 'grayAlert' : 'blue' }
                            title={ labels.customerToConsigneeContractECP.customer.toString() }
                            disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button
                            colorMode={ !initialValues.customerToConsigneeContractECP.consignee ? 'grayAlert' : 'blue' }
                            title={ labels.customerToConsigneeContractECP.consignee.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ 'whiteBlueDoc' }>
                                <span className={ styles.requestFormDocumentRight__inAttachText }>
                                    { labels.customerToConsigneeContractECP.uploadDocument }</span>
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendContractECPFile }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={modalsText.customerToConsigneeContractECP}/>
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__line }></div>
            {/*///////////////////ПАНЕЛЬ КНОПОК/////////////////*/ }
            <div className={ styles.requestFormDocumentRight__buttonsPanel }>

                <div className={ styles.requestFormDocumentRight__panelButton }>
                    <div className={ styles.requestFormDocumentRight__bottomButton }>
                        <Button colorMode={ 'gray' } wordWrap rounded>
                            { labels.paymentHasBeenTransferred }
                            <MaterialIcon icon_name={ 'attach_file' }/>
                            <input type={ 'file' }
                                   className={ styles.requestFormDocumentRight__hiddenAttachFile }
                                   accept={ '.png, .jpeg, .pdf, .jpg' }
                                   onChange={ buttonsAction.sendPaymentHasBeenTransferred }
                            />
                        </Button>
                        <InfoButtonToModal textToModal={modalsText.paymentHasBeenTransferred}/>
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__panelButton }>
                    <div className={ styles.requestFormDocumentRight__bottomButton }>
                        <Button colorMode={ 'gray' }
                                wordWrap rounded
                                title={ labels.paymentHasBeenReceived as string }
                                onClick={ () => {
                                } }
                        />
                    </div>
                </div>
                <div className={ styles.requestFormDocumentRight__panelButton }>
                    <div className={ styles.requestFormDocumentRight__bottomButton }>
                        <Button colorMode={ 'gray' }
                                wordWrap
                                rounded
                                title={ labels.completeRequest as string }
                                onClick={ () => {
                                } }
                        />
                    </div>
                </div>
            </div>
            <InfoText/>
        </div>


    )
}
