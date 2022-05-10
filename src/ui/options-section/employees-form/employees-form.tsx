import React, {ChangeEvent} from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/Preloader/Preloader'

import noImagePhoto from '../../../media/noImagePhoto2.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {parseFIO} from '../../../utils/parsers'
import {InfoText} from '../common-forms/info-text/into-text'
import {CancelButton} from '../common-forms/cancel-button/cancel-button'
import {EmployeesCardType} from '../../types/form-types'
import {
    getInitialValuesEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore,
    getValidatorsEmployeesStore
} from '../../../selectors/options/employees-reselect'

type OwnProps = {
    // onSubmit: (requisites: employeesCardType) => void
}

export const EmployeesForm: React.FC<OwnProps> = () => {

    const header = 'Сотрудник'
    const isFetching = useSelector( getIsFetchingRequisitesStore )
    const label = useSelector( getLabelEmployeesStore )
    const initialValues = useSelector( getInitialValuesEmployeesStore )
    const maskOn = useSelector( getMaskOnEmployeesStore )
    const validators = useSelector( getValidatorsEmployeesStore )

    const { options } = useSelector( getRoutesStore )
    const navigate = useNavigate()

    const onSubmit = ( values: EmployeesCardType ) => {
    }

    const onCancelClick = () => {
        navigate( options )
    }

    const sendPassportFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }
    const sendPhotoFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    const sendLicenseFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    // const dispatch = useDispatch()
    // const employeeSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

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
                                ( { submitError, handleSubmit, pristine, form, submitting } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.employeesForm__form }>
                                        <div
                                            className={ styles.employeesForm__inputsPanel + ' ' + styles.employeesForm__inputsPanel_titled }>
                                            <Field name={ 'employeeFIO' }
                                                   placeholder={ label.employeeFIO }
                                                   maskFormat={ maskOn.employeeFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.employeeFIO }
                                                   parse={ parseFIO }
                                            />
                                            <Field name={ 'employeePhoneNumber' }
                                                   placeholder={ label.employeePhoneNumber }
                                                   maskFormat={ maskOn.employeePhoneNumber }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.employeePhoneNumber }
                                            />
                                        </div>
                                        <div className={ styles.employeesForm__inputsPanel }>
                                            <div className={ styles.employeesForm__withAttach }>
                                                <Field name={ 'passportSerial' }
                                                       placeholder={ label.passportSerial }
                                                       maskFormat={ maskOn.passportSerial }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.passportSerial }
                                                />
                                                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                                <div className={ styles.employeesForm__attachFile
                                                    + ' ' + styles.employeesForm__attachFile_absolute }>
                                                    <Button colorMode={ 'white' }
                                                            title={ 'Добавить' + label.passportImage }
                                                            rounded>
                                                        <MaterialIcon icon_name={ 'attach_file' }/>
                                                        <input type={ 'file' }
                                                               className={ styles.employeesForm__hiddenAttachFile }
                                                               accept={ '.png, .jpeg, .pdf, .jpg' }
                                                               onChange={ sendPassportFile }
                                                        />
                                                    </Button>
                                                </div>
                                                <div className={ styles.employeesForm__attachFile }>
                                                    <Button colorMode={ 'white' }
                                                            title={ 'Просмотреть' + label.passportImage }
                                                            disabled={ !initialValues.passportImage }
                                                            rounded
                                                    >
                                                        <MaterialIcon icon_name={ 'search' }/>
                                                    </Button>
                                                </div>
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                            <Field name={ 'passportFMS' }
                                                   placeholder={ label.passportFMS }
                                                   maskFormat={ maskOn.passportFMS }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.passportFMS }
                                            />
                                            <Field name={ 'passportDate' }
                                                   placeholder={ label.passportDate }
                                                   maskFormat={ maskOn.passportDate }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   inputType={ 'date' }
                                                   validate={ validators.passportDate }
                                            />
                                            <div className={ styles.employeesForm__withAttach }>
                                                <Field name={ 'drivingLicenseNumber' }
                                                       placeholder={ label.drivingLicenseNumber }
                                                       maskFormat={ maskOn.drivingLicenseNumber }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.drivingLicenseNumber }
                                                />
                                                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                                <div className={ styles.employeesForm__attachFile
                                                    + ' ' + styles.employeesForm__attachFile_absolute }>
                                                    <Button colorMode={ 'white' }
                                                            title={ 'Добавить' + label.drivingLicenseImage }
                                                            rounded>
                                                        <MaterialIcon icon_name={ 'attach_file' }/>
                                                        <input type={ 'file' }
                                                               className={ styles.employeesForm__hiddenAttachFile }
                                                               accept={ '.png, .jpeg, .pdf, .jpg' }
                                                               onChange={ sendLicenseFile }
                                                        />
                                                    </Button>
                                                </div>
                                                <div className={ styles.employeesForm__attachFile }>
                                                    <Button colorMode={ 'white' }
                                                            title={ 'Просмотреть' + label.drivingLicenseImage }
                                                            disabled={ !initialValues.drivingLicenseImage }
                                                            rounded
                                                    >
                                                        <MaterialIcon icon_name={ 'search' }/>
                                                    </Button>
                                                </div>
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                            <Field name={ 'drivingCategory' }
                                                   placeholder={ label.drivingCategory }
                                                   maskFormat={ maskOn.drivingCategory }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.drivingCategory }
                                            />
                                            <Field name={ 'personnelNumber' }
                                                   placeholder={ label.personnelNumber }
                                                   maskFormat={ maskOn.personnelNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.personnelNumber }
                                            />
                                            <Field name={ 'garageNumber' }
                                                   placeholder={ label.garageNumber }
                                                   maskFormat={ maskOn.garageNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.garageNumber }
                                            />
                                            <Field name={ 'mechanicFIO' }
                                                   placeholder={ label.mechanicFIO }
                                                   maskFormat={ maskOn.mechanicFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.mechanicFIO }
                                                   parse={ parseFIO }
                                            />
                                            <Field name={ 'dispatcherFIO' }
                                                   placeholder={ label.dispatcherFIO }
                                                   maskFormat={ maskOn.dispatcherFIO }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dispatcherFIO }
                                                   parse={ parseFIO }
                                            />
                                        </div>
                                        <div>
                                            <div className={ styles.employeesForm__photo }
                                                 title={ 'Добавить/изменить фото' }>
                                                <img src={ initialValues.photoFace || noImagePhoto } alt="facePhoto"/>
                                                <input type={ 'file' }
                                                       className={ styles.employeesForm__hiddenAttachFile }
                                                       accept={ '.png, .jpeg, .pdf, .jpg' }
                                                       onChange={ sendPhotoFile }
                                                />
                                            </div>
                                            <div className={ styles.employeesForm__ratingPanel }>
                                                <label className={ styles.employeesForm__ratingPanelLabel }
                                                       style={ { fontSize: '16px' } }>{ label.rating }</label>
                                                <div className={ styles.employeesForm__ratingInput }>
                                                    <Field name={ 'rating' }
                                                           placeholder={ '%' }
                                                           maskFormat={ maskOn.rating }
                                                           component={ FormInputType }
                                                           resetFieldBy={ form }
                                                           validate={ validators.rating }
                                                           disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={ styles.employeesForm__buttonsPanel }>
                                            <div className={ styles.employeesForm__button }>
                                                <Button type={ 'submit' }
                                                        disabled={ submitting }
                                                        colorMode={ 'green' }
                                                        title={ 'Cохранить' }
                                                        rounded
                                                />
                                            </div>
                                            <div className={ styles.employeesForm__button }>
                                                <Button type={ 'button' }
                                                        disabled={ true }
                                                        colorMode={ 'red' }
                                                        title={ 'Удалить' }
                                                        rounded
                                                />
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
