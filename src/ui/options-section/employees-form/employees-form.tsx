import React from 'react'
import styles from './employees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, mustBe00Numbers, mustBe0_0Numbers,
    required, maxLength, maxNumbers,
} from '../../../utils/validators'
import {Button} from '../../common/button/button';
import {InputType} from '../../common/input-type/input-type';
import {Preloader} from '../../common/Preloader/Preloader';

import mapImage from '../../../media/mapsicle-map.png'
import {useSelector} from 'react-redux';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';
import {useNavigate} from 'react-router-dom';
import {MaterialIcon} from '../../common/material-icon/material-icon';
import {getRoutesStore} from '../../../selectors/routes-reselect';

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
    onSubmit: (requisites: employeesCardType) => void
}


export const EmployeesForm: React.FC<OwnProps> = ({onSubmit}) => {

    const header = 'Грузоотправители'
    const infoText = 'Проверьте правильность внесенных данных, перед сохранением.'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate();


    const onCancelClick = () => {
        navigate(options)
    };

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
        rating: '###', // чило ДО 3-х цифр
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
        rating: composeValidators(maxNumbers(3)),
    }


    return (
        <div className={styles.employeesForm}>
            <div className={styles.employeesForm__wrapper}>
                {/*{ // установил прелоадер*/}
                {/*    isFetching ? <Preloader/> : <>*/}
                {/*        <h4 className={styles.employeesForm__header}>{header}</h4>*/}
                {/*        <Form*/}
                {/*            onSubmit={onSubmit}*/}
                {/*            initialValues={initialValues}*/}
                {/*            render={*/}
                {/*                ({submitError, handleSubmit, pristine, form, submitting}) => (*/}
                {/*                    <form onSubmit={handleSubmit} className={styles.employeesForm__form}>*/}
                {/*                        <div*/}
                {/*                            className={styles.employeesForm__inputsPanel + ' ' + styles.employeesForm__inputsPanel_titled}>*/}
                {/*                            <Field name={'title'}*/}
                {/*                                   placeholder={label.title}*/}
                {/*                                   maskFormat={maskOn.title}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.title}*/}
                {/*                            />*/}
                {/*                        </div>*/}
                {/*                        <div className={styles.employeesForm__inputsPanel}>*/}
                {/*                            <Field name={'innNumber'}*/}
                {/*                                   placeholder={label.innNumber}*/}
                {/*                                   maskFormat={maskOn.innNumber}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.innNumber}*/}
                {/*                            />*/}
                {/*                            <Field name={'organizationName'}*/}
                {/*                                   placeholder={label.organizationName}*/}
                {/*                                   maskFormat={maskOn.organizationName}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.organizationName}*/}
                {/*                            />*/}
                {/*                            <Field name={'kpp'}*/}
                {/*                                   placeholder={label.kpp}*/}
                {/*                                   maskFormat={maskOn.kpp}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.kpp}*/}
                {/*                            />*/}
                {/*                            <Field name={'ogrn'}*/}
                {/*                                   placeholder={label.ogrn}*/}
                {/*                                   maskFormat={maskOn.ogrn}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.ogrn}*/}
                {/*                            />*/}
                {/*                            <Field name={'address'}*/}
                {/*                                   placeholder={label.address}*/}
                {/*                                   maskFormat={maskOn.address}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.address}*/}
                {/*                            />*/}
                {/*                            <Field name={'shipperFio'}*/}
                {/*                                   placeholder={label.shipperFio}*/}
                {/*                                   maskFormat={maskOn.shipperFio}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.shipperFio}*/}
                {/*                            />*/}
                {/*                            <Field name={'shipperTel'}*/}
                {/*                                   placeholder={label.shipperTel}*/}
                {/*                                   maskFormat={maskOn.shipperTel}*/}
                {/*                                   allowEmptyFormatting*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.shipperTel}*/}
                {/*                            />*/}
                {/*                            <div className={styles.employeesForm__textArea}>*/}
                {/*                                <Field name={'description'}*/}
                {/*                                       placeholder={label.description}*/}
                {/*                                       maskFormat={maskOn.description}*/}
                {/*                                       component={InputType}*/}
                {/*                                       resetFieldBy={form}*/}
                {/*                                       textArea*/}
                {/*                                />*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                        <div className={styles.employeesForm__inputsPanel}>*/}
                {/*                            <Field name={'coordinates'}*/}
                {/*                                   placeholder={label.coordinates}*/}
                {/*                                   maskFormat={maskOn.coordinates}*/}
                {/*                                   component={InputType}*/}
                {/*                                   resetFieldBy={form}*/}
                {/*                                   validate={validators.coordinates}*/}
                {/*                            />*/}

                {/*                            <div className={styles.employeesForm__map}>*/}
                {/*                                <img src={mapImage} alt="map"/>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.employeesForm__buttonsPanel}>*/}
                {/*                                <div className={styles.employeesForm__button}>*/}
                {/*                                    <Button type={'submit'}*/}
                {/*                                            disabled={submitting}*/}
                {/*                                            colorMode={'green'}*/}
                {/*                                            title={'Cохранить'}*/}
                {/*                                            rounded*/}
                {/*                                    />*/}
                {/*                                </div>*/}
                {/*                                <div className={styles.employeesForm__button}>*/}
                {/*                                    <Button type={'button'}*/}
                {/*                                            disabled={true}*/}
                {/*                                            colorMode={'red'}*/}
                {/*                                            title={'Удалить'}*/}
                {/*                                            rounded*/}
                {/*                                    />*/}
                {/*                                </div>*/}

                {/*                            </div>*/}

                {/*                        </div>*/}
                {/*                        /!*{submitError && <span className={styles.onError}>{submitError}</span>}*!/*/}
                {/*                    </form>*/}
                {/*                )*/}
                {/*            }/>*/}

                {/*    </>}*/}
                {/*<div className={styles.employeesForm__cancelButton} onClick={onCancelClick}>*/}
                {/*    <Button type={'submit'}*/}
                {/*            colorMode={'white'}*/}
                {/*            title={'Отменить/вернуться'}*/}
                {/*            rounded*/}
                {/*    ><MaterialIcon icon_name={'close'}/></Button>*/}
                {/*</div>*/}
                {/*<div className={styles.employeesForm__infoText}>*/}
                {/*    <span>{infoText}</span>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}
