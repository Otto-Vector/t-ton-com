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
import {cargoConstType, propertyRights, TrailerCardType} from '../../../types/form-types'
import {
    getCurrentIdTrailerStore,
    getInitialValuesTrailerStore,
    getLabelTrailerStore,
    getMaskOnTrailerStore,
    getOneTrailerFromLocal,
    getParsersTrailerStore,
    getValidatorsTrailerStore,
} from '../../../selectors/options/trailer-reselect'
import {trailerStoreActions} from '../../../redux/options/trailer-store-reducer';
import {lightBoxStoreActions} from '../../../redux/lightbox-store-reducer';
import {AttachImageButton} from '../../common/attach-image-button/attach-image-button';


type OwnProps = {
    // onSubmit: (requisites: trailerCardType) => void
}


export const TrailerForm: React.FC<OwnProps> = () => {

    const header = 'Прицеп'
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const defaultInitialValues = useSelector(getInitialValuesTrailerStore)
    //для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelTrailerStore)
    const maskOn = useSelector(getMaskOnTrailerStore)
    const validators = useSelector(getValidatorsTrailerStore)
    const parsers = useSelector(getParsersTrailerStore)

    const currentId = useSelector(getCurrentIdTrailerStore)
    const oneTrailer = useSelector(getOneTrailerFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const setLightBoxImage = ( image?: string | null ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const onSubmit = ( values: TrailerCardType ) => {
        dispatch(trailerStoreActions.changeTrailer(currentId, values)) //сохраняем измененное значение
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        navigate(options)
    }
    const sendPhotoFile = ( event: ChangeEvent<HTMLInputElement> ) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    const trailerDeleteHandleClick = ( currentId: string ) => {
        dispatch(trailerStoreActions.deleteTrailer(currentId))
        navigate(options)
    }

    useEffect(() => {
            if (currentId === currentIdForShow) {
                setInitialValues(oneTrailer)
            } else {
                dispatch(trailerStoreActions.setCurrentId(currentIdForShow || ''))
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
                                ( {
                                      submitError,
                                      handleSubmit,
                                      pristine,
                                      form,
                                      submitting,
                                      values,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.transportTrailerForm__form }>
                                        <div className={ styles.transportTrailerForm__inputsPanel }>
                                            <Field name={ 'trailerNumber' }
                                                   placeholder={ label.trailerNumber }
                                                   maskFormat={ maskOn.trailerNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerNumber }
                                                   parse={ parsers.trailerNumber }
                                            />
                                            <Field name={ 'trailerTrademark' }
                                                   placeholder={ label.trailerTrademark }
                                                   maskFormat={ maskOn.trailerTrademark }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerTrademark }
                                                   parse={ parsers.trailerTrademark }
                                            />
                                            <Field name={ 'trailerModel' }
                                                   placeholder={ label.trailerModel }
                                                   maskFormat={ maskOn.trailerModel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerModel }
                                                   parse={ parsers.trailerModel }
                                            />
                                            <Field name={ 'pts' }
                                                   placeholder={ label.pts }
                                                   maskFormat={ maskOn.pts }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.pts }
                                                   parse={ parsers.pts }
                                            />
                                            <Field name={ 'dopog' }
                                                   placeholder={ label.dopog }
                                                   maskFormat={ maskOn.dopog }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dopog }
                                                   parse={ parsers.dopog }
                                            />

                                            <div className={ styles.transportTrailerForm__smallInput }>
                                                <FormSelector named={ 'cargoType' }
                                                              values={ stringArrayToSelectValue(cargoConstType.map(x => x)) }/>
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
                                                          values={ stringArrayToSelectValue(propertyRights.map(x => x)) }/>
                                        </div>
                                        <div>
                                            <div className={ styles.transportTrailerForm__photoWrapper }
                                                 title={ 'Добавить/изменить фото' }
                                            >
                                                <img src={ initialValues.trailerImage || noImageTrailer }
                                                     alt="uploadedPhoto"
                                                     onClick={ () => {
                                                         setLightBoxImage(values.trailerImage)
                                                     } }
                                                />
                                                <AttachImageButton onChange={ sendPhotoFile }/>
                                            </div>

                                            <div className={ styles.transportTrailerForm__buttonsPanel }>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'button' }
                                                            disabled={ submitting }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            onClick={ () => {
                                                                trailerDeleteHandleClick(currentId)
                                                            } }
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
