import React from 'react'
import styles from './requisites-form.module.scss'
import {Field, Form} from 'react-final-form'

import {Button} from '../../common/button/button';
import {FormInputType} from '../../common/form-input-type/form-input-type';

import {useDispatch, useSelector} from 'react-redux';
import {Preloader} from '../../common/preloader/preloader';
import {
    getInitialValuesRequisitesStore,
    getIsFetchingRequisitesStore,
    getLabelRequisitesStore,
    getMaskOnRequisitesStore,
    getStoredValuesRequisitesStore,
    getValidatorsRequisitesStore,
} from '../../../selectors/options/requisites-reselect';
import {CompanyRequisitesType} from '../../../types/form-types';
import {CancelButton} from '../../common/cancel-button/cancel-button';
import {useNavigate} from 'react-router-dom';
import {InfoText} from '../common-forms/info-text/into-text';



type OwnProps = {
    // onSubmit: (requisites: companyRequisitesType) => void
}

export const RequisitesForm: React.FC<OwnProps> = () => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const label = useSelector( getLabelRequisitesStore )
    // const initialValues = useSelector( getInitialValuesRequisitesStore )
    const initialValues = useSelector( getStoredValuesRequisitesStore )

    const maskOn = useSelector( getMaskOnRequisitesStore )
    const validators = useSelector( getValidatorsRequisitesStore )


    const onSubmit = (requisites: CompanyRequisitesType) => {
        console.log(requisites)
    }

    const onCancelClick = () => {
        navigate(-1)
    }
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    return (
        <div className={styles.requisitesForm}>
            <div className={styles.requisitesForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.requisitesForm__header}>{'Реквизиты'}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.requisitesForm__form}>
                                        <div className={styles.requisitesForm__inputsPanel}>
                                            <Field name={'innNumber'}
                                                   placeholder={label.innNumber}
                                                   maskFormat={maskOn.innNumber}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.innNumber}
                                            />
                                            <Field name={'organizationName'}
                                                   placeholder={label.organizationName}
                                                   maskFormat={maskOn.organizationName}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.organizationName}
                                            />
                                            <Field name={'taxMode'}
                                                   placeholder={label.taxMode}
                                                   maskFormat={maskOn.taxMode}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.taxMode}
                                            />
                                            <Field name={'kpp'}
                                                   placeholder={label.kpp}
                                                   maskFormat={maskOn.kpp}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.kpp}
                                            />
                                            <Field name={'ogrn'}
                                                   placeholder={label.ogrn}
                                                   maskFormat={maskOn.ogrn}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.ogrn}
                                            />
                                            <Field name={'okpo'}
                                                   placeholder={label.okpo}
                                                   maskFormat={maskOn.okpo}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.okpo}
                                            />
                                            <Field name={'legalAddress'}
                                                   placeholder={label.legalAddress}
                                                   maskFormat={maskOn.legalAddress}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.legalAddress}
                                            />
                                            <div className={styles.requisitesForm__textArea}>
                                                <Field name={'description'}
                                                       placeholder={label.description}
                                                       maskFormat={maskOn.description}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.requisitesForm__inputsPanel}>
                                            <Field name={'postAddress'}
                                                   placeholder={label.postAddress}
                                                   maskFormat={maskOn.postAddress}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.postAddress}
                                            />
                                            <Field name={'phoneDirector'}
                                                   placeholder={label.phoneDirector}
                                                   maskFormat={maskOn.phoneDirector}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.phoneDirector}
                                            />
                                            <Field name={'phoneAccountant'}
                                                   placeholder={label.phoneAccountant}
                                                   maskFormat={maskOn.phoneAccountant}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.phoneAccountant}
                                            />
                                            <Field name={'email'}
                                                   placeholder={label.email}
                                                   maskFormat={maskOn.email}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.email}
                                            />
                                            <Field name={'bikBank'}
                                                   placeholder={label.bikBank}
                                                   maskFormat={maskOn.bikBank}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.bikBank}
                                            />
                                            <Field name={'nameBank'}
                                                   placeholder={label.nameBank}
                                                   maskFormat={maskOn.nameBank}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.nameBank}
                                            />
                                            <Field name={'checkingAccount'}
                                                   placeholder={label.checkingAccount}
                                                   maskFormat={maskOn.checkingAccount}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.checkingAccount}
                                            />
                                            <Field name={'korrAccount'}
                                                   placeholder={label.korrAccount}
                                                   maskFormat={maskOn.korrAccount}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.korrAccount}
                                            />
                                            <div className={styles.requisitesForm__buttonsPanel}>
                                                <Button type={'submit'}
                                                        disabled={submitting}
                                                        colorMode={'green'}
                                                        title={'Cохранить'}
                                                        rounded
                                                />
                                            </div>
                                        </div>
                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                    </form>
                                )
                            }/>
                    </>}
            <CancelButton onCancelClick={onCancelClick}/>
                <InfoText/>
            </div>
        </div>
    )
}
