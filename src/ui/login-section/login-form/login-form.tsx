import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

import {useDispatch, useSelector} from 'react-redux';
import {getIsAvailableSMSrequest, getIsFetchingAuth} from '../../../selectors/auth-reselect';
import {Preloader} from '../../common/Preloader/Preloader';
import {fakeAuthFetching} from '../../../redux/auth-store-reducer';

type phoneSubmitType = {
    innNumber: string | null
    phoneNumber: string | null
    sms: string | null
}

type OwnProps = {
    onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ({onSubmit}) => {

    const [isRegisterMode, setIsRegisterMode] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()

    const registerHandleClick = () => {
        setIsRegisterMode(!isRegisterMode)
    }

    const fakeFetch = () => { // @ts-ignore
        dispatch(fakeAuthFetching())
    }

    const maskOnInputs = {
        innNumber: '#### #### ####',
        phoneNumber: '+7 (###) ###-##-##',
        sms: '#####',
    } as phoneSubmitType

    const initialValues = {
        innNumber: null,
        phoneNumber: null,
        sms: null,
    } as phoneSubmitType


    return (
        <div className={styles.loginForm}>
            { // установил прелоадер
                isFetching ? <Preloader/> : <>
                    <h4 className={styles.loginForm__header}>{isRegisterMode ? 'Регистрация' : 'Вход'}</h4>
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        render={
                            ({submitError, handleSubmit, pristine, form, submitting}) => (
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.loginForm__inputsPanel}>
                                        {isRegisterMode &&
                                            < Field name={'innNumber'}
                                                    placeholder={'ИНН Компании'}
                                                    component={Input}
                                                    type={'input'}
                                                    resetFieldBy={form}
                                                    maskFormat={maskOnInputs.innNumber}
                                                    validate={composeValidators(required)}
                                            />
                                        }
                                        <Field name={'phoneNumber'}
                                               placeholder={'Контактный номер +7'}
                                               component={Input}
                                               resetFieldBy={form}
                                               maskFormat={maskOnInputs.phoneNumber}
                                               validate={composeValidators(required)}
                                        />
                                        {!isAvailableSMS && <Field name={'sms'}
                                                                   placeholder={'Пароль из sms'}
                                                                   component={Input}
                                                                   maskFormat={maskOnInputs.sms}
                                                                   disabled={!isAvailableSMS}
                                                                   validate={isAvailableSMS ? composeValidators(required) : undefined}
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
                                        />}
                                    </div>
                                    <div className={styles.loginForm__buttonsPanel}>
                                        <Button type={'submit'}
                                                disabled={submitting}
                                                colorMode={'green'}
                                                title={'Далее'}
                                                rounded
                                        />
                                    </div>
                                    {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                </form>
                            )
                        }/>
                    <div className={styles.loginForm__smallButton}>
                        <Button type={'button'}
                                title={!isRegisterMode ? 'Регистрация' : 'Назад'}
                                colorMode={'blue'}
                                onClick={registerHandleClick}
                                rounded
                        />
                    </div>
                </>}
        </div>
    )
}
