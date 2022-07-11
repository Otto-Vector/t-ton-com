import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {FORM_ERROR} from 'final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'

import {useDispatch, useSelector} from 'react-redux'
import {
    getInitialValuesAuthStore, getIsAuthAuthStore, getIsAvailablePhoneEdit,
    getIsAvailableSMSrequest,
    getIsFetchingAuth,
    getLabelAuthStore,
    getMaskOnAuthStore,
    getValidatorsAuthStore,
} from '../../../selectors/auth-reselect'
import {Preloader} from '../../common/preloader/preloader'
import {
    authStoreActions,
    fakeAuthFetching,
    loginAuthorization,
    sendCodeToPhone,
} from '../../../redux/auth-store-reducer'
import {parseAllNumbers} from '../../../utils/parsers'
import {phoneSubmitType} from '../../../types/form-types'
import {getOrganizationByInn} from '../../../redux/options/requisites-store-reducer';


type OwnProps = {
    // onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = () => {

    const [ isRegisterMode, setIsRegisterMode ] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isAvailablePhoneEdit = useSelector(getIsAvailablePhoneEdit)
    const isAuth = useSelector(getIsAuthAuthStore)

    const label = useSelector(getLabelAuthStore)
    const initialValues = useSelector(getInitialValuesAuthStore)
    const maskOn = useSelector(getMaskOnAuthStore)
    const validators = useSelector(getValidatorsAuthStore)

    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()


    const onSubmit = async ( val: phoneSubmitType ) => {
        let innError, phoneError, loginError
        if (isRegisterMode) {
            innError = await dispatch<any>(getOrganizationByInn({ inn: +parseAllNumbers(val.innNumber) }))
            if (innError) {
                return innError
            } else {
                phoneError = await dispatch<any>(sendCodeToPhone(val.phoneNumber as string))
                if (phoneError) {
                    return phoneError
                } else {

                }
            }
            if (isAvailableSMS) {
                // loginError = await dispatch<any>(sendCodeToPhone(val.phoneNumber as string))
            }
        }
        if (!isRegisterMode) {
            if (isAuth) {
                // dispatch<any>(getPersonalReqisites())
                const myHeaders = new Headers();
                myHeaders.append('Cookie', 'session=79386930727; sessionid=t7wxneki0syaiyq5wqd94jxefefrhuhu; userid=30672918-39e6-44f9-b8be-eedfa9c99fc7');

                const formdata = new FormData();

                const requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formdata,
                    redirect: 'follow',
                    mode: 'cors',
                } as RequestInit;

                fetch('http://185.46.11.30:8000/api/me/', requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
            } else {

                loginError = await dispatch<any>(
                    loginAuthorization({ phone: val.phoneNumber as string, password: val.sms as string }))
                if (loginError) {
                    return loginError
                }
            }
        }
        dispatch(authStoreActions.setIsAuth(true))
        return { [FORM_ERROR]: null }
    }

    const registerHandleClick = () => {
        setIsRegisterMode(!isRegisterMode)

        dispatch(authStoreActions.setIsAvailableSMSRequest(isRegisterMode))
    }

    const fakeFetch = () => {
        dispatch<any>(fakeAuthFetching())
    }


    return (
        <div className={ styles.loginForm }>

            <h4 className={ styles.loginForm__header }>{ isRegisterMode ? 'Регистрация' : 'Вход' }</h4>
            <Form
                onSubmit={ onSubmit }
                initialValues={ initialValues }

                render={
                    ( {
                          errors,
                          submitError,
                          handleSubmit,
                          hasValidationErrors,
                          pristine,
                          form,
                          submitting,
                      } ) => (
                        <form onSubmit={ handleSubmit }>
                            <span className={ styles.onError }>{ submitError }</span>
                            <div className={ styles.loginForm__inputsPanel }>
                                { isRegisterMode &&
                                    <Field name={ 'innNumber' }
                                           placeholder={ label.innNumber }
                                           component={ FormInputType }
                                           resetFieldBy={ form }
                                           maskFormat={ maskOn.innNumber }
                                           validate={ validators.innNumber }
                                    />
                                }
                                <Field name={ 'phoneNumber' }
                                       placeholder={ label.phoneNumber }
                                       component={ FormInputType }
                                       resetFieldBy={ form }
                                       allowEmptyFormatting
                                       maskFormat={ maskOn.phoneNumber }
                                       validate={ validators.phoneNumber }
                                    // disabled={isRegisterMode ? isAvailablePhoneEdit: false}
                                />
                                <Field name={ 'sms' }
                                       placeholder={ label.sms }
                                       component={ FormInputType }
                                       maskFormat={ maskOn.sms }
                                       disabled={ isRegisterMode ? !isAvailableSMS : false }
                                       validate={ !isAvailableSMS ? validators.sms : undefined }
                                >
                                    { !isRegisterMode && <div className={
                                        styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                        <Button type={ 'button' }
                                            // disabled={ !isAvailableSMS }
                                                title={ 'Новый запрос на пароль из SMS' }
                                                colorMode={ 'gray' }
                                                onClick={ fakeFetch }
                                                rounded
                                        >Новый пароль</Button>
                                    </div> }
                                </Field>
                            </div>
                            <div className={ styles.loginForm__buttonsPanel }>
                                <Button type={ 'submit' }
                                        disabled={ submitting || hasValidationErrors }
                                        colorMode={ 'green' }
                                        title={ 'Далее' }
                                        rounded
                                >
                                    { isFetching && <Preloader/> }
                                </Button>
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                        </form>
                    )
                }/>
            <div className={ styles.loginForm__smallButton }>
                <Button type={ 'button' }
                        title={ !isRegisterMode ? 'Регистрация' : 'Назад' }
                        colorMode={ 'blue' }
                        onClick={ registerHandleClick }
                        rounded
                />
            </div>

        </div>
    )
}
