import React, {useEffect, useState} from 'react'
import styles from './auth-login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {FORM_ERROR, FormApi} from 'final-form'
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
    newPassword,
    sendCodeToPhone,
} from '../../../redux/auth-store-reducer'
import {oneRenderParser, parseAllNumbers, syncParsers} from '../../../utils/parsers'
import {PhoneSubmitType} from '../../../types/form-types'

import {useNavigate} from 'react-router-dom';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllKPPSelectFromLocal} from '../../../selectors/api/dadata-reselect';
import {daDataStoreActions, getOrganizationsByInnKPP} from '../../../redux/api/dadata-response-reducer';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';
import {FormSpySimple} from '../../common/form-spy-simple/form-spy-simple';
import {useInnPlusApiValidator} from '../../../use-hooks/useAsyncInnValidate';


type OwnProps = {}

export const AuthLoginForm: React.FC<OwnProps> = () => {

    const { options, requisites } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const [ isRegisterMode, setIsRegisterMode ] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)
    const isAuth = useSelector(getIsAuthAuthStore)
    const isFetching = useSelector(getIsFetchingAuth)

    const absoluteInitialValues = useSelector(getInitialValuesAuthStore)
    const [ localInitialValues, setLocalInitialValues ] = useState(absoluteInitialValues)

    const label = useSelector(getLabelAuthStore)
    const maskOn = useSelector(getMaskOnAuthStore)
    const validators = useSelector(getValidatorsAuthStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)

    const dispatch = useDispatch()

    // расчищаем значения от лишних символов и пробелов после маски
    const fromFormUnmaskedValues = ( values: PhoneSubmitType ): PhoneSubmitType => ( {
        innNumber: parseAllNumbers(values.innNumber) || undefined,
        kppNumber: values.kppNumber || undefined,
        phoneNumber: ( parseAllNumbers(values.phoneNumber) === '7' ) ? '' : values.phoneNumber,
        sms: parseAllNumbers(values.sms) || undefined,
    } )

    // сохраняем изменения формы в стейт редакса
    const formSpyChangeHandlerToLocalInit = ( values: PhoneSubmitType ) => {
        const [ unmaskedValues, unmaskedInitialValues ] = [ values, localInitialValues ].map(fromFormUnmaskedValues)
        if (!valuesAreEqual(unmaskedValues, unmaskedInitialValues)) {
            setLocalInitialValues(unmaskedInitialValues)
        }
    }

    // при нажатии кнопки ДАЛЕЕ
    const onSubmit = async ( { phoneNumber, innNumber, kppNumber, sms }: PhoneSubmitType ) => {
        const [ unmaskedInn, unmaskedKpp ] = [ innNumber, kppNumber ].map(parseAllNumbers)
        let innError, phoneError, loginError

        if (isRegisterMode) { // если РЕГИСТРАЦИЯ, то сначала проверяем ИНН на сущестование
            if (!isAvailableSMS) { // если SMS на регистрацию ещё не отослан
                innError = await dispatch<any>(getOrganizationsByInnKPP({ inn: unmaskedInn, kpp: unmaskedKpp }))
                if (innError) { // если ошибка, то выводим её в форму
                    dispatch(authStoreActions.setIsAvailableSMSRequest(false)) // блокируем ввод sms
                    return innError
                } else { // потом отправляем sms на регистрацию
                    phoneError = await dispatch<any>(sendCodeToPhone({
                        phone: phoneNumber as string,
                        kpp: unmaskedKpp,
                        innNumber: unmaskedInn,
                    }))
                    if (phoneError) { // если возвращается ошибка по номеру телефона, выводим её в форму
                        dispatch(authStoreActions.setIsAvailableSMSRequest(false)) // блокируем ввод sms
                        return phoneError
                    }
                }
            } else { // если SMS отослан
                loginError = await dispatch<any>(
                    loginAuthorization({ phone: phoneNumber as string, password: sms as string }),
                )
                if (loginError) {
                    return loginError
                } else {
                    navigate(requisites + 'new')
                }
            }
        }

        if (!isRegisterMode) { // если АВТОРИЗАЦИЯ
            if (isAuth) { // если уже авторизован, то просто перекидываем на НАСТРОЙКИ
                navigate(options)
            } else {
                loginError = await dispatch<any>(
                    loginAuthorization({ phone: phoneNumber as string, password: sms as string }))
                if (loginError) {
                    return loginError
                }
            }
        }
        return { [FORM_ERROR]: null }
    }

    const registerHandleClick = async ( form: FormApi<PhoneSubmitType> ) => {
        setIsRegisterMode(!isRegisterMode)
        dispatch(daDataStoreActions.setSuggectionsValues([]))
        dispatch(authStoreActions.setInitialValues({
            innNumber: '',
            kppNumber: '',
            phoneNumber: form.getState().values.phoneNumber,
            sms: '',
        }))
    }

    const newSMSCode = ( phone: string ) => {
        // сразу блокируем повторное нажание на 1 минуту
        dispatch<any>(fakeAuthFetching())
        dispatch<any>(newPassword({ phone }))
    }

    // синхронно/асинхронный валидатор на поле ИНН
    const innPlusApiValidator = useInnPlusApiValidator<PhoneSubmitType<string>>(
        dispatch, setLocalInitialValues, { kppNumber: '' } as PhoneSubmitType<string>
    )

    useEffect(() => {
        // присваивается автоматически значение из первого селектора
        if (kppSelect.length > 0) {
            const preKey = absoluteInitialValues.kppNumber + '' + absoluteInitialValues.innNumber
            // если предыдущий список селектора не совпадает с выбраным
            if (!kppSelect.find(( { key } ) => key === preKey)) {
                setLocalInitialValues({
                    ...localInitialValues,
                    kppNumber: kppSelect[0].value,
                })
            }
        }
    }, [ kppSelect ])

    return (
        <div className={ styles.loginForm }>
            <h4 className={ styles.loginForm__header }>{ isRegisterMode ? 'Регистрация' : 'Вход' }</h4>
            <Form
                onSubmit={ onSubmit }
                initialValues={ localInitialValues }
                // subscription={{ submitting: true, pristine: true, validating: true, valid: true }}
                render={
                    ( {
                          submitError,
                          handleSubmit,
                          hasValidationErrors,
                          form,
                          submitting,
                          values,
                          valid,
                      } ) => (
                        <form onSubmit={ handleSubmit }>
                            <FormSpySimple form={ form }
                                           onChange={ formSpyChangeHandlerToLocalInit }
                            />
                            <span className={ styles.onError }>{ submitError }</span>
                            <div className={ styles.loginForm__inputsPanel }>
                                { isRegisterMode &&
                                    <>
                                        <Field name={ 'innNumber' }
                                               placeholder={ label.innNumber }
                                               component={ FormInputType }
                                               resetFieldBy={ form }
                                               maskFormat={ maskOn.innNumber }
                                               validate={ form.getFieldState('innNumber')?.visited ? innPlusApiValidator(values as PhoneSubmitType<string>) : undefined }
                                               disabled={ isAvailableSMS }
                                        />
                                        <FormSelector named={ 'kppNumber' }
                                                      placeholder={ label.kppNumber }
                                                      values={ kppSelect }
                                                      validate={ validators.kppNumber }
                                                      disabled={ isAvailableSMS || kppSelect.length < 1 || !form.getFieldState('innNumber')?.valid }
                                                      errorTop
                                            // isClearable
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
                                       parse={ oneRenderParser(form, syncParsers.tel) }
                                       disabled={ isRegisterMode ? isAvailableSMS : false }
                                />
                                <Field name={ 'sms' }
                                       placeholder={ label.sms }
                                       component={ FormInputType }
                                       maskFormat={ maskOn.sms }
                                       validate={ !isRegisterMode || ( isRegisterMode && isAvailableSMS ) ? validators.sms : undefined }
                                       disabled={ isRegisterMode ? !isAvailableSMS : false }
                                >
                                    { !isRegisterMode && <div className={
                                        styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                        <Button type={ 'button' }
                                                title={ 'Новый запрос на пароль из SMS' }
                                                colorMode={ 'gray' }
                                                disabled={ !form.getFieldState('phoneNumber')?.valid || isFetching }
                                                onClick={ () => {
                                                    newSMSCode(values.phoneNumber as string)
                                                } }
                                                rounded
                                        >{ 'Новый пароль' }</Button>
                                    </div> }
                                </Field>
                            </div>
                            <div className={ styles.loginForm__buttonsPanel }>
                                <Button type={ 'submit' }
                                        disabled={ submitting || hasValidationErrors || isFetching ||
                                            ( !isRegisterMode && !form.getFieldState('phoneNumber')?.valid && !form.getFieldState('sms')?.valid ) }
                                        colorMode={ 'green' }
                                        title={ 'Далее' }
                                        rounded
                                >
                                    { isFetching && <Preloader/> }
                                </Button>
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                            <div className={ styles.loginForm__smallButton }>
                                <Button type={ 'button' }
                                        title={ !isRegisterMode ? 'Регистрация' : 'Назад' }
                                        colorMode={ 'blue' }
                                        onClick={ async () => {
                                            await registerHandleClick(form)
                                        } }
                                        rounded
                                />
                            </div>
                        </form>
                    )
                }/>
        </div>
    )
}
