import React, {ChangeEvent} from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, mustBe00Numbers, mustBe0_0Numbers,
    required, maxLength, maxNumbers,
} from '../../../utils/validators'
import {Button} from '../../common/button/button';
import {InputType} from '../../common/input-type/input-type';
import {Preloader} from '../../common/Preloader/Preloader';

import mapImage from '../../../media/noImagePhoto.png'
import {useSelector} from 'react-redux';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';
import {useNavigate} from 'react-router-dom';
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {parseFIO} from '../../../utils/parsers';

type employeesCardType<T = string | null> = {
    employeeFIO: T // ФИО сотрудника
    employeePhoneNumber: T // Телефон сотрудника
    passportSerial: T // Серия, № паспорта
    passportImage: T // Скан паспорта
    passportFMS: T // Кем выдан паспорт
    passportDate: T // Когда выдан
    drivingLicenseNumber: T // Номер водительского удостоверения
    drivingLicenseImage: T // Скан водительского удостоверения
    drivingCategory: T // Водительские категории
    personnelNumber: T // Табельный номер
    garageNumber: T // Гаражный номер
    mechanicFIO: T // ФИО механика
    dispatcherFIO: T // ФИО диспетчера
    photoFace: T // Добавить фотографию сотрудника
    rating: T // Рейтинг
}

// вынесенный тип для валидаторов формы
type validateType = undefined | ((val: string) => string | undefined)

type OwnProps = {
    // onSubmit: (requisites: employeesCardType) => void
}


