import React, {useState} from 'react'
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
import {parseAllNumbers} from '../../../utils/parsers'
import {PhoneSubmitType} from '../../../types/form-types'

import {useNavigate} from 'react-router-dom';
import {getRoutesStore} from '../../../selectors/routes-reselect';
import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllKPPSelectFromLocal} from '../../../selectors/api/dadata-reselect';
import {
    daDataStoreActions,
    getOrganizationsByInn,
    getOrganizationsByInnKPP,
} from '../../../redux/api/dadata-response-reducer';


type OwnProps = {}

export const AuthLoginForm: React.FC<OwnProps> = () => {

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

    // расчищаем значения от лишних символов и пробелов после маски
    // const fromFormDemaskedValues = ( values: PhoneSubmitType ): PhoneSubmitType => ( {
    //     ...values,
    //     innNumber: parseAllNumbers(values.innNumber) || undefined,
    //     phoneNumber: ( parseAllNumbers(values.phoneNumber) === '7' ) ? '' : values.phoneNumber,
    // } )

    // сохраняем изменения формы в стейт редакса
    // const formSpyChangeHandlerToLocalInit = ( values: PhoneSubmitType ) => {
    //     const [ demaskedValues, demaskedInitialValues ] = [ values, initialValues ].map(fromFormDemaskedValues)
    //     if (!valuesAreEqual(demaskedValues, demaskedInitialValues)) {
    //         console.log(demaskedValues)
    //         dispatch(authStoreActions.setInitialValues(demaskedValues))
    //     }
    // }

    // при нажатии кнопки ДАЛЕЕ
    const onSubmit = async ( { phoneNumber, innNumber, kppNumber, sms }: PhoneSubmitType ) => {
        const [ inn, kpp ] = [ innNumber, kppNumber ].map(parseAllNumbers)
        let innError, phoneError, loginError

        if (isRegisterMode) { // если РЕГИСТРАЦИЯ, то сначала проверяем ИНН на сущестование
            if (!isAvailableSMS) { // если SMS на регистрацию ещё не отослан
                innError = await dispatch<any>(getOrganizationsByInnKPP({ inn, kpp }))
                if (innError) { // если ошибка, то выводим её в форму
                    dispatch(authStoreActions.setIsAvailableSMSRequest(false)) // блокируем ввод sms
                    return innError
                } else { // потом отправляем sms на регистрацию
                    phoneError = await dispatch<any>(sendCodeToPhone({
                        phone: phoneNumber as string,
                        kpp,
                        innNumber: inn,
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
            phoneNumber: form.getState().values.phoneNumber,
            innNumber: '',
            kppNumber: '',
            sms: '',
        }))
        // await form.resetFieldState('sms')
        // await form.change('sms', '')
    }

    const newCode = ( phone: string ) => {
        // сразу блокируем повторное нажание на 1 минуту
        dispatch<any>(fakeAuthFetching())
        dispatch<any>(newPassword({ phone }))
    }

    // асинхронный валидатор ИНН через АПИ
    const innValidate = async ( value: string ) => {
        const parsedValue = parseAllNumbers(value)
        const response = await dispatch<any>(getOrganizationsByInn({ inn: +parsedValue }))
        return response
    }
    // синхронно/асинхронный валидатор на поле ИНН
    const innPlusApiValidator = ( preValues: PhoneSubmitType ) => ( currentValue: string ) => {
        const [ prev, current ] = [ preValues.innNumber, currentValue ].map(parseAllNumbers)


        // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
        if (current && ( prev !== current ))
            // запускаем асинхронную валидацию только после синхронной
            return ( validators.innNumber && validators.innNumber(current) ) || innValidate(current)
    }

    // useEffect(() => {
    //     // присваивается автоматически значение из первого селектора
    //     if (kppSelect.length > 0) {
    //         dispatch(authStoreActions.setInitialValues({
    //             ...initialValues,
    //             kppNumber: kppSelect[0].value,
    //         }))
    //     }
    // }, [ kppSelect ])

    return (
        <div className={ styles.loginForm }>

            <h4 className={ styles.loginForm__header }>{ isRegisterMode ? 'Регистрация' : 'Вход' }</h4>
            <Form
                onSubmit={ onSubmit }
                initialValues={ initialValues }

                render={
                    ( {
                          submitError,
                          handleSubmit,
                          hasValidationErrors,
                          form,
                          submitting,
                          values,
                      } ) => (
                        <form onSubmit={ handleSubmit }>
                            {/*<FormSpySimpleAnyKey form={ form }*/ }
                            {/*               onChange={ formSpyChangeHandlerToLocalInit }/>*/ }
                            <span className={ styles.onError }>{ submitError }</span>
                            <div className={ styles.loginForm__inputsPanel }>
                                { isRegisterMode &&
                                    <>
                                        <Field name={ 'innNumber' }
                                               placeholder={ label.innNumber }
                                               component={ FormInputType }
                                               resetFieldBy={ form }
                                               maskFormat={ maskOn.innNumber }
                                               validate={ innPlusApiValidator(values || '') }
                                               disabled={ isAvailableSMS }
                                        />
                                        <FormSelector named={ 'kppNumber' }
                                                      placeholder={ label.kppNumber }
                                                      values={ kppSelect }
                                                      validate={ validators.kppNumber }
                                                      disabled={ isAvailableSMS || kppSelect.length < 1 }
                                                      errorTop
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
                                       disabled={ isRegisterMode ? isAvailableSMS : false }
                                />
                                <Field name={ 'sms' }
                                       placeholder={ label.sms }
                                       component={ FormInputType }
                                       maskFormat={ maskOn.sms }
                                       validate={ isAvailableSMS ? validators.sms : undefined }
                                       disabled={ isRegisterMode ? !isAvailableSMS : false }
                                >
                                    { !isRegisterMode && <div className={
                                        styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                        <Button type={ 'button' }
                                                title={ 'Новый запрос на пароль из SMS' }
                                                colorMode={ 'gray' }
                                                disabled={ !form.getFieldState('phoneNumber')?.valid || isFetching }
                                                onClick={ () => {
                                                    newCode(values.phoneNumber as string)
                                                } }
                                                rounded
                                        >{ 'Новый пароль' }</Button>
                                    </div> }
                                </Field>
                            </div>
                            <div className={ styles.loginForm__buttonsPanel }>
                                <Button type={ 'submit' }
                                        disabled={ submitting || hasValidationErrors || isFetching }
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
