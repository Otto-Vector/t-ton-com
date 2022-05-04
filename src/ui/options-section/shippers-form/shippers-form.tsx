import React from 'react'
import styles from './shippers-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, mustBe00Numbers, mustBe0_0Numbers, mustBeMail,
    required, maxLength,
} from '../../../utils/validators'
import {Button} from '../../common/button/button';
import {InputType} from '../../common/input-type/input-type';

import {useSelector} from 'react-redux';
import {Preloader} from '../../common/Preloader/Preloader';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';

type shippersCardType<T = string | null> = {
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    kpp: T // КПП
    ogrn: T // ОГРН
    address: T // Юридический адрес
    shipperFio: T // ФИО отправителя
    shipperTel: T // Телефон отправителя
    description: T // Доп. данные для ТТН
    coordinates: T // Местоположение в координатах
}

// вынесенный тип для валидаторов формы
type validateType = undefined | ((val: string) => string | undefined)

type OwnProps = {
    onSubmit: (requisites: shippersCardType) => void
}

export const ShippersForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    // const dispatch = useDispatch()
    // const requisiteSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    const label = {
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        shipperFio: 'ФИО отправителя',
        shipperTel: 'Телефон отправителя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    } as shippersCardType

    const maskOn = {
        innNumber: '############', // 10,12 цифр
        organizationName: null,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 13 цифр
        address: null, // понятно. просто адрес
        shipperFio: null, //
        shipperTel: '+7 (###) ###-##-##', //
        description: null, // много букав
        coordinates: null,
    } as shippersCardType

    const initialValues = {
        innNumber: null,
        organizationName: null,
        kpp: null,
        ogrn: null,
        address: null,
        shipperFio: null,
        shipperTel: null,
        description: null,
        coordinates: null,
    } as shippersCardType

    const validators = {
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(13)),
        address: composeValidators(required),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
        description: undefined,
        coordinates: composeValidators(required),
    } as shippersCardType<validateType>


    return (
        <div className={styles.shipperssForm}>
            <div className={styles.shipperssForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.shipperssForm__header}>{'Грузоотправители'}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.shipperssForm__form}>
                                        <div className={styles.shipperssForm__inputsPanel}>
                                            <Field name={'innNumber'}
                                                   placeholder={label.innNumber}
                                                   maskFormat={maskOn.innNumber}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.innNumber}
                                            />
                                            <Field name={'organizationName'}
                                                   placeholder={label.organizationName}
                                                   maskFormat={maskOn.organizationName}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.organizationName}
                                            />
                                            <Field name={'kpp'}
                                                   placeholder={label.kpp}
                                                   maskFormat={maskOn.kpp}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.kpp}
                                            />
                                            <Field name={'ogrn'}
                                                   placeholder={label.ogrn}
                                                   maskFormat={maskOn.ogrn}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.ogrn}
                                            />
                                            <Field name={'address'}
                                                   placeholder={label.address}
                                                   maskFormat={maskOn.address}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.address}
                                            />
                                            <Field name={'shipperFio'}
                                                   placeholder={label.shipperFio}
                                                   maskFormat={maskOn.shipperFio}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.shipperFio}
                                            />
                                            <Field name={'shipperTel'}
                                                   placeholder={label.shipperTel}
                                                   maskFormat={maskOn.shipperTel}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.shipperTel}
                                            />
                                            <div className={styles.shipperssForm__textArea}>
                                                <Field name={'description'}
                                                       placeholder={label.description}
                                                       maskFormat={maskOn.description}
                                                       component={InputType}
                                                       resetFieldBy={form}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.shipperssForm__inputsPanel}>
                                            <Field name={'coordinates'}
                                                   placeholder={label.coordinates}
                                                   maskFormat={maskOn.coordinates}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.coordinates}
                                            />

                                            <div className={styles.shipperssForm__buttonsPanel}>
                                                <Button type={'submit'}
                                                        disabled={submitting}
                                                        colorMode={'orange'}
                                                        title={'Удалить'}
                                                        rounded
                                                />
                                            </div>
                                            <div className={styles.shipperssForm__buttonsPanel}>
                                                <Button type={'submit'}
                                                        disabled={submitting}
                                                        colorMode={'green'}
                                                        title={'Cохранить'}
                                                        rounded
                                                />
                                            </div>
                                        </div>
                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                    </form>
                                )
                            }/>

                    </>}
            </div>
        </div>
    )
}
