import React, {useState} from 'react'
import styles from './login-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'

import {useDispatch, useSelector} from 'react-redux'
import {
    getInitialValuesAuthStore,
    getIsAvailableSMSrequest,
    getIsFetchingAuth,
    getLabelAuthStore,
    getMaskOnAuthStore,
    getValidatorsAuthStore,
} from '../../../selectors/auth-reselect'
import {Preloader} from '../../common/preloader/preloader'
import {fakeAuthFetching} from '../../../redux/auth-store-reducer'
import {parseAllNumbers} from '../../../utils/parsers'
import {phoneSubmitType} from '../../../types/form-types'
import {getOrganizationByInn} from '../../../redux/options/requisites-store-reducer';


type OwnProps = {
    // onSubmit: (login: phoneSubmitType) => void
}

export const LoginForm: React.FC<OwnProps> = () => {

    const [ isRegisterMode, setIsRegisterMode ] = useState(false)
    const isAvailableSMS = useSelector(getIsAvailableSMSrequest)

    const label = useSelector(getLabelAuthStore)
    const initialValues = useSelector(getInitialValuesAuthStore)
    const maskOn = useSelector(getMaskOnAuthStore)
    const validators = useSelector(getValidatorsAuthStore)

    const isFetching = useSelector(getIsFetchingAuth)
    const dispatch = useDispatch()


    const onSubmit = ( val: phoneSubmitType ) => {
        dispatch<any>(getOrganizationByInn({ inn: +parseAllNumbers(val.innNumber) }))
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
                            ( { submitError, handleSubmit, pristine, form, submitting } ) => (
                                <form onSubmit={ handleSubmit }>
                                    <div className={ styles.loginForm__inputsPanel }>
                                        { isRegisterMode &&
                                            < Field name={ 'innNumber' }
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
                                        />
                                        { !isAvailableSMS && <Field name={ 'sms' }
                                                                    placeholder={ label.sms }
                                                                    component={ FormInputType }
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
