import React from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, minLength11, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {InputNumber} from '../../common/form-type/form-type';

import {useDispatch, useSelector} from 'react-redux';
import {getIsAvailableSMSrequest, getIsFetchingAuth} from '../../../selectors/auth-reselect';
import {Preloader} from '../../common/Preloader/Preloader';
import {fakeAuthFetching} from '../../../redux/auth-store-reducer';
import {useNavigate} from 'react-router-dom';
import {getRoutesStore} from '../../../selectors/base-reselect';

type phoneSubmitType = {
    phoneNumber: string | null,
    sms: number | null
}

type OwnProps = {
    onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const {register} = useSelector(getRoutesStore)
    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const registerHandleClick = () => {
        navigate(register)
    }

    const fakeFetch = () => { // @ts-ignore
        dispatch(fakeAuthFetching())
    }

    const initialValues = {
        phoneNumber: '',
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
                                        <Field name={'phoneNumber'}
                                               placeholder={'Контактный номер +7'}
                                               component={InputNumber}
                                               resetFieldBy={form}
                                               maskFormat={'+7 (###) ###-##-##'}
                                               validate={composeValidators(required)}
                                        />
                                        <Field name={'sms'}
                                               placeholder={'Пароль из sms'}
                                               component={InputNumber}
                                               maskFormat={'#####'}
                                               disabled={!isAvailableSMS}
                                               validate={isAvailableSMS ? composeValidators(required, mustBeNumber) : undefined}
                                               children={<div className={
                                                   styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position}>
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
                                    {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                </form>
                            )
                        }/>
                    <div className={styles.loginForm__smallButton}>
                        <Button type={'button'}
                                title={'Регистрация в приложении'}
                                colorMode={'blue'}
                                onClick={registerHandleClick}
                                rounded
                        >Регистрация</Button>
                    </div>
                </>}
        </div>
    )
}
