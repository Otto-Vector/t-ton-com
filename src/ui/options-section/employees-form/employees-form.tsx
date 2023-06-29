import React, {useCallback, useEffect, useMemo, useState} from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {Preloader} from '../../common/tiny/preloader/preloader'

import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/tiny/info-text/into-text'
import {CancelXButton} from '../../common/buttons/cancel-button/cancel-x-button'
import {EmployeeCardType, ParserType, ValidateType} from '../../../types/form-types'
import {
    getCurrentIdEmployeesStore,
    getIsFetchingEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore,
    getOneEmployeeFromLocal,
    getParsersEmployeesStore,
    getValidatorsEmployeesStore,
} from '../../../selectors/options/employees-reselect'
import {
    employeesStoreActions,
    getOneFiredEmployeeFromAPI,
    modifyOneEmployeeResetResponsesAndStatus,
    modifyOneEmployeeToAPI,
    newEmployeeSaveToAPI,
    oneEmployeeDeleteSoftToAPI,
} from '../../../redux/options/employees-store-reducer'

import {FormSelector} from '../../common/inputs/final-form-inputs/form-selector/form-selector'

import {parseAllNumbers, parseOnChangeValue, syncParsers} from '../../../utils/parsers'
import {ImageViewSet} from '../../common/modals/image-view-set/image-view-set'
import {yearMmDdFormat} from '../../../utils/date-formats'
import {getDrivingCategorySelectorBaseStore} from '../../../selectors/base-reselect'
import {syncValidators} from '../../../utils/validators'
import {SwitchMask} from '../../common/inputs/antd-switch/antd-switch'
import {SelectOptionsType} from '../../common/inputs/final-form-inputs/form-selector/selector-utils'
import {textAndActionGlobalModal} from '../../../redux/utils/global-modal-store-reducer'
import {FormApi} from 'final-form'
import {removeResponseToRequestsBzEmployee} from '../../../redux/forms/add-driver-store-reducer'
import {
    getTrailerSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel,
    getTransportSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel,
} from '../../../selectors/options/for-selectors/all-selectors-buffer-reselect'
import createDecorator from 'final-form-focus'
import {getCurrentEmployeeCargoType} from '../../../selectors/options/options-reselect'
import {boldWrapper} from '../../../utils/html-rebuilds'


type OwnProps = {}


