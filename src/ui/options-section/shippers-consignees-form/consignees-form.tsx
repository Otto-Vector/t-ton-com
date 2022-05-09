import React from 'react'
import styles from './shippers-consignees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, mustBe00Numbers, mustBe0_0Numbers,
    required, maxLength,
} from '../../../utils/validators'
import {Button} from '../../common/button/button';
import {FormInputType} from '../../common/form-input-type/form-input-type';
import {Preloader} from '../../common/Preloader/Preloader';

import mapImage from '../../../media/mapsicle-map.png'
import {useSelector} from 'react-redux';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';
import {useNavigate} from 'react-router-dom';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {InfoText} from '../common-forms/info-text/into-text';
import {CancelButton} from '../common-forms/cancel-button/cancel-button';

type consigneesCardType<T = string | null> = {
    title: T // заголовок
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    kpp: T // КПП
    ogrn: T // ОГРН
    address: T // Юридический адрес
    consigneesFio: T // ФИО получателя
    consigneesTel: T // Телефон получателя
    description: T // Доп. данные для ТТН
    coordinates: T // Местоположение в координатах
}

// вынесенный тип для валидаторов формы
type validateType = undefined | ((val: string) => string | undefined)

type OwnProps = {
    onSubmit: (requisites: consigneesCardType) => void
}


export const ConsigneesForm: React.FC<OwnProps> = ({onSubmit}) => {

    const header = 'ГрузоПолучатели'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate()

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

    const label: consigneesCardType = {
        title: 'Название грузополучателя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        consigneesFio: 'ФИО получателя',
        consigneesTel: 'Телефон получателя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    }

    const maskOn: consigneesCardType = {
        title: null,
        innNumber: '############', // 10,12 цифр
        organizationName: null,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 13 цифр
        address: null, // понятно. просто адрес
        consigneesFio: null, //
        consigneesTel: '+7 (###) ###-##-##', //
        description: null, // много букав
        coordinates: null,
    }

    const initialValues: consigneesCardType = {
        title: null,
        innNumber: null,
        organizationName: null,
        kpp: null,
        ogrn: null,
        address: null,
        consigneesFio: null,
        consigneesTel: null,
        description: null,
        coordinates: null,
    }

    const validators: consigneesCardType<validateType> = {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(13)),
        address: composeValidators(required),
        consigneesFio: composeValidators(required),
        consigneesTel: composeValidators(required, mustBe00Numbers(11)),
        description: undefined,
        coordinates: composeValidators(required),
    }

    return (
        <div className={styles.shippersConsigneesForm}>
            <div className={styles.shippersConsigneesForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.shippersConsigneesForm__header}>{header}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.shippersConsigneesForm__form}>
                                        <div
                                            className={styles.shippersConsigneesForm__inputsPanel + ' ' + styles.shippersConsigneesForm__inputsPanel_titled}>
                                            <Field name={'title'}
                                                   placeholder={label.title}
                                                   maskFormat={maskOn.title}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.title}
                                            />
                                        </div>
                                        <div className={styles.shippersConsigneesForm__inputsPanel}>
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
                                            <Field name={'address'}
                                                   placeholder={label.address}
                                                   maskFormat={maskOn.address}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.address}
                                            />
                                            <Field name={'consigneesFio'}
                                                   placeholder={label.consigneesFio}
                                                   maskFormat={maskOn.consigneesFio}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.consigneesFio}
                                            />
                                            <Field name={'consigneesTel'}
                                                   placeholder={label.consigneesTel}
                                                   maskFormat={maskOn.consigneesTel}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.consigneesTel}
                                            />
                                            <div className={styles.shippersConsigneesForm__textArea}>
                                                <Field name={'description'}
                                                       placeholder={label.description}
                                                       maskFormat={maskOn.description}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.shippersConsigneesForm__inputsPanel}>
                                            <Field name={'coordinates'}
                                                   placeholder={label.coordinates}
                                                   maskFormat={maskOn.coordinates}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.coordinates}
                                            />

                                            <div className={styles.shippersConsigneesForm__map}>
                                                <img src={mapImage} alt="map"/>
                                            </div>
                                            <div className={styles.shippersConsigneesForm__buttonsPanel}>
                                                <div className={styles.shippersConsigneesForm__button}>
                                                    <Button type={'submit'}
                                                            disabled={submitting}
                                                            colorMode={'green'}
                                                            title={'Cохранить'}
                                                            rounded
                                                    />
                                                </div>
                                                <div className={styles.shippersConsigneesForm__button}>
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
                <CancelButton onCancelClick={onCancelClick}/>
                <InfoText/>
            </div>
        </div>
    )
}
