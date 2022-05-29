import React, {useEffect} from 'react'
import styles from './request-form-documents-right.module.scss'
import {useSelector} from 'react-redux';
import {
    getInitialDocumentsRequestValuesStore, getLabelDocumentsRequestValuesStore,

} from '../../../selectors/forms/request-form-reselect';
import {RequestModesType} from '../request-section';

import {Button} from '../../common/button/button';
import {InfoText} from '../../common/info-text/into-text';

type OwnProps = {
    requestModes: RequestModesType,
}


export const RequestFormDocumentsRight: React.FC<OwnProps> = (
    {
        requestModes,
    } ) => {


    const labels = useSelector(getLabelDocumentsRequestValuesStore)
    const initialValues = useSelector(getInitialDocumentsRequestValuesStore)

    const buttonsAction = {
        acceptRequest: () => {
        },

    }

    useEffect(() => {
    }, [ initialValues ])


    return (
        <div className={ styles.requestFormDocumentRight }>
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label
                    }
                >
                    { labels.proxyWay.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.proxyFreightLoader.toString() }
                                disabled={ false }
                                wordWrap
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.proxyDriver.toString() }
                                wordWrap
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.proxyWay.waybillDriver.toString() }
                                wordWrap
                        />
                    </div>
                </div>
            </div>
            <div className={ styles.requestFormDocumentRight__inputsPanel }>
                <label className={ styles.requestFormDocumentRight__label
                    }
                >
                    { labels.ttnECP.label }</label>
                <div className={ styles.requestFormDocumentRight__documentsPanel }>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.ttnECP.customer ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.customer.toString() }
                                disabled={ false }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.carrier.toString() }
                        />
                    </div>
                    <div className={ styles.requestFormDocumentRight__buttonItem }>
                        <Button colorMode={ !initialValues.proxyWay.proxyFreightLoader ? 'grayAlert' : 'blue' }
                                title={ labels.ttnECP.consignee.toString() }
                        />
                    </div>
                </div>
            </div>
            <InfoText/>
        </div>


    )
}
