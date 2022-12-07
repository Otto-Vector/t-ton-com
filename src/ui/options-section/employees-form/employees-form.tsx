import React, {useCallback, useEffect, useState} from 'react'
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
import {EmployeesCardType, ParserType, ValidateType} from '../../../types/form-types'
import {
    getCurrentIdEmployeesStore,
    getInitialValuesEmployeesStore,
    getIsFetchingEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore,
    getOneEmployeeFromLocal,
    getParsersEmployeesStore,
    getValidatorsEmployeesStore,
} from '../../../selectors/options/employees-reselect'
import {
    employeesStoreActions,
    modifyOneEmployeeResetResponsesAndStatus,
    modifyOneEmployeeToAPI,
    newEmployeeSaveToAPI,
    oneEmployeesDeleteToAPI,
} from '../../../redux/options/employees-store-reducer';

import {FormSelector} from '../../common/form-selector/form-selector';
import {
    getTrailerSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel,
} from '../../../selectors/options/trailer-reselect';
import {
    getTransportSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel,
} from '../../../selectors/options/transport-reselect';
import {oneRenderParser, parseAllNumbers, syncParsers} from '../../../utils/parsers';
import {ImageViewSet} from '../../common/image-view-set/image-view-set';
import {yearMmDdFormat} from '../../../utils/date-formats';
import {getDrivingCategorySelector} from '../../../selectors/base-reselect';
import {rerenderTransport} from '../../../redux/options/transport-store-reducer';
import {rerenderTrailer} from '../../../redux/options/trailer-store-reducer';
import {syncValidators} from '../../../utils/validators';
import {SwitchMask} from '../../common/antd-switch/antd-switch';
import {SelectOptionsType} from '../../common/form-selector/selector-utils';
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer';
import {FormApi} from 'final-form';


type OwnProps = {}

