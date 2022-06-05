import React, {ChangeEvent} from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import noImagePhoto from '../../../media/noImagePhoto2.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {EmployeesCardType} from '../../../types/form-types'
import {
    getInitialValuesEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore, getParsersEmployeesStore,
    getValidatorsEmployeesStore,
} from '../../../selectors/options/employees-reselect'


type OwnProps = {
}

export const EmployeesForm: React.FC<OwnProps> = () => {

    const header = 'Сотрудник'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const label = useSelector(getLabelEmployeesStore)
    const initialValues = useSelector(getInitialValuesEmployeesStore)
    const maskOn = useSelector(getMaskOnEmployeesStore)
    const validators = useSelector(getValidatorsEmployeesStore)
    const parsers = useSelector(getParsersEmployeesStore)

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    const onSubmit = ( values: EmployeesCardType ) => {
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const sendPhotoFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    const employeeSaveHandleClick = () => { // onSubmit
    }

    return (
        <div className={ styles.employeesForm }>
            <div className={ styles.employeesForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.employeesForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { submitError, hasValidationErrors, handleSubmit, pristine, form, submitting } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.employeesForm__form }>
                                        <div
                                            className={ styles.employeesForm__inputsPanel + ' ' + styles.employeesForm__inputsPanel_titled }>
                                            <Field name={ 'employeeFIO' }
                                                   placeholder={ label.employeeFIO }
                                                   maskFormat={ maskOn.employeeFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.employeeFIO }
                                                   parse={ parsers.employeeFIO }
                                            />
                                        </div>

                                        <div className={ styles.employeesForm__inputsPanel }>
                                            <Field name={ 'passportSerial' }
                                                   placeholder={ label.passportSerial }
                                                   maskFormat={ maskOn.passportSerial }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.passportSerial }
                                                   parse={ parsers.passportSerial }
                                            />
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                            <Field name={ 'passportFMS' }
                                                   placeholder={ label.passportFMS }
                                                   maskFormat={ maskOn.passportFMS }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.passportFMS }
                                                   parse={ parsers.passportFMS }
                                            />
                                            <Field name={ 'drivingLicenseNumber' }
                                                   placeholder={ label.drivingLicenseNumber }
                                                   maskFormat={ maskOn.drivingLicenseNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.drivingLicenseNumber }
                                                   parse={ parsers.drivingLicenseNumber }
                                            />
                                            <Field name={ 'drivingCategory' }
                                                   placeholder={ label.drivingCategory }
                                                   maskFormat={ maskOn.drivingCategory }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.drivingCategory }
                                                   parse={ parsers.drivingCategory }
                                            />
                                            <Field name={ 'personnelNumber' }
                                                   placeholder={ label.personnelNumber }
                                                   maskFormat={ maskOn.personnelNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.personnelNumber }
                                                   parse={ parsers.personnelNumber }
                                            />
                                            <Field name={ 'garageNumber' }
                                                   placeholder={ label.garageNumber }
                                                   maskFormat={ maskOn.garageNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.garageNumber }
                                                   parse={ parsers.garageNumber }
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
                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                        <div className={ styles.employeesForm__inputsWithPhoto }>
                                            <Field name={ 'employeePhoneNumber' }
                                                   placeholder={ label.employeePhoneNumber }
                                                   maskFormat={ maskOn.employeePhoneNumber }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.employeePhoneNumber }
                                                   parse={ parsers.employeePhoneNumber }
                                            />
                                            <Field name={ 'passportDate' }
                                                   placeholder={ label.passportDate }
                                                   maskFormat={ maskOn.passportDate }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   inputType={ 'date' }
                                                   validate={ validators.passportDate }
                                                   parse={ parsers.passportDate }
                                            />
                                            <div className={ styles.employeesForm__photo }
                                                 title={ 'Добавить/изменить фото' }>
                                                <img src={ initialValues.photoFace || noImagePhoto } alt="facePhoto"/>
                                                <input type={ 'file' }
                                                       className={ styles.employeesForm__hiddenAttachFile }
                                                       accept={ '.png, .jpeg, .pdf, .jpg' }
                                                       onChange={ sendPhotoFile }
                                                />
                                            </div>

                                            <div className={ styles.employeesForm__buttonsPanel }>
                                                <div className={ styles.employeesForm__button }>
                                                    <Button type={ 'button' }
                                                            disabled={ true }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            rounded
                                                    />
                                                </div>
                                                <div className={ styles.employeesForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || submitError || hasValidationErrors }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            onClick={()=>{employeeSaveHandleClick()}}
                                                            rounded
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/ }
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
