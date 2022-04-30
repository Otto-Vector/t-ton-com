import React from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, maxLength11, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

import {useSelector} from 'react-redux';
import {getIsAvaliableSMSrequest, getIsFetchingAuth} from '../../../selectors/auth-reselect';
import {Preloader} from '../../common/Preloader/Preloader';


type phoneSubmitType = {
    phone: string | null,
    sms: number | null
}

type OwnProps = {
    onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ({onSubmit}) => {

    const isAvaliableSMS = useSelector(getIsAvaliableSMSrequest)
    const isFetching = useSelector(getIsFetchingAuth)

    const initialValues = {
        phone: '',
        sms: null
    } as phoneSubmitType


    return (
        <div className={styles.loginForm}>
            {isFetching ? <Preloader/> : <>
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
                                    // parse={formatString('9999')}

                                       validate={composeValidators(required, mustBeNumber)}
                                       children={<div className={styles.loginForm__smallButton+' '+styles.loginForm__smallButton_position}>
                                           <Button type={'button'}
                                                   disabled={isAvaliableSMS}
                                                   title={'Новый запрос на пароль из SMS'}
                                                   colorMode={'gray'}
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
