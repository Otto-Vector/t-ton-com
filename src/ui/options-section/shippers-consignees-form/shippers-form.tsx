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
import {ShippersCardType, ValidateType} from '../../types/form-types'


type OwnProps = {
    // onSubmit: (requisites: shippersCardType) => void
}


export const ShippersForm: React.FC<OwnProps> = () => {

    const header = 'Заказчики и Грузоотправители'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate();

    const onSubmit = (values: ShippersCardType) => {

    }
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

    const label: ShippersCardType = {
        title: 'Название грузоотправителя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        shipperFio: 'ФИО отправителя',
        shipperTel: 'Телефон отправителя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    }

    const maskOn: ShippersCardType = {
        title: undefined,
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 13 цифр
        address: undefined, // понятно. просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
    }

    const initialValues: ShippersCardType = {
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        shipperFio: undefined,
        shipperTel: undefined,
        description: undefined,
        coordinates: undefined,
    }

    const validators: ShippersCardType<ValidateType> = {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(13)),
        address: composeValidators(required),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
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
                                            <Field name={'shipperFio'}
                                                   placeholder={label.shipperFio}
                                                   maskFormat={maskOn.shipperFio}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.shipperFio}
                                            />
                                            <Field name={'shipperTel'}
                                                   placeholder={label.shipperTel}
                                                   maskFormat={maskOn.shipperTel}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.shipperTel}
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
