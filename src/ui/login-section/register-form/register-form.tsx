import React, {useState} from 'react'
import styles from './register-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, minLength11, mustBe12, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {InputNumber} from '../../common/form-type/form-type';

import {Preloader} from '../../common/Preloader/Preloader';
import {useDispatch, useSelector} from 'react-redux';
import {getIsAvailableSMSrequest} from '../../../selectors/auth-reselect';


type companySubmitType = {
    innNumber: string | null,
    phoneNumber: number | null
}

type OwnProps = {
    onSubmit: (register: companySubmitType) => void
}

export const RegisterForm: React.FC<OwnProps> = ({onSubmit}) => {

    const [isFetching, setIsFetching] = useState(false);
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const dispatch = useDispatch;

    const fakeFetch = () => { // @ts-ignore
        dispatch(fakeAuthFetching())
    }
    const initialValues = {
        innNumber: '',
        phoneNumber: null
    } as companySubmitType


    return (
        <div className={styles.registerForm}>
            { // установил прелоадер
                isFetching ? <Preloader/> : <>
                    <h4 className={styles.registerForm__header}>{'Регистрация'}</h4>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={
                            ({submitError, handleSubmit, pristine, form, submitting}) => (
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.registerForm__inputsPanel}>
                                        <Field name={'innNumber'}
                                               placeholder={'ИНН Компании'}
                                               component={InputNumber}
                                               type={'input'}
                                               resetFieldBy={form}
                                               maskFormat={'#### #### ####'}
                                               validate={composeValidators(required)}
                                        />
                                        <Field name={'phone'}
                                               placeholder={'Контактный номер +7'}
                                               component={InputNumber}
                                               resetFieldBy={form}
                                               type={'input'}
                                               maskFormat={'+7 (###) ###-##-##'}
                                               validate={composeValidators(required)}
                                        />
                                    </div>
                                    {!isAvailableSMS &&
                                    <Field name={'sms'}
                                               placeholder={'Пароль из sms'}
                                               component={InputNumber}
                                               maskFormat={'#####'}
                                               disabled={!isAvailableSMS}
                                               validate={isAvailableSMS ? composeValidators(required, mustBeNumber) : undefined}
                                               children={<div className={
                                                   styles.registerForm__smallButton + ' ' + styles.registerForm__smallButton_position}>
                                                   <Button type={'button'}
                                                           disabled={!isAvailableSMS}
                                                           title={'Новый запрос на пароль из SMS'}
                                                           colorMode={'gray'}
                                                           onClick={fakeFetch}
                                                           rounded
                                                   >Новый пароль</Button>
                                               </div>}
                                        />}
                                    <div className={styles.registerForm__buttonsPanel}>
                                        <Button type={'submit'}
                                                disabled={submitting}
                                                colorMode={'green'}
                                                title={'Далее'}
                                                rounded
                                        >Далее</Button>
                                    </div>

                                    {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                </form>
                            )
                        }/>
                </>}
        </div>
    )
}