export const EmployeesForm: React.ComponentType<OwnProps> = () => {

    const header = 'Сотрудник'
    const isFetching = useSelector(getIsFetchingEmployeesStore)

    const label = useSelector(getLabelEmployeesStore)
    const maskOn = useSelector(getMaskOnEmployeesStore)
    const validators = useSelector(getValidatorsEmployeesStore)
    const parsers = useSelector(getParsersEmployeesStore)
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])
    // для быстрого поиска cargoType из селектора
    const cargoType = useSelector(getCurrentEmployeeCargoType)

    // селекторы
    const drivingCategorySelector = useSelector(getDrivingCategorySelectorBaseStore)
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
    const { id: currentIdForShow = '' } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'
    const [ drivingLicenseNumberRusCheck, setDrivingLicenseNumberRusCheck ] = useState(isNew)
    // для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState<EmployeeCardType>({} as EmployeeCardType)

    const { options, optionsEdit: { employees } } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>()
    const [ isImageChanged, setIsImageChanged ] = useState(false)


    const onSubmit = useCallback(async ( values: EmployeeCardType<string> ) => {
        const placeholder = '-'
        const unmaskedValues: EmployeeCardType<string> = {
            ...values,
            personnelNumber: parseAllNumbers(values.personnelNumber) || placeholder,
            garageNumber: parseAllNumbers(values.garageNumber) || placeholder,
            idTransport: values.idTransport || placeholder,
            // проверка (на всякий случай) если отсутствует транспорт, не должно быть и прицепа
            idTrailer: !values.idTransport ? placeholder : values.idTrailer || placeholder,
        }

        if (!isNew && ( oneEmployee?.idTransport !== unmaskedValues.idTransport
                || oneEmployee?.idTrailer !== unmaskedValues.idTrailer )
            && unmaskedValues.status === 'ожидает принятия'
        ) {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: [
                    'Данный сотрудник ожидает принятия ответа на заявку, вы поменяли ему состав сцепки Транспорт/Прицеп.',
                    '- "ОК" удалит все отклики с данным водителем и сохранит изменения.',
                    '- "Cancel" отменит изменения и вернёт в раздел "Настройки"',
                ],
                action: () => {
                    dispatch<any>(modifyOneEmployeeResetResponsesAndStatus({
                        employeeValues: unmaskedValues,
                        image: selectedImage,
                    }))
                },
                navigateOnOk: options,
                navigateOnCancel: options,
            }))

        } else {
            if (isNew) {
                // сохраняем НОВОЕ значение
                const idEmployee = await dispatch<any>(newEmployeeSaveToAPI({
                    ...unmaskedValues,
                    rating: placeholder,
                }, selectedImage))
                // если такой номер паспорта есть, то возвращает его idEmployee
                if (idEmployee) {
                    dispatch<any>(textAndActionGlobalModal({
                        text: 'Сотрудник с данным номером паспорта уже есть в системе. Попытаться его восстановить?',
                        navigateOnOk: employees + idEmployee,
                        navigateOnCancel: options,
                    }))
                }
            } else {
                // сохраняем ИЗМЕНЕННОЕ значение
                dispatch<any>(modifyOneEmployeeToAPI({
                    employeeValues: unmaskedValues,
                    image: selectedImage,
                    status: unmaskedValues.status === 'уволен' ? 'свободен' : unmaskedValues.status,
                }))
            }
            // и возвращаемся в предыдущее окно
            navigate(options)
        }
        // dispatch<any>(rerenderTransport())
        // dispatch<any>(rerenderTrailer())
    }, [ oneEmployee?.idTransport, oneEmployee?.idTrailer, selectedImage ])


    const onCancelClick = () => {
        navigate(options)
    }

    const employeesDeleteHandleClick = useCallback(( employeeValues: EmployeeCardType ) => {

        if (initialValues.status === 'ожидает принятия') {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: [
                    'Данный сотрудник ожидает принятия ответа на заявку, вы желаете его Удалить?',
                    '- "ОК" удалит все отклики с данным водителем и данные водителя',
                    '- "Cancel" отменит запрос на удаление, вернёт к карточке водителя',
                ],
                action: () => {
                    dispatch<any>(removeResponseToRequestsBzEmployee({
                        idEmployee: employeeValues.idEmployee,
                        responseId: employeeValues.addedToResponse as string,
                    }))
                    dispatch<any>(oneEmployeeDeleteSoftToAPI(employeeValues.idEmployee))
                },
                navigateOnOk: options,
            }))
        }

        if (initialValues.status === 'на заявке') {
            dispatch<any>(textAndActionGlobalModal({
                text: 'Данный сотрудник находится на выполнении заявки, завершите выполнение заявки.',
            }))
        }

        if (initialValues.status === 'свободен') {
            dispatch<any>(textAndActionGlobalModal({
                title: 'Внимание!',
                text: [
                    'Вы собираетесь удалить сотрудника: ' + employeeValues.employeeFIO,
                    'ОК - удалит сотрудника для данной организации',
                    'Cancel - возврат к редактированию сотрудника',
                ],
                action: () => {
                    dispatch<any>(oneEmployeeDeleteSoftToAPI(employeeValues.idEmployee))
                },
                navigateOnOk: options,
            }))
        }

    }, [ options, initialValues.idEmployee ])

    // фильтруем прицепы по значению поля Транспорт
    const setCargoTypeFilter = ( form?: FormApi<EmployeeCardType<string>> ) => async ( idTransport: string ) => {

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
            text: 'Нельзя добавить, данный элемент УЖЕ привязан к ДРУГОМУ сотруднику: ' + boldWrapper(optionValue.subLabel),
        }))
    }

    // зачистка полей при первом рендере
    useEffect(() => {
        dispatch(employeesStoreActions.setInitialValues({} as EmployeeCardType))
    }, [])


    // отображение данных пользователя
    useEffect(() => {
            if (currentId === currentIdForShow) {
                if (oneEmployee?.idUser) {
                    setInitialValues(oneEmployee)
                } else {
                    if (!isNew) {
                        dispatch<any>(getOneFiredEmployeeFromAPI(currentIdForShow))
                    }
                }
            } else {
                dispatch(employeesStoreActions.setCurrentId(currentIdForShow))
            }

            // фильтрация селектора по типу груза при редактировании сотрудника с транспортом
            if (!trailerSelectDisableWrongCargoType[0].value && initialValues.idTransport && !isNew) {
                setCargoTypeFilter()(initialValues.idTransport)
            }

        }, [ currentId, currentIdForShow, initialValues.idTransport, oneEmployee?.idUser, isNew ],
    )


    return (
        <div className={ styles.employeesForm }>
            <div className={ styles.employeesForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        {
                            !isNew && <>
                                {/* статус водителя в верхнем левом углу */ }
                                <span className={ styles.employeesForm__status }>{ initialValues.status }</span>
                                {/* тип груза*/ }
                                <span
                                    className={ styles.employeesForm__status + ' ' + styles.employeesForm__status_cargoType }
                                >{ cargoType }</span>
                            </>
                        }
                        <h4 className={ styles.employeesForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            //@ts-ignore-next-line
                            decorators={ [ focusOnError ] }
                            initialValues={ initialValues }
                            render={
                                ( {
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                      pristine,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.employeesForm__form }>
                                        {/* ФИО Сотрудника */ }
                                        <div className={ styles.employeesForm__inputsPanel + ' '
                                            + styles.employeesForm__inputsPanel_titled }>
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
                                            {/* Серия паспорта */ }
                                            <Field name={ 'passportSerial' }
                                                   placeholder={ label.passportSerial }
                                                   maskFormat={ maskOn.passportSerial }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.passportSerial }
                                                   parse={ parsers.passportSerial }
                                            />
                                            {/* Кем выдан паспорт */ }
                                            <Field name={ 'passportFMS' }
                                                   placeholder={ label.passportFMS }
                                                   maskFormat={ maskOn.passportFMS }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.passportFMS }
                                                   parse={ parsers.passportFMS }
                                            />
                                            {/* Номер водительского удостоверения */ }
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
                                            {/* Водительские категории */ }
                                            <FormSelector nameForSelector={ 'drivingCategory' }
                                                          placeholder={ label.drivingCategory }
                                                          options={ drivingCategorySelector }
                                                          validate={ validators.drivingCategory }
                                                          isMulti
                                                          isClearable
                                            />
                                            {/* Табельный номер */ }
                                            <Field name={ 'personnelNumber' }
                                                   placeholder={ label.personnelNumber }
                                                   maskFormat={ maskOn.personnelNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.personnelNumber }
                                                   parse={ parsers.personnelNumber }
                                            />
                                            {/* Гаражный номер */ }
                                            <Field name={ 'garageNumber' }
                                                   placeholder={ label.garageNumber }
                                                   maskFormat={ maskOn.garageNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.garageNumber }
                                                   parse={ parsers.garageNumber }
                                            />
                                            {/* Прикреплённый транспорт */ }
                                            <FormSelector nameForSelector={ 'idTransport' }
                                                          placeholder={ label.idTransport }
                                                          options={ transportSelect }
                                                          validate={ validators.idTransport }
                                                          handleChanger={ setCargoTypeFilter(form) }
                                                          isSubLabelOnOption
                                                          isClearable
                                                          onDisableHandleClick={ onDisableOptionSelectorHandleClick }
                                                          disabled={ initialValues.status === 'на заявке' }
                                            />
                                            {/* Прикрёплённый прицеп */ }
                                            <FormSelector nameForSelector={ 'idTrailer' }
                                                          placeholder={ label.idTrailer }
                                                          options={ trailerSelectDisableWrongCargoType }
                                                          validate={ validators.idTrailer }
                                                          isSubLabelOnOption
                                                          isClearable
                                                          disabled={ !values.idTransport || initialValues.status === 'на заявке' }
                                            />
                                        </div>
                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                        <div className={ styles.employeesForm__inputsWithPhoto }>
                                            {/* Телефон сотрудника */ }
                                            <Field name={ 'employeePhoneNumber' }
                                                   placeholder={ label.employeePhoneNumber }
                                                   maskFormat={ maskOn.employeePhoneNumber }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.employeePhoneNumber }
                                                   parse={ parseOnChangeValue(form, parsers.employeePhoneNumber) }
                                            />
                                            {/* Когда выдан паспорт */ }
                                            <Field name={ 'passportDate' }
                                                   placeholder={ label.passportDate }
                                                   maskFormat={ maskOn.passportDate }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   inputType={ 'date' }
                                                   validate={ validators.passportDate as ValidateType }
                                                   parse={ parsers.passportDate as ParserType }
                                                   value={ initialValues.passportDate || yearMmDdFormat(new Date()) }
                                                   max={ yearMmDdFormat(new Date()) } // для ввода от сегодняшнего дня value обязателен
                                            />
                                            {/*/////////////---ИЗОБРАЖЕНИЕ---///////////////////////////////*/ }
                                            <div className={ styles.employeesForm__photoWrapper }>
                                                <ImageViewSet imageURL={ values.photoFace }
                                                              onSelectNewImageFileToSend={ ( image ) => {
                                                                  setSelectedImage(image)
                                                                  setIsImageChanged(true)
                                                              } }
                                                />
                                            </div>
                                            <div className={ styles.employeesForm__buttonsPanel }>
                                                <div className={ styles.employeesForm__button }>
                                                    <ProjectButton type={ 'button' }
                                                                   disabled={ submitting || isNew }
                                                                   colorMode={ 'red' }
                                                                   title={ 'Удалить' }
                                                                   onClick={ () => {
                                                                       employeesDeleteHandleClick(initialValues)
                                                                   } }
                                                                   rounded
                                                    />
                                                </div>
                                                <div className={ styles.employeesForm__button }>
                                                    <ProjectButton type={ 'submit' }
                                                                   disabled={ !isImageChanged && ( submitting || ( isNew ? false : pristine ) ) }
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
                <CancelXButton onCancelClick={ onCancelClick }/>
                <InfoText/>
            </div>
        </div>
    )
}
