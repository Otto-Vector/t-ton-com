import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {FORM_ERROR} from 'final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'

import {useDispatch, useSelector} from 'react-redux'
import {
    getInitialValuesAuthStore, getIsAvailablePhoneEdit,
    getIsAvailableSMSrequest,
    getIsFetchingAuth,
    getLabelAuthStore,
    getMaskOnAuthStore,
    getValidatorsAuthStore,
} from '../../../selectors/auth-reselect'
import {Preloader} from '../../common/preloader/preloader'
import {fakeAuthFetching, sendCodeToPhone} from '../../../redux/auth-store-reducer'
import {parseAllNumbers} from '../../../utils/parsers'
import {phoneSubmitType} from '../../../types/form-types'
import {getOrganizationByInn} from '../../../redux/options/requisites-store-reducer';
import {getInnErrorRequisitesStore} from '../../../selectors/options/requisites-reselect';


type OwnProps = {
    // onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = () => {

    const [ isRegisterMode, setIsRegisterMode ] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isAvailablePhoneEdit = useSelector(getIsAvailablePhoneEdit)

    const label = useSelector(getLabelAuthStore)
    const initialValues = useSelector(getInitialValuesAuthStore)
    const maskOn = useSelector(getMaskOnAuthStore)
    const validators = useSelector(getValidatorsAuthStore)

    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()


    const onSubmit = async ( val: phoneSubmitType ) => {
        let innError,phoneError
        if (isRegisterMode) {
            innError = await dispatch<any>(getOrganizationByInn({ inn: +parseAllNumbers(val.innNumber) }))
            if (innError) {
                return innError
            } else {
                phoneError = await dispatch<any>(sendCodeToPhone(val.phoneNumber as string))
                if (phoneError) {
                    return phoneError
                }
            }
        }
        return { [FORM_ERROR]: null }
    }

    const registerHandleClick = () => {
        setIsRegisterMode(!isRegisterMode)
    }

    const fakeFetch = () => {
        dispatch<any>(fakeAuthFetching())
    }


    return (
        <div className={ styles.loginForm }>
            { // установил прелоадер
                isFetching ? <Preloader/> : <>
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
                                            // validate={ isAvailableSMS ? validators.sms : undefined }
                                               children={ <div className={
                                                   styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                                   <Button type={ 'button' }
                                                       // disabled={ !isAvailableSMS }
                                                           title={ 'Новый запрос на пароль из SMS' }
                                                           colorMode={ 'gray' }
                                                           onClick={ fakeFetch }
                                                           rounded
                                                   >Новый пароль</Button>
                                               </div> }
                                        />
                                    </div>
                                    <div className={ styles.loginForm__buttonsPanel }>
                                        <Button type={ 'submit' }
                                                disabled={ submitting || hasValidationErrors }
                                                colorMode={ 'green' }
                                                title={ 'Далее' }
                                                rounded
                                        />
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
                </> }
        </div>
    )
}
