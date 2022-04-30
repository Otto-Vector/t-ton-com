import React from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, maxLength11, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

import {useDispatch, useSelector} from 'react-redux';
import {getIsAvailableSMSrequest, getIsFetchingAuth} from '../../../selectors/auth-reselect';
import {Preloader} from '../../common/Preloader/Preloader';
import {fakeAuthFetching} from '../../../redux/auth-store-reducer';


type phoneSubmitType = {
    phone: string | null,
    sms: number | null
}

type OwnProps = {
    onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()

    const fakeFetch = () => { // @ts-ignore
        dispatch(fakeAuthFetching())
    }

    const initialValues = {
        phone: '',
        sms: null
    } as phoneSubmitType


    return (
        <div className={styles.loginForm}>
            { // установил прелоадер
                isFetching ? <Preloader/> : <>
                <h4 className={styles.loginForm__header}>{'Вход'}</h4>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    render={
                        ({submitError, handleSubmit, pristine, form, submitting}) => (
                            <form onSubmit={handleSubmit}>
                                <div className={styles.loginForm__inputsPanel}>
                                    <Field name={'phone'}
                                           placeholder={'Контактный номер +7'}
                                           component={Input}
                                           resetFieldBy={form}
                                           type={'input'}
                                        // parse={normalizePhoneNumber}
                                           validate={composeValidators(required)}

                                    />
                                    <Field name={'sms'}
                                           placeholder={'Пароль из sms'}
                                           component={Input}
                                           type={'input'}
                                           disabled={!isAvailableSMS}
                                        // parse={formatString('9999')}
                                           validate={isAvailableSMS ? composeValidators(required, mustBeNumber) : undefined}
                                           children={<div
                                               className={styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position}>
                                               <Button type={'button'}
                                                       disabled={!isAvailableSMS}
                                                       title={'Новый запрос на пароль из SMS'}
                                                       colorMode={'gray'}
                                                       onClick={fakeFetch}
                                                       rounded
                                               >Новый пароль</Button>
                                           </div>}
                                    />

                                </div>
                                <div className={styles.loginForm__buttonsPanel}>
                                    <Button type={'submit'}
                                            disabled={submitting}
                                            colorMode={'green'}
                                            title={'Далее'}
                                            rounded
                                    >Далее</Button>
                                </div>
                                {submitError && <span className={styles.onError}>{submitError}</span>}
                            </form>
                        )
                    }/>
                <div className={styles.loginForm__smallButton}>
                    <Button type={'button'}
                            title={'Регистрация в приложении'}
                            colorMode={'blue'}
                            rounded
                    >Регистрация</Button>
                </div>
            </>}
        </div>
    )
}