export const EmployeesForm: React.FC<OwnProps> = () => {

    const header = 'Сотрудник'
    const infoText = 'Проверьте правильность внесенных данных, перед сохранением.'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate();

    const onSubmit = ()=> {}

    const onCancelClick = () => {
        navigate(options)
    };

    const sendPassportFile = (event: ChangeEvent<HTMLInputElement>) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }


    // const dispatch = useDispatch()
    // const requisiteSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    const label: employeesCardType = {
        employeeFIO: 'ФИО сотрудника',
        employeePhoneNumber: 'Телефон сотрудника',
        passportSerial: 'Серия, № паспорта',
        passportImage: 'Скан паспорта',
        passportFMS: 'Кем выдан паспорт',
        passportDate: 'Когда выдан',
        drivingLicenseNumber: 'Номер водительского удостоверения',
        drivingLicenseImage: 'Скан водительского удостоверения',
        drivingCategory: 'Водительские категории',
        personnelNumber: 'Табельный номер',
        garageNumber: 'Гаражный номер',
        mechanicFIO: 'ФИО механика',
        dispatcherFIO: 'ФИО диспетчера',
        photoFace: 'Добавить фотографию сотрудника',
        rating: 'Рейтинг',
    }

    const maskOn: employeesCardType = {
        employeeFIO: null, // просто текст
        employeePhoneNumber: '+7 (###) ###-##-##', // 11 цифр
        passportSerial: '## ## ### ###', // 10 цифр
        passportImage: null, // путь к файлу изображения
        passportFMS: null, // просто текст
        passportDate: null, // режим ввода даты
        drivingLicenseNumber: '## ## ######', // 10 цифр
        drivingLicenseImage: null, // путь к файлу изображения
        drivingCategory: null, // просто текст же?
        personnelNumber: '##### #####', // поставим ДО 10 цифр
        garageNumber: '##### #####', // поставим ДО 10 цифр
        mechanicFIO: null, // просто текст
        dispatcherFIO: null, // просто текст
        photoFace: null, // путь к файлу изображения
        rating: '##', // чило ДО 2-х цифр
    }

    const initialValues: employeesCardType = {
        employeeFIO: null,
        employeePhoneNumber: null,
        passportSerial: null,
        passportImage: null,
        passportFMS: null,
        passportDate: null,
        drivingLicenseNumber: null,
        drivingLicenseImage: null,
        drivingCategory: null,
        personnelNumber: null,
        garageNumber: null,
        mechanicFIO: null,
        dispatcherFIO: null,
        photoFace: null,
        rating: null,
    }

    const validators: employeesCardType<validateType> = {
        employeeFIO: composeValidators(required, maxLength(50)),
        employeePhoneNumber: composeValidators(required, mustBe00Numbers(11)),
        passportSerial: composeValidators(mustBe00Numbers(10)),
        passportImage: undefined,
        passportFMS: undefined,
        passportDate: undefined,
        drivingLicenseNumber: composeValidators(mustBe00Numbers(10)),
        drivingLicenseImage: undefined,
        drivingCategory: undefined,
        personnelNumber: composeValidators(maxNumbers(10)),
        garageNumber: composeValidators(maxNumbers(10)),
        mechanicFIO: composeValidators(maxLength(50)),
        dispatcherFIO: composeValidators(maxLength(50)),
        photoFace: undefined,
        rating: composeValidators(maxNumbers(2)),
    }


    return (
        <div className={styles.employeesForm}>
            <div className={styles.employeesForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.employeesForm__header}>{header}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.employeesForm__form}>
                                        <div
                                            className={styles.employeesForm__inputsPanel + ' ' + styles.employeesForm__inputsPanel_titled}>
                                            <Field name={'employeeFIO'}
                                                   placeholder={label.employeeFIO}
                                                   maskFormat={maskOn.employeeFIO}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.employeeFIO}
                                                   parse={parseFIO}
                                            />
                                            <Field name={'employeePhoneNumber'}
                                                   placeholder={label.employeePhoneNumber}
                                                   maskFormat={maskOn.employeePhoneNumber}
                                                   allowEmptyFormatting
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.employeePhoneNumber}
                                            />
                                        </div>
                                        <div className={styles.employeesForm__inputsPanel}>
                                            <Field name={'passportSerial'}
                                                   placeholder={label.passportSerial}
                                                   maskFormat={maskOn.passportSerial}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.passportSerial}
                                            />
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <div className={styles.employeesForm__attachFile} >
                                            <input type={'file'}
                                                   onChange={sendPassportFile}/>
                                                <MaterialIcon icon_name={'attach_file'}/>
                                            </div>
                                            <div className={styles.employeesForm__showFile}>
                                                {initialValues.passportImage
                                                    ? <MaterialIcon icon_name={'search'}/>
                                                    : <MaterialIcon icon_name={'close'}/>
                                                }
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <Field name={'passportFMS'}
                                                   placeholder={label.passportFMS}
                                                   maskFormat={maskOn.passportFMS}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.passportFMS}
                                            />
                                            <Field name={'passportDate'}
                                                   placeholder={label.passportDate}
                                                   maskFormat={maskOn.passportDate}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   inputType={'date'}
                                                   validate={validators.passportDate}
                                            />
                                            <Field name={'drivingLicenseNumber'}
                                                   placeholder={label.drivingLicenseNumber}
                                                   maskFormat={maskOn.drivingLicenseNumber}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.drivingLicenseNumber}
                                            />
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <div className={styles.employeesForm__attachFile} >
                                            <input type={'file'}
                                                   onChange={sendPassportFile}/>
                                                <MaterialIcon icon_name={'attach_file'}/>
                                            </div>
                                            <div className={styles.employeesForm__showFile}>
                                                {initialValues.drivingLicenseImage
                                                    ? <MaterialIcon icon_name={'search'}/>
                                                    : <MaterialIcon icon_name={'close'}/>
                                                }
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <Field name={'drivingCategory'}
                                                   placeholder={label.drivingCategory}
                                                   maskFormat={maskOn.drivingCategory}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.drivingCategory}
                                            />
                                            <Field name={'personnelNumber'}
                                                   placeholder={label.personnelNumber}
                                                   maskFormat={maskOn.personnelNumber}
                                                   allowEmptyFormatting
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.personnelNumber}
                                            />
                                            <div className={styles.employeesForm__textArea}>
                                                <Field name={'garageNumber'}
                                                       placeholder={label.garageNumber}
                                                       maskFormat={maskOn.garageNumber}
                                                       component={InputType}
                                                       resetFieldBy={form}
                                                       validate={validators.garageNumber}
                                                />
                                            </div>
                                            <Field name={'mechanicFIO'}
                                                   placeholder={label.mechanicFIO}
                                                   maskFormat={maskOn.mechanicFIO}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.mechanicFIO}
                                                   parse={parseFIO}
                                            />
                                            <Field name={'dispatcherFIO'}
                                                   placeholder={label.dispatcherFIO}
                                                   maskFormat={maskOn.dispatcherFIO}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.dispatcherFIO}
                                                   parse={parseFIO}
                                            />
                                        </div>
                                        <div className={styles.employeesForm__inputsPanel}>
                                            <div className={styles.employeesForm__photo}>
                                                <img src={initialValues.photoFace || mapImage} alt="facePhoto"/>
                                            </div>
                                            <Field name={'rating'}
                                                   placeholder={label.rating}
                                                   maskFormat={maskOn.rating}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.rating}
                                            />
                                            <div className={styles.employeesForm__buttonsPanel}>
                                                <div className={styles.employeesForm__button}>
                                                    <Button type={'submit'}
                                                            disabled={submitting}
                                                            colorMode={'green'}
                                                            title={'Cохранить'}
                                                            rounded
                                                    />
                                                </div>
                                                <div className={styles.employeesForm__button}>
                                                    <Button type={'button'}
                                                            disabled={true}
                                                            colorMode={'red'}
                                                            title={'Удалить'}
                                                            rounded
                                                    />
                                                </div>

                                            </div>

                                        </div>
                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                    </form>
                                )
                            }/>

                    </>}
                <div className={styles.employeesForm__cancelButton} onClick={onCancelClick}>
                    <Button type={'submit'}
                            colorMode={'white'}
                            title={'Отменить/вернуться'}
                            rounded
                    ><MaterialIcon icon_name={'close'}/></Button>
                </div>
                <div className={styles.employeesForm__infoText}>
                    <span>{infoText}</span>
                </div>
            </div>
        </div>
    )
}
