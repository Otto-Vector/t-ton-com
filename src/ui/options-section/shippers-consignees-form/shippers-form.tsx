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
import {ShippersCardType} from '../../../types/form-types'
import {
    getCurrentIdShipperStore,
    getInitialValuesShippersStore,
    getLabelShippersStore,
    getMaskOnShippersStore,
    getOneShipperFromLocal, getParsersShippersStore,
    getValidatorsShippersStore,
} from '../../../selectors/options/shippers-reselect'
import {shippersStoreActions} from '../../../redux/options/shippers-store-reducer'
import {toYandexMapLink, toYandexMapSreenshoot} from '../../../api/geolocation'
import {YandexMapToForm} from '../../common/yandex-map-component/yandex-map-component';
import {parseAllCoords, stringToCoords} from '../../../utils/parsers';


type OwnProps = {
    // onSubmit: (requisites: shippersCardType) => void
}


export const ShippersForm: React.FC<OwnProps> = () => {

    const header = 'Заказчики и Грузоотправители'
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const defaultInitialValues = useSelector(getInitialValuesShippersStore)
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelShippersStore)
    const maskOn = useSelector(getMaskOnShippersStore)
    const validators = useSelector(getValidatorsShippersStore)
    const parsers = useSelector(getParsersShippersStore)

    const currentId = useSelector(getCurrentIdShipperStore)
    const oneShipper = useSelector(getOneShipperFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: ShippersCardType ) => {
        dispatch(shippersStoreActions.changeShipper(currentId, values)) //сохраняем измененное значение
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const shipperDeleteHandleClick = () => {
        dispatch(shippersStoreActions.deleteShipper(currentId))
        navigate(options)
    }

    useEffect(() => {
            if (currentId === +( currentIdForShow || 0 )) {
                setInitialValues(oneShipper)
            } else {
                dispatch(shippersStoreActions.setCurrentId(+( currentIdForShow || 0 )))
            }
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
                                ( { submitError, hasValidationErrors, handleSubmit, form, submitting, values } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.shippersConsigneesForm__form }>
                                        <div
                                            className={ styles.shippersConsigneesForm__inputsPanel + ' ' + styles.shippersConsigneesForm__inputsPanel_titled }>
                                            <Field name={ 'title' }
                                                   placeholder={ label.title }
                                                   maskFormat={ maskOn.title }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.title }
                                                   parse={ parsers.title }
                                            />
                                        </div>
                                        <div className={ styles.shippersConsigneesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ maskOn.innNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.innNumber }
                                                   parse={ parsers.innNumber }
                                            />
                                            <Field name={ 'organizationName' }
                                                   placeholder={ label.organizationName }
                                                   maskFormat={ maskOn.organizationName }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.organizationName }
                                                   parse={ parsers.organizationName }
                                            />
                                            <Field name={ 'kpp' }
                                                   placeholder={ label.kpp }
                                                   maskFormat={ maskOn.kpp }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.kpp }
                                                   parse={ parsers.kpp }
                                            />
                                            <Field name={ 'ogrn' }
                                                   placeholder={ label.ogrn }
                                                   maskFormat={ maskOn.ogrn }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.ogrn }
                                                   parse={ parsers.ogrn }
                                            />
                                            <Field name={ 'address' }
                                                   placeholder={ label.address }
                                                   maskFormat={ maskOn.address }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.address }
                                                   parse={ parsers.address }
                                            />
                                            <Field name={ 'shipperFio' }
                                                   placeholder={ label.shipperFio }
                                                   maskFormat={ maskOn.shipperFio }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.shipperFio }
                                                   parse={ parsers.shipperFio }
                                            />
                                            <Field name={ 'shipperTel' }
                                                   placeholder={ label.shipperTel }
                                                   maskFormat={ maskOn.shipperTel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.shipperTel }
                                                   parse={ parsers.shipperTel }
                                                   allowEmptyFormatting
                                            />
                                            <div className={ styles.shippersConsigneesForm__textArea }>
                                                <Field name={ 'description' }
                                                       placeholder={ label.description }
                                                       maskFormat={ maskOn.description }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.description }
                                                       parse={ parsers.description }
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
                                                   parse={ parsers.coordinates }
                                            />

                                            <div className={ styles.shippersConsigneesForm__map+' '+
                                                styles.shippersConsigneesForm__mapImage}>
                                                {/*<a href={ toYandexMapLink(values.coordinates) }*/}
                                                {/*   target="_blank" rel="noopener noreferrer"*/}
                                                {/*   type={ 'button' }>*/}
                                                {/*    <img className={ styles.shippersConsigneesForm__mapImage }*/}
                                                {/*         src={ toYandexMapSreenshoot(values.coordinates) }*/}
                                                {/*         onError={ ( { currentTarget } ) => {*/}
                                                {/*             currentTarget.onerror = null; // prevents looping*/}
                                                {/*             currentTarget.src = mapImage*/}
                                                {/*         } }*/}
                                                {/*         alt="map"*/}
                                                {/*    />*/}
                                                {/*</a>*/}
                                            <YandexMapToForm
                                                center={stringToCoords(values.coordinates)}
                                            />
                                            </div>
                                            <div className={ styles.shippersConsigneesForm__buttonsPanel }>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || hasValidationErrors }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                        // onClick={()=>shipperSaveHandleClick()}
                                                    />
                                                </div>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <Button type={ 'button' }
                                                        // disabled={ true }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            rounded
                                                            onClick={ () => shipperDeleteHandleClick() }
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
