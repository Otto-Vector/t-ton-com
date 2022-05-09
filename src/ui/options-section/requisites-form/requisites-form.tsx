import React from 'react'
import styles from './requisites-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, mustBe00Numbers, mustBe0_0Numbers, mustBeMail,
    required, maxLength
} from '../../../utils/validators'
import {Button} from '../../common/button/button';
import {FormInputType} from '../../common/form-input-type/form-input-type';

import {useSelector} from 'react-redux';
import {Preloader} from '../../common/Preloader/Preloader';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';

type companyRequisitesType<T = string|null> = {
    innNumber: T // ИНН
    organizationName: T // Наименование организации
    taxMode: T // Вид налогов
    kpp: T // КПП
    ogrn: T // ОГРН
    okpo: T // бюджет??
    address: T // Юридический адрес
    description: T // доп. информация

    postAddress: T // почтовый адрес
    phoneDirector: T // телефон директора
    phoneAccountant: T // телефон бухгалтера
    email: T // электронная почта
    bikBank: T // БИК Банка
    nameBank: T // Наименование Банка
    checkingAccount: T // Расчётный счёт
    korrAccount: T // Корреспондентский счёт
}

type validateType = undefined | ((val:string)=>string|undefined)

type OwnProps = {
    onSubmit: (requisites: companyRequisitesType) => void
}

export const RequisitesForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    // const dispatch = useDispatch()
    // const requisiteSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    const label: companyRequisitesType = {
        innNumber: 'ИНН Организации',
        organizationName: 'Наименование организации',
        taxMode: 'Вид налогов',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        okpo: 'ОКПО',
        address: 'Юридический адрес',
        description: 'Доп. информация',

        postAddress: 'Почтовый адрес',
        phoneDirector: 'Телефон директора',
        phoneAccountant: 'Телефон бухгалтера',
        email: 'Электронная почта',
        bikBank: 'БИК Банка',
        nameBank: 'Наименование Банка',
        checkingAccount: 'Расчётный счёт',
        korrAccount: 'Корреспондентский счёт',
    }

    const maskOn: companyRequisitesType = {
        innNumber: '############', // 10,12 цифр
        organizationName: null,
        taxMode: null,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 13 цифр
        okpo: '##########', // 8,10 цифр
        address: null, // понятно. просто адрес
        description: null, // много букав

        postAddress: null, // просто адрес
        phoneDirector: '+7 (###) ###-##-##', //
        phoneAccountant: '+7 (###) ###-##-##',
        email: null, // по другой схеме
        bikBank: '#########', // 9 цифр
        nameBank: null, // просто текст
        checkingAccount: '#### #### #### #### ####', // 20 цифр
        korrAccount: '#### #### #### #### ####', // 20 цифр
    }

    const initialValues: companyRequisitesType = {
        innNumber: null,
        organizationName: null,
        taxMode: null,
        kpp: null,
        ogrn: null,
        okpo: null,
        address: null,
        description: null,

        postAddress: null,
        phoneDirector: null,
        phoneAccountant: null,
        email: null,
        bikBank: null,
        nameBank: null,
        checkingAccount: null,
        korrAccount: null,
    }

    const validators: companyRequisitesType<validateType> = {
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        taxMode: composeValidators(required),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(13)),
        okpo: composeValidators(required, mustBe0_0Numbers(8)(10)),
        address: composeValidators(required),
        description: undefined,

        postAddress: composeValidators(required),
        phoneDirector: composeValidators(required, mustBe00Numbers(11)),
        phoneAccountant: composeValidators(required, mustBe00Numbers(11)),
        email: composeValidators(required, mustBeMail),
        bikBank: composeValidators(required, mustBe00Numbers(9)),
        nameBank: composeValidators(required),
        checkingAccount: composeValidators(required, mustBe00Numbers(20)),
        korrAccount: composeValidators(required, mustBe00Numbers(20)),
    }


    return (
        <div className={styles.requisitesForm}>
            <div className={styles.requisitesForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.requisitesForm__header}>{'Реквизиты'}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.requisitesForm__form}>
                                        <div className={styles.requisitesForm__inputsPanel}>
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
                                            <Field name={'taxMode'}
                                                   placeholder={label.taxMode}
                                                   maskFormat={maskOn.taxMode}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.taxMode}
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
                                            <Field name={'okpo'}
                                                   placeholder={label.okpo}
                                                   maskFormat={maskOn.okpo}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.okpo}
                                            />
                                            <Field name={'address'}
                                                   placeholder={label.address}
                                                   maskFormat={maskOn.address}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.address}
                                            />
                                            <div className={styles.requisitesForm__textArea}>
                                                <Field name={'description'}
                                                       placeholder={label.description}
                                                       maskFormat={maskOn.description}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.requisitesForm__inputsPanel}>
                                            <Field name={'postAddress'}
                                                   placeholder={label.postAddress}
                                                   maskFormat={maskOn.postAddress}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.postAddress}
                                            />
                                            <Field name={'phoneDirector'}
                                                   placeholder={label.phoneDirector}
                                                   maskFormat={maskOn.phoneDirector}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.phoneDirector}
                                            />
                                            <Field name={'phoneAccountant'}
                                                   placeholder={label.phoneAccountant}
                                                   maskFormat={maskOn.phoneAccountant}
                                                   allowEmptyFormatting
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.phoneAccountant}
                                            />
                                            <Field name={'email'}
                                                   placeholder={label.email}
                                                   maskFormat={maskOn.email}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.email}
                                            />
                                            <Field name={'bikBank'}
                                                   placeholder={label.bikBank}
                                                   maskFormat={maskOn.bikBank}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.bikBank}
                                            />
                                            <Field name={'nameBank'}
                                                   placeholder={label.nameBank}
                                                   maskFormat={maskOn.nameBank}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.nameBank}
                                            />
                                            <Field name={'checkingAccount'}
                                                   placeholder={label.checkingAccount}
                                                   maskFormat={maskOn.checkingAccount}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.checkingAccount}
                                            />
                                            <Field name={'korrAccount'}
                                                   placeholder={label.korrAccount}
                                                   maskFormat={maskOn.korrAccount}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.korrAccount}
                                            />
                                            <div className={styles.requisitesForm__buttonsPanel}>
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
