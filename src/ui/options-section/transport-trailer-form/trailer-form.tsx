import React, {ChangeEvent, useEffect, useState} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import noImageTrailer from '../../../media/noImageTrailer.png'
import {useDispatch, useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {cargoTypeType, propertyRights, TrailerCardType} from '../../../types/form-types'
import {
    getCurrentIdTrailerStore,
    getInitialValuesTrailerStore,
    getLabelTrailerStore,
    getMaskOnTrailerStore,
    getOneTrailerFromLocal,
    getValidatorsTrailerStore,
} from '../../../selectors/options/trailer-reselect'
import {trailerStoreActions} from '../../../redux/options/trailer-store-reducer';


type OwnProps = {
    // onSubmit: (requisites: trailerCardType) => void
}


export const TrailerForm: React.FC<OwnProps> = () => {

    const header = 'Прицеп'
    const isFetching = useSelector( getIsFetchingRequisitesStore )

    const label = useSelector( getLabelTrailerStore )
    const defaultInitialValues = useSelector(getInitialValuesTrailerStore)
    //для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const maskOn = useSelector( getMaskOnTrailerStore )
    const validators = useSelector( getValidatorsTrailerStore )
     const currentId = useSelector(getCurrentIdTrailerStore)
    const oneTrailer = useSelector(getOneTrailerFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()

    const { options } = useSelector( getRoutesStore )
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( value: TrailerCardType ) => {
    }
    const onCancelClick = () => {
        navigate( options )
    }
    const sendPhotoFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

     useEffect(() => {
            if (currentId === +( currentIdForShow || 0 )) {
                setInitialValues(oneTrailer)
            } else {
                dispatch(trailerStoreActions.setCurrentId(+( currentIdForShow || 0 )))
            }
        }, [ currentId, initialValues ],
    )

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
                                            <Field name={ 'trailerNumber' }
                                                   placeholder={ label.trailerNumber }
                                                   maskFormat={ maskOn.trailerNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerNumber }
                                            />
                                            <Field name={ 'trailerTrademark' }
                                                   placeholder={ label.trailerTrademark }
                                                   maskFormat={ maskOn.trailerTrademark }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerTrademark }
                                            />
                                            <Field name={ 'trailerModel' }
                                                   placeholder={ label.trailerModel }
                                                   maskFormat={ maskOn.trailerModel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerModel }
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
                                                <FormSelector named={ 'cargoType' }
                                                              values={ stringArrayToSelectValue(cargoTypeType.map(x=>x)) }/>
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
                                            <FormSelector named={ 'propertyRights' }
                                                          values={ stringArrayToSelectValue(propertyRights.map(x=>x)) }/>
                                        </div>
                                        <div>
                                            <div className={ styles.transportTrailerForm__photoWrapper }
                                                 title={ 'Добавить/изменить фото' }
                                            >
                                                <img src={ initialValues.trailerImage || noImageTrailer }
                                                     alt="uploadedPhoto"/>
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