export const EmployeesForm: React.FC<OwnProps> = () => {

    const header = 'Сотрудник'
    const isFetching = useSelector(getIsFetchingEmployeesStore)

    const defaultInitialValues = useSelector(getInitialValuesEmployeesStore)
    // для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelEmployeesStore)
    const maskOn = useSelector(getMaskOnEmployeesStore)
    const validators = useSelector(getValidatorsEmployeesStore)
    const parsers = useSelector(getParsersEmployeesStore)

    // селекторы
    const drivingCategorySelector = useSelector(getDrivingCategorySelector)
    const transportSelect = useSelector(getTransportSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel)
    const trailerSelect = useSelector(getTrailerSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel)
    const [ trailerSelectDisableWrongCargoType, setTrailerSelectDisableWrongCargoType ] = useState<SelectOptionsType[]>([ {
        key: '',
        value: '',
        label: '',
    } ])

    const currentId = useSelector(getCurrentIdEmployeesStore)
    const oneEmployee = useSelector(getOneEmployeeFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'
    const [ drivingLicenseNumberRusCheck, setDrivingLicenseNumberRusCheck ] = useState(isNew)

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>();


    const onSubmit = useCallback(( values: EmployeesCardType<string> ) => {
        const placeholder = '-'
        const unmaskedValues: EmployeesCardType<string> = {
            ...values,
            personnelNumber: parseAllNumbers(values.personnelNumber) || placeholder,
            garageNumber: parseAllNumbers(values.garageNumber) || placeholder,
            idTransport: values.idTransport || placeholder,
            // проверка (на всякий случай) если отсутствует транспорт, не должно быть и прицепа
            idTrailer: !values.idTransport ? placeholder : values.idTrailer || placeholder,
        }

        if (!isNew && ( oneEmployee.idTransport !== unmaskedValues.idTransport
                || oneEmployee.idTrailer !== unmaskedValues.idTrailer )
            && unmaskedValues.status === 'ожидает принятия'
        ) {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: [
                    'Данный сотрудник ожидает принятия ответа на заявку, вы поменяли ему состав сцепки Транспорт/Прицеп.',
                    '- "ОК" удалит все отклики с данным водителем и сохранит изменения.',
                    '- "Cancel" отменит изменения и вернёт в раздел "Настройки"'
                ],
                action: () => {
                    dispatch<any>(modifyOneEmployeeResetResponsesAndStatus({
                            employeeValues: unmaskedValues,
                            image: selectedImage,
                        }),
                    )
                },
                navigateOnOk: options,
                navigateOnCancel: options,
            }))

        } else {
            if (isNew) {
                // сохраняем НОВОЕ значение
                dispatch<any>(newEmployeeSaveToAPI({
                    ...unmaskedValues,
                    rating: placeholder,
                }, selectedImage))
            } else {
                // сохраняем измененное значение
                dispatch<any>(modifyOneEmployeeToAPI({
                    employeeValues: unmaskedValues,
                    image: selectedImage,
                    status: unmaskedValues.status,
                }))
            }
            navigate(options) // и возвращаемся в предыдущее окно
        }
        dispatch<any>(rerenderTransport())
        dispatch<any>(rerenderTrailer())
    }, [ oneEmployee.idTransport, oneEmployee.idTrailer ])


    const onCancelClick = () => {
        navigate(options)
    }


    const employeesDeleteHandleClick = ( currentId: string ) => {
        dispatch<any>(oneEmployeesDeleteToAPI(currentId))
        navigate(options)
    }

    const setCargoTypeFilter = ( form?: FormApi<EmployeesCardType<string>> ) => async ( idTransport: string ) => {

        if (form) { // при изменении селектора зачищаем значение прицепа
            await form.change('idTrailer', '-')
        }

        if (idTransport) {
            // исключаем из селектора прицепов неподходящий по типу груза
            const selectedTransportCargo = transportSelect.find(( { value } ) => value === idTransport)?.extendInfo
            setTrailerSelectDisableWrongCargoType(selectedTransportCargo === 'Тягач' ? trailerSelect
                : trailerSelect.map(( val ) => ( {
                    ...val, isDisabled: val.isDisabled || selectedTransportCargo !== val.extendInfo,
                } )),
            )
        }
    }

    // диалоговое окно, при неверном выборе транспорта
    const onDisableOptionSelectorHandleClick = ( optionValue: SelectOptionsType ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: 'Нельзя добавить, данный элемент УЖЕ привязан к сотруднику: ' + optionValue.subLabel,
        }))
    }

    useEffect(() => {
            if (currentId === currentIdForShow) {
                setInitialValues(oneEmployee)
            } else {
                dispatch(employeesStoreActions.setCurrentId(currentIdForShow || ''))
            }

            // фильтрация селектора по типу груза при редактировании сотрудника с транспортом
            if (!trailerSelectDisableWrongCargoType[0].value && initialValues.idTransport && !isNew) {
                setCargoTypeFilter()(initialValues.idTransport)
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
                                            <div className={ styles.employeesForm__inputsPanel_withSwitcher }>
                                                <Field name={ 'drivingLicenseNumber' }
                                                       placeholder={ label.drivingLicenseNumber }
                                                       maskFormat={ drivingLicenseNumberRusCheck ? maskOn.drivingLicenseNumber : undefined }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ drivingLicenseNumberRusCheck ? validators.drivingLicenseNumber : syncValidators.textReqMicro }
                                                       parse={ !drivingLicenseNumberRusCheck ? parsers.drivingLicenseNumber : syncParsers.pseudoLatin }
                                                       formatCharsToMaskA={ '[АВЕКМНОРСТУХавекмнорстухABEKMHOPCTYXabekmhopctyx0123456789]' }
                                                       allowEmptyFormatting={ drivingLicenseNumberRusCheck }
                                                       isInputMask={ drivingLicenseNumberRusCheck }
                                                />
                                                <SwitchMask
                                                    checked={ drivingLicenseNumberRusCheck }
                                                    onClick={ () => {
                                                        setDrivingLicenseNumberRusCheck(!drivingLicenseNumberRusCheck)
                                                    } }
                                                />
                                            </div>
                                            <FormSelector nameForSelector={ 'drivingCategory' }
                                                          placeholder={ label.drivingCategory }
                                                          values={ drivingCategorySelector }
                                                          validate={ validators.idTransport }
                                                          isMulti
                                                          isClearable
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
                                            <FormSelector nameForSelector={ 'idTransport' }
                                                          placeholder={ label.idTransport }
                                                          values={ transportSelect }
                                                          validate={ validators.idTransport }
                                                          handleChanger={ setCargoTypeFilter(form) }
                                                          isSubLabelOnOption
                                                          isClearable
                                                          onDisableHandleClick={ onDisableOptionSelectorHandleClick }
                                            />
                                            <FormSelector nameForSelector={ 'idTrailer' }
                                                          placeholder={ label.idTrailer }
                                                          values={ trailerSelectDisableWrongCargoType }
                                                          validate={ validators.idTrailer }
                                                          disabled={ !values.idTransport }
                                                          isSubLabelOnOption
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
                                                   parse={ oneRenderParser(form, parsers.employeePhoneNumber) }
                                            />
                                            <Field name={ 'passportDate' }
                                                   placeholder={ label.passportDate }
                                                   maskFormat={ maskOn.passportDate }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   inputType={ 'date' }
                                                   validate={ validators.passportDate as ValidateType }
                                                   parse={ parsers.passportDate as ParserType }
                                                   value={ yearMmDdFormat(initialValues.passportDate as Date || new Date()) }
                                                   max={ yearMmDdFormat(new Date()) } // для ввода от сегодняшнего дня value обязателен
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
                                                            disabled={ submitting || pristine }
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
