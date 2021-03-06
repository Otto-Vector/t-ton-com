import React, {useEffect, useState} from 'react'
import styles from './shippers-consignees-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import mapImage from '../../../media/mapsicle-map-text.jpg'
import {useDispatch, useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/options/requisites-reselect'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {ConsigneesCardType} from '../../../types/form-types'
import {
    getCurrentIdConsigneeStore,
    getInitialValuesConsigneesStore,
    getLabelConsigneesStore,
    getMaskOnConsigneesStore,
    getOneConsigneesFromLocal, getParsersConsigneesStore,
    getValidatorsConsigneesStore,
} from '../../../selectors/options/consignees-reselect'
import {consigneesStoreActions} from '../../../redux/options/consignees-store-reducer';
import {toYandexMapLink, toYandexMapSreenshoot} from '../../../api/geolocation';

type OwnProps = {
    // onSubmit: (requisites: consigneesCardType) => void
}


export const ConsigneesForm: React.FC<OwnProps> = () => {

    const header = 'ГрузоПолучатели'
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const defaultInitialValues = useSelector(getInitialValuesConsigneesStore)
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelConsigneesStore)
    const maskOn = useSelector(getMaskOnConsigneesStore)
    const validators = useSelector(getValidatorsConsigneesStore)
    const parsers = useSelector(getParsersConsigneesStore)

    const currentId = useSelector(getCurrentIdConsigneeStore)
    const oneConsignee = useSelector(getOneConsigneesFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()


    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: ConsigneesCardType ) => {
        dispatch(consigneesStoreActions.changeOneConsignee(currentId, values)) //сохраняем измененное значение
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const consigneeDeleteHandleClick = () => {
        dispatch(consigneesStoreActions.deleteConsignee(currentId))
        navigate(options)
    }

    useEffect(() => {
            if (currentId === +( currentIdForShow || 0 )) {
                setInitialValues(oneConsignee)
            } else {
                dispatch(consigneesStoreActions.setCurrentId(+( currentIdForShow || 0 )))
            }
            // debugger;
        }, [ currentId, initialValues ],
    )

    return (
        <div className={ styles.shippersConsigneesForm }>
            <div className={ styles.shippersConsigneesForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.shippersConsigneesForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( { submitError, hasValidationErrors, handleSubmit, values, form, submitting } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.shippersConsigneesForm__form }>
                                        <div
                                            className={ styles.shippersConsigneesForm__inputsPanel + ' ' + styles.shippersConsigneesForm__inputsPanel_titled }>
                                            <Field name={ 'title' }
                                                   placeholder={ label.title }
                                                   maskFormat={ maskOn.title }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.title }
                                                   parse={parsers.title}
                                            />
                                        </div>
                                        <div className={ styles.shippersConsigneesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ maskOn.innNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.innNumber }
                                                   parse={parsers.innNumber}
                                            />
                                            <Field name={ 'organizationName' }
                                                   placeholder={ label.organizationName }
                                                   maskFormat={ maskOn.organizationName }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.organizationName }
                                                   parse={parsers.organizationName}
                                            />
                                            <Field name={ 'kpp' }
                                                   placeholder={ label.kpp }
                                                   maskFormat={ maskOn.kpp }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.kpp }
                                                   parse={parsers.kpp}
                                            />
                                            <Field name={ 'ogrn' }
                                                   placeholder={ label.ogrn }
                                                   maskFormat={ maskOn.ogrn }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.ogrn }
                                                   parse={parsers.ogrn}
                                            />
                                            <Field name={ 'address' }
                                                   placeholder={ label.address }
                                                   maskFormat={ maskOn.address }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.address }
                                                   parse={parsers.address}
                                            />
                                            <Field name={ 'consigneesFio' }
                                                   placeholder={ label.consigneesFio }
                                                   maskFormat={ maskOn.consigneesFio }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.consigneesFio }
                                                   parse={parsers.consigneesFio}
                                            />
                                            <Field name={ 'consigneesTel' }
                                                   placeholder={ label.consigneesTel }
                                                   maskFormat={ maskOn.consigneesTel }
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.consigneesTel }
                                                   parse={parsers.consigneesTel}
                                            />
                                            <div className={ styles.shippersConsigneesForm__textArea }>
                                                <Field name={ 'description' }
                                                       placeholder={ label.description }
                                                       maskFormat={ maskOn.description }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={validators.description}
                                                       parse={parsers.description}
                                                       textArea
                                                />
                                            </div>
                                        </div>
                                        <div className={ styles.shippersConsigneesForm__inputsPanel }>
                                            <Field name={ 'coordinates' }
                                                   placeholder={ label.coordinates }
                                                   maskFormat={ maskOn.coordinates }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.coordinates }
                                                   parse={parsers.coordinates}
                                            />
                                            <div className={ styles.shippersConsigneesForm__map }>
                                                <a href={ toYandexMapLink(values.coordinates) }
                                                   target="_blank" rel="noopener noreferrer"
                                                   type={ 'button' }>
                                                    <img className={ styles.shippersConsigneesForm__mapImage }
                                                         src={ toYandexMapSreenshoot(values.coordinates) }
                                                         onError={ ( { currentTarget } ) => {
                                                             currentTarget.onerror = null; // prevents looping
                                                             currentTarget.src = mapImage
                                                         } }
                                                         alt="map"
                                                    />
                                                </a>
                                            </div>
                                            <div className={ styles.shippersConsigneesForm__buttonsPanel }>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || hasValidationErrors }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                    />
                                                </div>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <Button type={ 'button' }
                                                        // disabled={ true }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            onClick={ () => consigneeDeleteHandleClick() }
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
