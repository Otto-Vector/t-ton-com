import React, {useEffect, useState} from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {EmployeesCardType} from '../../../types/form-types'
import {
    getCurrentIdEmployeesStore,
    getInitialValuesEmployeesStore,
    getIsFetchingEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore,
    getOneEmployeesFromLocal,
    getParsersEmployeesStore,
    getValidatorsEmployeesStore,
} from '../../../selectors/options/employees-reselect'
import {
    employeesStoreActions,
    modifyOneEmployeeToAPI,
    newEmployeeSaveToAPI,
    oneEmployeesDeleteToAPI,
} from '../../../redux/options/employees-store-reducer';

import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllTrailerSelectFromLocal} from '../../../selectors/options/trailer-reselect';
import {getAllTransportSelectFromLocal} from '../../../selectors/options/transport-reselect';
import {parseAllNumbers} from '../../../utils/parsers';
import {ImageViewSet} from '../../common/image-view-set/image-view-set';


type OwnProps = {}

export const EmployeesForm: React.FC<OwnProps> = () => {

    const header = 'Сотрудник'
    const isFetching = useSelector(getIsFetchingEmployeesStore)

    const defaultInitialValues = useSelector(getInitialValuesEmployeesStore)
    //для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelEmployeesStore)
    const maskOn = useSelector(getMaskOnEmployeesStore)
    const validators = useSelector(getValidatorsEmployeesStore)
    const parsers = useSelector(getParsersEmployeesStore)

    const trailerSelect = useSelector(getAllTrailerSelectFromLocal)
        .map(( values ) => ( {
            ...values,
            isDisabled: values.isDisabled && ( values.key !== initialValues.idTrailer ),
        } ))

    const transportSelect = useSelector(getAllTransportSelectFromLocal)
        .map(( values ) => ( {
            ...values,
            isDisabled: values.isDisabled && ( values.key !== initialValues.idTransport ),
        } ))

    const currentId = useSelector(getCurrentIdEmployeesStore)
    const oneEmployees = useSelector(getOneEmployeesFromLocal)

    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>();

    const onSubmit = ( values: EmployeesCardType<string> ) => {
        const demaskedValues: EmployeesCardType<string> = {
            ...values,
            personnelNumber: parseAllNumbers(values.personnelNumber),
            garageNumber: parseAllNumbers(values.garageNumber),
        }

        if (isNew) {
            //сохраняем НОВОЕ значение
            dispatch<any>(newEmployeeSaveToAPI(demaskedValues, selectedImage))
        } else {
            //сохраняем измененное значение
            dispatch<any>(modifyOneEmployeeToAPI(demaskedValues, selectedImage))
        }
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const employeesDeleteHandleClick = ( currentId: string ) => {
        dispatch<any>(oneEmployeesDeleteToAPI(currentId))
        navigate(options)
    }

    useEffect(() => {
            if (currentId === currentIdForShow) {
                setInitialValues(oneEmployees)
            } else {
                dispatch(employeesStoreActions.setCurrentId(currentIdForShow || ''))
            }
        }, [ currentId, initialValues ],
    )

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
                                ( {
                                      submitError,
                                      hasValidationErrors,
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                      pristine,
                                  } ) => (
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
                                                   allowEmptyFormatting
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
                                            <FormSelector named={ 'idTransport' }
                                                          placeholder={ label.idTransport }
                                                          values={ transportSelect }
                                                          validate={ validators.idTransport }
                                                          isClearable
                                            />
                                            <FormSelector named={ 'idTrailer' }
                                                          placeholder={ label.idTrailer }
                                                          values={ trailerSelect }
                                                          validate={ validators.idTrailer }
                                                          disabled={ !values.idTransport }
                                                          isClearable
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
                                            {/*/////////////---ИЗОБРАЖЕНИЕ---///////////////////////////////*/ }
                                            <div className={ styles.employeesForm__photoWrapper }>
                                                <ImageViewSet imageURL={ values.photoFace }
                                                              onSelectNewImageFileToSend={ ( image ) => {
                                                                  setSelectedImage(image)
                                                              } }
                                                />
                                            </div>
                                            <div className={ styles.employeesForm__buttonsPanel }>
                                                <div className={ styles.employeesForm__button }>
                                                    <Button type={ 'button' }
                                                            disabled={ submitting || isNew }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            onClick={ () => {
                                                                employeesDeleteHandleClick(currentId)
                                                            } }
                                                            rounded
                                                    />
                                                </div>
                                                <div className={ styles.employeesForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || submitError || hasValidationErrors || pristine }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                    />
                                                </div>
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
