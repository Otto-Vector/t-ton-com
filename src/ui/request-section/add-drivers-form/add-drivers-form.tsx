import React, {ChangeEvent} from 'react'
import styles from './add-drivers-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import noImagePhoto from '../../../media/noImagePhoto2.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {parseFIO} from '../../../utils/parsers'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {cargoType, EmployeesCardType} from '../../../types/form-types'
import {
    getInitialValuesEmployeesStore,
    getLabelEmployeesStore,
    getMaskOnEmployeesStore,
    getValidatorsEmployeesStore,
} from '../../../selectors/options/employees-reselect'
import {InfoText} from '../../options-section/common-forms/info-text/into-text';
import {getInitialValuesAddDriverStore, getLabelAddDriverStore} from '../../../selectors/forms/add-driver-reselect';
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector';

type OwnProps = {
    // onSubmit: (requisites: employeesCardType) => void
}

export const AddDriversForm: React.FC<OwnProps> = () => {

    const header = 'Заявка ____ от __-__-____'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const label = useSelector(getLabelAddDriverStore)
    const initialValues = useSelector(getInitialValuesAddDriverStore)


    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const onSubmit = ( values: EmployeesCardType ) => {
    }

    const onCancelClick = () => {
        navigate(options)
    }

    // const dispatch = useDispatch()
    // const employeeSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    return (
        <div className={ styles.addDriversForm }>
            <div className={ styles.addDriversForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.addDriversForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { submitError, handleSubmit, pristine, form, submitting } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.addDriversForm__form }>
                                        <div
                                            className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                                            <div className={ styles.addDriversForm__selector }>
                                                <FormSelector named={ 'cargoType' }
                                                              values={ stringArrayToSelectValue(cargoType.map(x=>x)) }/>
                                            </div>
                                        </div>

                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                        <div className={ styles.addDriversForm__photoPanel }>

                                            <div className={ styles.addDriversForm__photo }>
                                                <img src={ initialValues.driverPhoto || noImagePhoto }
                                                     alt="driverPhoto"/>
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img src={ initialValues.driverTransportPhoto || noImagePhoto }
                                                     alt="driverTransportPhoto"/>
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img src={ initialValues.driverTrailerPhoto || noImagePhoto }
                                                     alt="driverTrailerPhoto"/>
                                            </div>

                                            <div className={ styles.addDriversForm__buttonsPanel }>
                                                <div className={ styles.addDriversForm__button }>
                                                    <Button type={ 'button' }
                                                            disabled={ true }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            rounded
                                                    />
                                                </div>
                                                <div className={ styles.addDriversForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/ }
                                    </form>
                                )
                            }/>

                    </> }

                <CancelButton onCancelClick={ onCancelClick }/>
            </div>
        </div>
    )
}
