import React from 'react'
import styles from './requisites-form.module.scss'
import {Field, Form} from 'react-final-form'

import {Button} from '../../common/button/button';
import {FormInputType} from '../../common/form-input-type/form-input-type';

import {useDispatch, useSelector} from 'react-redux';
import {Preloader} from '../../common/preloader/preloader';
import {
    getIsFetchingRequisitesStore,
    getLabelRequisitesStore,
    getMaskOnRequisitesStore,
    getParsersRequisitesStore,
    getStoredValuesRequisitesStore,
    getValidatorsRequisitesStore,
} from '../../../selectors/options/requisites-reselect';
import {CompanyRequisitesType} from '../../../types/form-types';
import {CancelButton} from '../../common/cancel-button/cancel-button';
import {useNavigate} from 'react-router-dom';
import {InfoText} from '../../common/info-text/into-text';
import {setOrganizationRequisites} from '../../../redux/options/requisites-store-reducer';


type OwnProps = {}

export const RequisitesForm: React.FC<OwnProps> = () => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const initialValues = useSelector(getStoredValuesRequisitesStore)

    const label = useSelector(getLabelRequisitesStore)
    const maskOn = useSelector(getMaskOnRequisitesStore)
    const validators = useSelector(getValidatorsRequisitesStore)
    const parsers = useSelector(getParsersRequisitesStore)

    const onSubmit = async ( requisites: CompanyRequisitesType<string> ) => {
        await dispatch<any>(setOrganizationRequisites(requisites))
        navigate(-1)
    }

    const onCancelClick = () => {
        navigate(-1)
    }


    return (
        <div className={ styles.requisitesForm }>
            <div className={ styles.requisitesForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.requisitesForm__header }>{ 'Реквизиты' }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { handleSubmit, form, submitting, hasValidationErrors } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.requisitesForm__form }>
                                        <div className={ styles.requisitesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ maskOn.innNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.innNumber }
                                                   parse={ parsers.innNumber }
                                            />
                                            <Field name={ 'organizationName' }
                                                   placeholder={ label.organizationName }
                                                   maskFormat={ maskOn.organizationName }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.organizationName }
                                                   parse={ parsers.organizationName }
                                            />
                                            <Field name={ 'taxMode' }
                                                   placeholder={ label.taxMode }
                                                   maskFormat={ maskOn.taxMode }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.taxMode }
                                                   parse={ parsers.taxMode }
                                            />
                                            <Field name={ 'kpp' }
                                                   placeholder={ label.kpp }
                                                   maskFormat={ maskOn.kpp }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.kpp }
                                                   parse={ parsers.kpp }
                                            />
                                            <Field name={ 'ogrn' }
                                                   placeholder={ label.ogrn }
                                                   maskFormat={ maskOn.ogrn }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.ogrn }
                                                   parse={ parsers.ogrn }
                                            />
                                            <Field name={ 'okpo' }
                                                   placeholder={ label.okpo }
                                                   maskFormat={ maskOn.okpo }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.okpo }
                                                   parse={ parsers.okpo }
                                            />
                                            <Field name={ 'legalAddress' }
                                                   placeholder={ label.legalAddress }
                                                   maskFormat={ maskOn.legalAddress }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.legalAddress }
                                                   parse={ parsers.legalAddress }
                                            />
                                            <Field name={ 'mechanicFIO' }
                                                   placeholder={ label.mechanicFIO }
                                                   maskFormat={ maskOn.mechanicFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.mechanicFIO }
                                                   parse={ parsers.mechanicFIO }
                                            />
                                            <Field name={ 'dispatcherFIO' }
                                                   placeholder={ label.dispatcherFIO }
                                                   maskFormat={ maskOn.dispatcherFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dispatcherFIO }
                                                   parse={ parsers.dispatcherFIO }
                                            />
                                        </div>
                                        <div className={ styles.requisitesForm__inputsPanel }>
                                            <Field name={ 'postAddress' }
                                                   placeholder={ label.postAddress }
                                                   maskFormat={ maskOn.postAddress }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.postAddress }
                                                   parse={ parsers.postAddress }
                                            />
                                            <Field name={ 'phoneDirector' }
                                                   placeholder={ label.phoneDirector }
                                                   maskFormat={ maskOn.phoneDirector }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.phoneDirector }
                                                   parse={ parsers.phoneDirector }
                                            />
                                            <Field name={ 'phoneAccountant' }
                                                   placeholder={ label.phoneAccountant }
                                                   maskFormat={ maskOn.phoneAccountant }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.phoneAccountant }
                                                   parse={ parsers.phoneAccountant }
                                            />
                                            <Field name={ 'email' }
                                                   placeholder={ label.email }
                                                   maskFormat={ maskOn.email }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.email }
                                                   parse={ parsers.email }
                                            />
                                            <Field name={ 'bikBank' }
                                                   placeholder={ label.bikBank }
                                                   maskFormat={ maskOn.bikBank }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.bikBank }
                                                   parse={ parsers.bikBank }
                                            />
                                            <Field name={ 'nameBank' }
                                                   placeholder={ label.nameBank }
                                                   maskFormat={ maskOn.nameBank }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.nameBank }
                                                   parse={ parsers.nameBank }
                                            />
                                            <Field name={ 'checkingAccount' }
                                                   placeholder={ label.checkingAccount }
                                                   maskFormat={ maskOn.checkingAccount }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.checkingAccount }
                                                   parse={ parsers.checkingAccount }
                                            />
                                            <Field name={ 'korrAccount' }
                                                   placeholder={ label.korrAccount }
                                                   maskFormat={ maskOn.korrAccount }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.korrAccount }
                                                   parse={ parsers.korrAccount }
                                            />
                                            <div className={ styles.requisitesForm__buttonsPanel }>
                                                <Button type={ 'submit' }
                                                        disabled={ submitting || hasValidationErrors }
                                                        colorMode={ 'green' }
                                                        title={ 'Cохранить' }
                                                        rounded
                                                >{ submitting && <Preloader/>}</Button>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }/>
                    </> }
                <CancelButton onCancelClick={ onCancelClick }/>
                <InfoText/>
            </div>
        </div>
    )
}
