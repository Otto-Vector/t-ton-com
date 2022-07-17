import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {FORM_ERROR} from 'final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'

import {useDispatch, useSelector} from 'react-redux'
import {
    getInitialValuesAuthStore,
    getIsAuthAuthStore,
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

import {useNavigate} from 'react-router-dom';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllKPPSelectFromLocal} from '../../../selectors/dadata-reselect';
import {getOrganizationsByInn, getOrganizationsByInnKPP} from '../../../redux/dadata-response-reducer';


type OwnProps = {
    // onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = () => {

    const { options, requisites } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const [ isRegisterMode, setIsRegisterMode ] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isAuth = useSelector(getIsAuthAuthStore)


    const label = useSelector(getLabelAuthStore)
    const initialValues = useSelector(getInitialValuesAuthStore)
    const maskOn = useSelector(getMaskOnAuthStore)
    const validators = useSelector(getValidatorsAuthStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)

    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()

    const innValidate = async ( value: string ) => {
        const parsedValue = parseAllNumbers(value)
        const response = await dispatch<any>(getOrganizationsByInn({ inn: +parsedValue }))
        return response
    }

    const setOneOrganization = ( value: string ) => {
        console.log(value)
    }

    const onSubmit = async ( val: phoneSubmitType ) => { // при нажатии кнопки ДАЛЕЕ
        let innError, phoneError, loginError
        if (isRegisterMode) { // если РЕГИСТРАЦИЯ, то сначала проверяем ИНН на сущестование
            if (!isAvailableSMS) { // если SMS на регистрацию ещё не отослан
                innError = await dispatch<any>(getOrganizationsByInnKPP({
                    inn: +parseAllNumbers(val.innNumber),
                    kpp: +parseAllNumbers(val.kppNumber),
                }))
                if (innError) { // если ошибка, то выводим её в форму
                    dispatch(authStoreActions.setIsAvailableSMSRequest(false)) // блокируем ввод sms
                    return innError
                } else { // потом отправляем sms на регистрацию
                    phoneError = await dispatch<any>(sendCodeToPhone({
                        phone: val.phoneNumber as string, innNumber: parseAllNumbers(val.innNumber),
                    }))
                    if (phoneError) { // если возвращается ошибка по номеру телефона, выводим её в форму
                        dispatch(authStoreActions.setIsAvailableSMSRequest(false)) // блокируем ввод sms
                        return phoneError
                    }
                }
            } else { // если SMS отослан
                loginError = await dispatch<any>(
                    loginAuthorization({ phone: val.phoneNumber as string, password: val.sms as string }))
                if (loginError) {
                    return loginError
                }
            }

        }


        if (!isRegisterMode) { // если АВТОРИЗАЦИЯ
            if (isAuth) { // если уже авторизован, то просто перекидываем на НАСТРОЙКИ
                navigate(options)
            } else {

                loginError = await dispatch<any>(
                    loginAuthorization({ phone: val.phoneNumber as string, password: val.sms as string }))
                if (loginError) {
                    return loginError
                }
            }
        }

        return { [FORM_ERROR]: null }
    }

    const registerHandleClick = () => {
        setIsRegisterMode(!isRegisterMode)

        // dispatch(authStoreActions.setIsAvailableSMSRequest(isRegisterMode))
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
                                    <>
                                        <Field name={ 'innNumber' }
                                               placeholder={ label.innNumber }
                                               component={ FormInputType }
                                               resetFieldBy={ form }
                                               maskFormat={ maskOn.innNumber }
                                               validate={ async ( value ) => {
                                                   // расчищаем значения от лишних символов и пробелов после маски
                                                   const [ preValue, currentValue ] = [ form.getFieldState('innNumber')?.value, value ]
                                                       .map(val => parseAllNumbers(val) || undefined)
                                                   // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
                                                   if (currentValue && ( preValue !== currentValue ))
                                                       // запускаем асинхронную валидацию только после синхронной
                                                       return ( validators.innNumber && validators.innNumber(value) ) || await innValidate(value)
                                               } }

                                               disabled={ isAvailableSMS }
                                        />
                                        <FormSelector named={ 'kppNumber' }
                                                      placeholder={ label.kppNumber }
                                                      values={ kppSelect }
                                                      validate={ validators.kppNumber }
                                                      handleChanger={ setOneOrganization }

                                                      isClearable
                                        />
                                    </>
                                }
                                <Field name={ 'phoneNumber' }
                                       placeholder={ label.phoneNumber }
                                       component={ FormInputType }
                                       resetFieldBy={ form }
                                       allowEmptyFormatting
                                       maskFormat={ maskOn.phoneNumber }
                                       validate={ validators.phoneNumber }
                                       disabled={ isAvailableSMS }
                                />
                                <Field name={ 'sms' }
                                       placeholder={ label.sms }
                                       component={ FormInputType }
                                       maskFormat={ maskOn.sms }
                                       validate={ isAvailableSMS ? validators.sms : undefined }
                                >
                                    { !isRegisterMode && <div className={
                                        styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                        <Button type={ 'button' }
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
