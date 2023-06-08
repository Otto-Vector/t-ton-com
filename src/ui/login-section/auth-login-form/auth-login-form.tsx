import React, {useEffect, useMemo, useState} from 'react'
import styles from './auth-login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {FORM_ERROR, FormApi} from 'final-form'
import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'

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
import {Preloader} from '../../common/tiny/preloader/preloader'
import {
    authStoreActions,
    fakeAuthFetching,
    loginAuthorization,
    newPassword,
    sendCodeToPhone,
} from '../../../redux/auth-store-reducer'
import {oneRenderParser, parseAllNumbers, syncParsers} from '../../../utils/parsers'
import {PhoneSubmitType} from '../../../types/form-types'

import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector} from '../../common/inputs/final-form-inputs/form-selector/form-selector'
import {getAllKPPSelectFromLocal} from '../../../selectors/api/dadata-reselect'
import {daDataStoreActions, getOrganizationsByInnKPP} from '../../../redux/api/dadata-response-reducer'
import {useInnPlusApiValidator} from '../../../use-hooks/useAsyncInnValidate'
import createDecorator from 'final-form-focus'


type OwnProps = {}

export const AuthLoginForm: React.ComponentType<OwnProps> = () => {

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
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])

    const dispatch = useDispatch()

    // при нажатии кнопки ДАЛЕЕ
    const onSubmit = async ( { phoneNumber, innNumber, kppNumber, sms }: PhoneSubmitType ) => {
        const [ unmaskedInn, unmaskedKpp ] = [ innNumber, kppNumber ].map(parseAllNumbers)
        let innError, phoneError, loginError

        if (isRegisterMode) { // если РЕГИСТРАЦИЯ,
            if (!isAvailableSMS) { // если SMS на регистрацию ещё не отослан,
                // то сначала проверяем ИНН на сущестование
                innError = await dispatch<any>(getOrganizationsByInnKPP({ inn: unmaskedInn, kpp: unmaskedKpp }))
                if (innError) { // если ошибка, (ИНН не существует, не найден)
                    // блокируем ввод sms
                    dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                    // выводим ошибку в форму
                    return innError
                } else { // если организация существует, отправляем sms на регистрацию
                    phoneError = await dispatch<any>(sendCodeToPhone({
                        phone: phoneNumber as string,
                        kpp: unmaskedKpp,
                        innNumber: unmaskedInn,
                    }))
                    if (phoneError) { // если возвращается ошибка по номеру телефона,
                        // блокируем ввод sms,
                        dispatch(authStoreActions.setIsAvailableSMSRequest(false))
                        // выводим её в форму
                        return phoneError
                    }
                }
            } else { // если SMS на авторизацию отослан,
                // логинимся
                loginError = await dispatch<any>(
                    loginAuthorization({ phone: phoneNumber as string, password: sms as string }),
                )
                if (loginError) {
                    // выводим ошибку в форму
                    return loginError
                } else {
                    // всё ок?, переходим к окну заполнения реквизитов
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

    // кнопка смены режимов авторизации с зачисткой
    const registerHandleClick = ( form: FormApi<PhoneSubmitType> ) => {
        setIsRegisterMode(!isRegisterMode)
        dispatch(daDataStoreActions.setSuggectionsValues([]))
        setLocalInitialValues({
            innNumber: '',
            kppNumber: '',
            phoneNumber: form.getState().values.phoneNumber,
            sms: '',
        })
        // перезапускаем форму для обновления значений
        form.restart()
    }

    const newSMSCode = ( phone: string ) => {
        // сразу блокируем повторное нажание на 1 минуту
        dispatch<any>(fakeAuthFetching())
        dispatch<any>(newPassword({ phone }))
    }

    // синхронно/асинхронный валидатор на поле ИНН
    const innPlusApiValidator = useInnPlusApiValidator<PhoneSubmitType<string>>(
        dispatch, authStoreActions.setInitialValues, { kppNumber: '' } as PhoneSubmitType<string>,
    )

    // дефолтное значение для селектора
    const [ defaultSelect, setDefaultSelect ] = useState<string>()
    // состояние необходимости активации дефолтного значения
    const [ isDefaultSelect, setIsDefaultSelect ] = useState(true)

    useEffect(() => { // присваивается автоматически значение из первого селектора
        if (kppSelect.length > 0) {
            const preKey = absoluteInitialValues.kppNumber + '' + absoluteInitialValues.innNumber
            // если предыдущий список селектора не совпадает с выбраным
            if (!kppSelect.find(( { key } ) => key === preKey)) {
                setDefaultSelect(isDefaultSelect ? kppSelect[0].value : '')
            }
        } else { // если список пустой, приготовиться к присвоению дефолтного значения в селектор
            setIsDefaultSelect(true)
        }
    }, [ kppSelect, isDefaultSelect ])

    return (
        <div className={ styles.loginForm }>
            <h4 className={ styles.loginForm__header }>{ isRegisterMode ? 'Регистрация' : 'Вход' }</h4>
            <Form
                onSubmit={ onSubmit }
                initialValues={ localInitialValues }
                //@ts-ignore-next-line
                decorators={ [ focusOnError ] }
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
                                        <FormSelector nameForSelector={ 'kppNumber' }
                                                      placeholder={ label.kppNumber }
                                                      options={ kppSelect }
                                                      validate={ validators.kppNumber }
                                                      defaultValue={ defaultSelect }
                                                      handleChanger={ () => {
                                                          // сброс активности дефолтного селектора при первом же выборе
                                                          setIsDefaultSelect(false)
                                                      } }
                                                      disabled={ isAvailableSMS || kppSelect.length < 1 || !form.getFieldState('innNumber')?.valid }
                                                      errorTop
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
                                        <ProjectButton type={ 'button' }
                                                       title={ 'Новый запрос на пароль из SMS' }
                                                       colorMode={ 'gray' }
                                                       disabled={ !form.getFieldState('phoneNumber')?.valid || isFetching }
                                                       onClick={ () => {
                                                    newSMSCode(values.phoneNumber as string)
                                                } }
                                                       rounded
                                        >{ 'Новый пароль' }</ProjectButton>
                                    </div> }
                                </Field>
                            </div>
                            <div className={ styles.loginForm__buttonsPanel }>
                                <ProjectButton type={ 'submit' }
                                               disabled={ submitting || isFetching ||
                                            ( !isRegisterMode && !form.getFieldState('phoneNumber')?.valid && !form.getFieldState('sms')?.valid ) }
                                               colorMode={ 'green' }
                                               title={ 'Далее' }
                                               rounded
                                >
                                    { isFetching && <Preloader/> }
                                </ProjectButton>
                            </div>
                            { submitError && <span className={ styles.onError }>{ submitError }</span> }
                            <div className={ styles.loginForm__smallButton }>
                                <ProjectButton type={ 'button' }
                                               title={ !isRegisterMode ? 'Регистрация' : 'Назад' }
                                               colorMode={ 'blue' }
                                               onClick={ () => {
                                            registerHandleClick(form)
                                        } }
                                               rounded
                                />
                            </div>
                            {/*<FormSpySimple form={ form }*/ }
                            {/*               onChange={ formSpyChangeHandlerToLocalInit }*/ }
                            {/*               // isOnActiveChange*/ }
                            {/*/>*/ }
                        </form>
                    )
                }/>
        </div>
    )
}
