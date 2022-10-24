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
import {useNavigate, useParams} from 'react-router-dom';
import {InfoText} from '../../common/info-text/into-text';
import {
    deletePersonalOrganizationRequisites,
    requisitesStoreActions,
    setOrganizationRequisites,
} from '../../../redux/options/requisites-store-reducer';
import {parseAllNumbers} from '../../../utils/parsers';
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector';
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {FORM_ERROR} from 'final-form';


type OwnProps = {}

export const RequisitesForm: React.FC<OwnProps> = () => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const navigate = useNavigate()
    const { login, options } = useSelector(getRoutesStore)
    const dispatch = useDispatch()

    const initialValues = useSelector(getStoredValuesRequisitesStore)

    const label = useSelector(getLabelRequisitesStore)
    const maskOn = useSelector(getMaskOnRequisitesStore)
    const validators = useSelector(getValidatorsRequisitesStore)
    const parsers = useSelector(getParsersRequisitesStore)

    // вытаскиваем значение роутера
    const { newFlag } = useParams<{ newFlag: string | undefined }>()
    const isNew = newFlag === 'new'
    const disableCompanyReqChange = true


    const onSubmit = async ( requisites: CompanyRequisitesType<string> ) => {
        const unmaskedValues = { ...requisites, innNumber: parseAllNumbers(requisites.innNumber) }
        const error = await dispatch<any>(setOrganizationRequisites(unmaskedValues))
        if (error) return { [FORM_ERROR]: error }
        dispatch(requisitesStoreActions.setIsRequisitesError(false))

        if (isNew) {
            navigate(options)
        } else {
            navigate(-1)
        }
    }

    const onCancelClick = async () => {
        if (isNew) {
            await dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: 'ДАННОЕ ДЕЙСТВИЕ УДАЛИТ ВСЕ ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ПРИ РЕГИСТРАЦИИ',
                action: deletePersonalOrganizationRequisites,
                navigateOnOk: login,
            }))
        } else {
            navigate(-1)
        }
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
                                ( {
                                      pristine,
                                      handleSubmit,
                                      form,
                                      submitting,
                                      hasValidationErrors,
                                      submitError,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.requisitesForm__form }>
                                        <div className={ styles.requisitesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ maskOn.innNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.innNumber }
                                                   parse={ parsers.innNumber }
                                                   disabled={ disableCompanyReqChange }
                                            />
                                            <Field name={ 'organizationName' }
                                                   placeholder={ label.organizationName }
                                                   maskFormat={ maskOn.organizationName }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.organizationName }
                                                   parse={ parsers.organizationName }
                                                   disabled={ disableCompanyReqChange }
                                            />
                                            { isNew ?
                                                <FormSelector named={ 'taxMode' }
                                                              placeholder={ label.taxMode }
                                                              values={ stringArrayToSelectValue([ 'Без НДС', 'НДС 20%' ]) }
                                                              validate={ validators.taxMode }
                                                              errorTop
                                                              isClearable
                                                />
                                                : <Field name={ 'taxMode' }
                                                         placeholder={ label.taxMode }
                                                         maskFormat={ maskOn.taxMode }
                                                         component={ FormInputType }
                                                         resetFieldBy={ form }
                                                         validate={ disableCompanyReqChange ? undefined : validators.taxMode }
                                                         parse={ parsers.taxMode }
                                                         disabled={ disableCompanyReqChange }
                                                />
                                            }
                                            <Field name={ 'kpp' }
                                                   placeholder={ label.kpp }
                                                   maskFormat={ maskOn.kpp }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.kpp }
                                                   parse={ parsers.kpp }
                                                   disabled={ disableCompanyReqChange }
                                            />
                                            <Field name={ 'ogrn' }
                                                   placeholder={ label.ogrn }
                                                   maskFormat={ maskOn.ogrn }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.ogrn }
                                                   parse={ parsers.ogrn }
                                                   disabled={ disableCompanyReqChange }
                                            />
                                            <Field name={ 'okpo' }
                                                   placeholder={ label.okpo }
                                                   maskFormat={ maskOn.okpo }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.okpo }
                                                   parse={ parsers.okpo }
                                                   disabled={ disableCompanyReqChange }
                                            />
                                            <Field name={ 'legalAddress' }
                                                   placeholder={ label.legalAddress }
                                                   maskFormat={ maskOn.legalAddress }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ disableCompanyReqChange ? undefined : validators.legalAddress }
                                                   parse={ parsers.legalAddress }
                                                   disabled={ disableCompanyReqChange }
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
                                                        disabled={ submitting || hasValidationErrors || pristine }
                                                        colorMode={ 'green' }
                                                        title={ 'Cохранить' }
                                                        rounded
                                                >{ submitting && <Preloader/> }</Button>
                                            </div>
                                        </div>
                                        { submitError && <span className={ styles.onError }>{ submitError }</span> }
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
