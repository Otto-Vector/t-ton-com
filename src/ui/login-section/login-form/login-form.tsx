import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../../../utils/validators'
import {Button} from '../../common/button/button'
import {Input} from '../../common/form-type/form-type'

import {useDispatch, useSelector} from 'react-redux'
import {getIsAvailableSMSrequest, getIsFetchingAuth} from '../../../selectors/auth-reselect'
import {Preloader} from '../../common/Preloader/Preloader'
import {fakeAuthFetching} from '../../../redux/auth-store-reducer'
import {parseAllNumbers} from '../../../utils/parsers'

type phoneSubmitType = {
    innNumber: string | null
    phoneNumber: string | null
    sms: string | null
}

type OwnProps = {
    // onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = ( ) => {

    const [ isRegisterMode, setIsRegisterMode ] = useState( false )
    const isAvailableSMS = useSelector( getIsAvailableSMSrequest )
    const isFetching = useSelector( getIsFetchingAuth )
    const dispatch = useDispatch()


    const onSubmit = ( val: phoneSubmitType ) => {
        for (let value in val) {
            console.log( value + ' = ' + parseAllNumbers( val[value as keyof phoneSubmitType] ) ) // убираем мусор после маски
        }
    }
    const registerHandleClick = () => {
        setIsRegisterMode( !isRegisterMode )
    }

    const fakeFetch = () => { // @ts-ignore
        dispatch( fakeAuthFetching() )
    }

    const initialValues = {
        innNumber: null,
        phoneNumber: null,
        sms: null,
    } as phoneSubmitType

    const maskOn = {
        innNumber: '########## ##',
        phoneNumber: '+7 (###) ###-##-##',
        sms: '#####',
    } as phoneSubmitType

    const validators = {
        innNumber: composeValidators( required, mustBe0_0Numbers( 10 )( 12 ) ),
        phoneNumber: composeValidators( required, mustBe00Numbers( 11 ) ),
        sms: composeValidators( required, mustBe00Numbers( 5 ) )
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
                            ( { submitError, handleSubmit, pristine, form, submitting } ) => (
                                <form onSubmit={ handleSubmit }>
                                    <div className={ styles.loginForm__inputsPanel }>
                                        { isRegisterMode &&
                                          < Field name={ 'innNumber' }
                                                  placeholder={ 'ИНН Компании' }
                                                  component={ Input }
                                                  resetFieldBy={ form }
                                                  maskFormat={ maskOn.innNumber }
                                                  validate={ validators.innNumber }
                                          />
                                        }
                                        <Field name={ 'phoneNumber' }
                                               placeholder={ 'Контактный номер +7' }
                                               component={ Input }
                                               resetFieldBy={ form }
                                               allowEmptyFormatting
                                               maskFormat={ maskOn.phoneNumber }
                                               validate={ validators.phoneNumber }
                                        />
                                        { !isAvailableSMS && <Field name={ 'sms' }
                                                                    placeholder={ 'Пароль из sms' }
                                                                    component={ Input }
                                                                    maskFormat={ maskOn.sms }
                                                                    disabled={ !isAvailableSMS }
                                                                    validate={ isAvailableSMS ? validators.sms : undefined }
                                                                    children={ <div className={
                                                                        styles.loginForm__smallButton + ' ' + styles.loginForm__smallButton_position }>
                                                                        <Button type={ 'button' }
                                                                                disabled={ !isAvailableSMS }
                                                                                title={ 'Новый запрос на пароль из SMS' }
                                                                                colorMode={ 'gray' }
                                                                                onClick={ fakeFetch }
                                                                                rounded
                                                                        >Новый пароль</Button>
                                                                    </div> }
                                        /> }
                                    </div>
                                    <div className={ styles.loginForm__buttonsPanel }>
                                        <Button type={ 'submit' }
                                                disabled={ submitting }
                                                colorMode={ 'green' }
                                                title={ 'Далее' }
                                                rounded
                                        />
                                    </div>
                                    {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/ }
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
