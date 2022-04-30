import React, {useState} from 'react'
import styles from './register-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, minLength11, mustBe12, mustBeNumber, required} from '../../../utils/validators';
import {Button} from '../../common/button/button';
import {Input} from '../../common/form-type/form-type';

import {Preloader} from '../../common/Preloader/Preloader';


type companySubmitType = {
    innNumber: string | null,
    phoneNumber: number | null
}

type OwnProps = {
    onSubmit: (register: companySubmitType) => void
}

export const RegisterForm: React.FC<OwnProps> = ({onSubmit}) => {

    const [isFetching, setIsFetching] = useState(false);

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
                                               component={Input}
                                               type={'input'}
                                               resetFieldBy={form}
                                            // parse={formatString('9999')}
                                               validate={composeValidators(required, mustBeNumber, mustBe12)}
                                        />
                                        <Field name={'phone'}
                                               placeholder={'Контактный номер +7'}
                                               component={Input}
                                               resetFieldBy={form}
                                               type={'input'}
                                            // parse={normalizePhoneNumber}
                                               validate={composeValidators(required)}
                                        />
                                    </div>
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
