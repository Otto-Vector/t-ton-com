import React, {ChangeEvent} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import noImageTransport from '../../../media/noImageTransport.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector} from '../../common/form-selector/form-selector'
import {InfoText} from '../common-forms/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {cargoType, propertyRights, TransportCardType} from '../../../types/form-types'
import {
    getInitialValuesTranstportStore, getLabelTranstportStore, getMaskOnTranstportStore,
    getValidatorsTranstportStore
} from '../../../selectors/options/transport-reselect'


type OwnProps = {
    // onSubmit: (requisites: transportCardType) => void
}


export const TransportForm: React.FC<OwnProps> = () => {

    const header = 'Транспорт'
    const isFetching = useSelector( getIsFetchingRequisitesStore )

    const label = useSelector( getLabelTranstportStore )
    const initialValues = useSelector( getInitialValuesTranstportStore )
    const maskOn = useSelector( getMaskOnTranstportStore )
    const validators = useSelector( getValidatorsTranstportStore )

    const { options } = useSelector( getRoutesStore )
    const navigate = useNavigate()

    const onSubmit = ( values: TransportCardType ) => {
    }

    const onCancelClick = () => {
        navigate( options )
    }

    const sendPhotoFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    // const dispatch = useDispatch()
    // const employeeSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    return (
        <div className={ styles.transportTrailerForm }>
            <div className={ styles.transportTrailerForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.transportTrailerForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { submitError, handleSubmit, pristine, form, submitting } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.transportTrailerForm__form }>
                                        <div className={ styles.transportTrailerForm__inputsPanel }>
                                            <Field name={ 'transportNumber' }
                                                   placeholder={ label.transportNumber }
                                                   maskFormat={ maskOn.transportNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportNumber }
                                            />
                                            <Field name={ 'transportTrademark' }
                                                   placeholder={ label.transportTrademark }
                                                   maskFormat={ maskOn.transportTrademark }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportTrademark }
                                            />
                                            <Field name={ 'transportModel' }
                                                   placeholder={ label.transportModel }
                                                   maskFormat={ maskOn.transportModel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportModel }
                                            />
                                            <Field name={ 'pts' }
                                                   placeholder={ label.pts }
                                                   maskFormat={ maskOn.pts }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.pts }
                                            />
                                            <Field name={ 'dopog' }
                                                   placeholder={ label.dopog }
                                                   maskFormat={ maskOn.dopog }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dopog }
                                            />

                                            <div className={ styles.transportTrailerForm__smallInput }>
                                                <FormSelector named={ 'cargoType' } values={ cargoType }/>
                                            </div>
                                            <div className={ styles.transportTrailerForm__smallInput }>
                                                <Field name={ 'cargoWeight' }
                                                       placeholder={ label.cargoWeight }
                                                       maskFormat={ maskOn.cargoWeight }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.cargoWeight }
                                                />
                                            </div>
                                            <FormSelector named={ 'propertyRights' } values={ propertyRights }/>
                                        </div>
                                        <div>
                                            <div className={ styles.transportTrailerForm__photoWrapper }
                                                 title={ 'Добавить/изменить фото транспорта' }
                                            >
                                                <img src={ initialValues.transportImage || noImageTransport }
                                                     alt="transportPhoto"/>
                                                <input type={ 'file' }
                                                       className={ styles.transportTrailerForm__hiddenAttachFile }
                                                       accept={ '.png, .jpeg, .pdf, .jpg' }
                                                       onChange={ sendPhotoFile }
                                                />
                                            </div>

                                            <div className={ styles.transportTrailerForm__buttonsPanel }>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'button' }
                                                            disabled={ true }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            rounded
                                                    />
                                                </div>
                                                <div className={ styles.transportTrailerForm__button }>
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
                <InfoText/>
            </div>
        </div>
    )
}
