import React from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, minLength10, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

type phoneSubmitType = {
    phone: string,
    sms: number | null
}

type OwnProps = {
    onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ({onSubmit}) => {

    const initialValues = {
        phone: '+7',
        sms: null
    } as phoneSubmitType

    return (
        <div className={styles.loginForm}>
            <h4 className={styles.loginForm__header}>{'Вход'}</h4>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                render={
                    ({submitError, handleSubmit, pristine, form, submitting}) => (
                        <form onSubmit={handleSubmit}>
                            <Field name={'phone'}
                                   placeholder={'Контактный номер +7'}
                                   component={Input}
                                   resetFieldBy={form}
                                   type={'input'}
                                   validate={composeValidators(required, minLength10)}
                            />
                            <Field name={'sms'}
                                   placeholder={'Пароль из sms'}
                                   component={Input}
                                   type={'input'}
                                   // parse={formatString('9999')}
                                   validate={composeValidators(required, mustBeNumber)}
                            />
                            <div className={styles.buttonsPanel}>
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
        </div>
    )
}
