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
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {AddDriverCardType, cargoType, EmployeesCardType} from '../../../types/form-types'

import {getInitialValuesAddDriverStore, getLabelAddDriverStore} from '../../../selectors/forms/add-driver-reselect';
import {FormSelector, SelectOptions, stringArrayToSelectValue} from '../../common/form-selector/form-selector';
import {randomDriverImage, randomTrailerImage, randomTruckImage} from '../../../api/randomImage';
import {
    getEmployeesOptionsStore,
    getTrailerOptionsStore,
    getTransportOptionsStore,
} from '../../../selectors/options/options-reselect';

type OwnProps = {
    // onSubmit: (requisites: employeesCardType) => void
}

export const AddDriversForm: React.FC<OwnProps> = () => {

    const header = 'Заявка ____ от __-__-____'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const label = useSelector(getLabelAddDriverStore)
    const initialValues = useSelector(getInitialValuesAddDriverStore)

    const employees: SelectOptions[] = useSelector(getEmployeesOptionsStore).content
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title } ))
    const transport: SelectOptions[] = useSelector(getTransportOptionsStore).content
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title } ))
    const trailer: SelectOptions[] = useSelector(getTrailerOptionsStore).content
        .map(( { id, title } ) => ( { key: id.toString(), value: id.toString(), label: title } ))


    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const onSubmit = ( values: AddDriverCardType ) => {
    }

    const onCancelClick = () => {
        navigate(-1)
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
                                ( { submitError, handleSubmit, pristine, form, submitting , values} ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.addDriversForm__form }>
                                        <div
                                            className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>{ label.driverFIO + ':' }</label>
                                                <FormSelector named={ 'driverFIO' }
                                                              placeholder={ 'Поиск водителя...' }
                                                              values={ employees }/>
                                            </div>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>{ label.driverTransport + ':' }</label>
                                                <FormSelector named={ 'driverTransport' }
                                                              placeholder={ 'Поиск транспорта...' }
                                                              values={ transport }/>
                                            </div>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>{ label.driverTrailer + ':' }</label>
                                                <FormSelector named={ 'driverTrailer' }
                                                              placeholder={ 'Поиск прицепа...' }
                                                              values={ trailer }/>
                                            </div>
                                        </div>
                                        <div className={ styles.addDriversForm__infoPanel }>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.driverStavka + ':' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { initialValues.driverStavka || 'в тн.км.' }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.driverSumm + ':' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { initialValues.driverSumm || 'за весь рейс' }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.driverRating + ':' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { initialValues.driverRating || '-' }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.driverTax + ':' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { initialValues.driverTax || '-' }
                                                </div>
                                            </div>
                                        </div>
                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                        <div className={ styles.addDriversForm__photoPanel }>

                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ values.driverFIO ? randomDriverImage(+values.driverFIO) : noImagePhoto }
                                                    alt="driverPhoto"/>
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ values.driverTransport ? randomTruckImage(+values.driverTransport) : noImagePhoto }
                                                    alt="driverTransportPhoto"/>
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ values.driverTrailer ? randomTrailerImage(+values.driverTrailer) : noImagePhoto }
                                                    alt="driverTrailerPhoto"/>
                                            </div>
                                        </div>

                                        <div className={ styles.addDriversForm__buttonsPanel }>
                                            <div className={ styles.addDriversForm__button }>
                                                <Button type={ 'submit' }
                                                        disabled={ submitting }
                                                        colorMode={ 'green' }
                                                        title={ 'Принять' }
                                                        rounded
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__button }>
                                                <Button type={ 'button' }
                                                        colorMode={ 'red' }
                                                        title={ 'Отказаться' }
                                                        onClick={()=>{onCancelClick()}}
                                                        rounded
                                                />
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
