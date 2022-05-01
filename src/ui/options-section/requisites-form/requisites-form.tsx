import React from 'react'
import styles from './requisites-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators,
    mustBe12Numbers,
    mustBe13Numbers,
    mustBe20Numbers,
    mustBe9Numbers,
    required,
} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

import {useDispatch, useSelector} from 'react-redux';
import {Preloader} from '../../common/Preloader/Preloader';
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect';

type companyRequisitesType = {
    innNumber: string | null // ИНН
    organizationName: string | null // Наименование организации
    taxMode: string | null // Вид налогов
    kpp: string | null // КПП
    ogrn: string | null // ОГРН
    money: string | null // бюджет??
    addres: string | null // Юридический адрес
    description: string | null // доп. информация

    postAdress: string | null // почтовый адрес
    phoneDirector: string | null // телефон директора
    phoneAccountant: string | null // телефон бухгалтера
    email: string | null // электронная почта
    bikBank: string | null // БИК Банка
    nameBank: string | null // Наименование Банка
    checkingAccount: string | null // Расчётный счёт
    korrAccount: string | null // Корреспондентский счёт
}

type OwnProps = {
    onSubmit: (requisites: companyRequisitesType) => void
}

export const RequisitesForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const dispatch = useDispatch()

    const requisiteSaveHandleClick = () => { // onSubmit

    }

    const fakeFetch = () => { // @ts-ignore
        // dispatch(fakeAuthFetching())
    }

    const maskOnInputs = {
        innNumber: '############', // 12 цифр
        organizationName: null,
        taxMode: null,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 13 цифр
        money: null, // какие-то цифры
        addres: null, // понятно. просто адрес
        description: null, // много букав

        postAdress: null, // просто адрес
        phoneDirector: '+7 (###) ###-##-##', //
        phoneAccountant: '+7 (###) ###-##-##',
        email: null, // по другой схеме
        bikBank: '#########', // 9 цифр
        nameBank: null, // просто текст
        checkingAccount: '#### #### #### #### ####', // 20 цифр
        korrAccount: '#### #### #### #### ####', // 20 цифр
    } as companyRequisitesType

    const label = {
        innNumber: 'ИНН Организации',
        organizationName: 'Наименование организации',
        taxMode: 'Вид налогов',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        money: 'бюджет??',
        addres: 'Юридический адрес',
        description: 'Доп. информация',

        postAdress: 'Почтовый адрес',
        phoneDirector: 'Телефон директора',
        phoneAccountant: 'Телефон бухгалтера',
        email: 'Электронная почта',
        bikBank: 'БИК Банка',
        nameBank: 'Наименование Банка',
        checkingAccount: 'Расчётный счёт',
        korrAccount: 'Корреспондентский счёт',
    } as companyRequisitesType

    const initialValues = {
        innNumber: null,
        organizationName: null,
        taxMode: null,
        kpp: null,
        ogrn: null,
        money: null,
        addres: null,
        description: null,

        postAdress: null,
        phoneDirector: null,
        phoneAccountant: null,
        email: null,
        bikBank: null,
        nameBank: null,
        checkingAccount: null,
        korrAccount: null,
    } as companyRequisitesType


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
                                                   maskFormat={maskOnInputs.innNumber}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe12Numbers)}
                                            />
                                            <Field name={'organizationName'}
                                                   placeholder={label.organizationName}
                                                   maskFormat={maskOnInputs.organizationName}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'taxMode'}
                                                   placeholder={label.taxMode}
                                                   maskFormat={maskOnInputs.taxMode}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'kpp'}
                                                   placeholder={label.kpp}
                                                   maskFormat={maskOnInputs.kpp}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe9Numbers)}
                                            />
                                            <Field name={'ogrn'}
                                                   placeholder={label.ogrn}
                                                   maskFormat={maskOnInputs.ogrn}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe13Numbers)}
                                            />
                                            <Field name={'money'}
                                                   placeholder={label.money}
                                                   maskFormat={maskOnInputs.money}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'addres'}
                                                   placeholder={label.addres}
                                                   maskFormat={maskOnInputs.addres}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <div className={styles.requisitesForm__textArea}>
                                                <Field name={'description'}
                                                       placeholder={label.description}
                                                       maskFormat={maskOnInputs.description}
                                                       component={Input}
                                                       resetFieldBy={form}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.requisitesForm__inputsPanel}>
                                            <Field name={'postAdress'}
                                                   placeholder={label.postAdress}
                                                   maskFormat={maskOnInputs.postAdress}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'phoneDirector'}
                                                   placeholder={label.phoneDirector}
                                                   maskFormat={maskOnInputs.phoneDirector}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'phoneAccountant'}
                                                   placeholder={label.phoneAccountant}
                                                   maskFormat={maskOnInputs.phoneAccountant}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'email'}
                                                   placeholder={label.email}
                                                   maskFormat={maskOnInputs.email}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'bikBank'}
                                                   placeholder={label.bikBank}
                                                   maskFormat={maskOnInputs.bikBank}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe9Numbers)}
                                            />
                                            <Field name={'nameBank'}
                                                   placeholder={label.nameBank}
                                                   maskFormat={maskOnInputs.nameBank}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required)}
                                            />
                                            <Field name={'checkingAccount'}
                                                   placeholder={label.checkingAccount}
                                                   maskFormat={maskOnInputs.checkingAccount}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe20Numbers)}
                                            />
                                            <Field name={'korrAccount'}
                                                   placeholder={label.korrAccount}
                                                   maskFormat={maskOnInputs.korrAccount}
                                                   component={Input}
                                                   resetFieldBy={form}
                                                   validate={composeValidators(required,mustBe20Numbers)}
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
