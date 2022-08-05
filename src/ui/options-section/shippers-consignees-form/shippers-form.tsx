import React, {useEffect, useState} from 'react'
import styles from './shippers-consignees-form.module.scss'
import {Field, Form} from 'react-final-form'

import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

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
    getOneShipperFromLocal,
    getParsersShippersStore,
    getValidatorsShippersStore,
} from '../../../selectors/options/shippers-reselect'
import {
    getOrganizationByInnShipper,
    modifyOneShipperToAPI,
    newShipperSaveToAPI,
    oneShipperDeleteToAPI,
    setOrganizationByInnKppShippers,
    shippersStoreActions,
} from '../../../redux/options/shippers-store-reducer'
import {parseAllNumbers, stringToCoords} from '../../../utils/parsers'
import {YandexMapToForm} from '../../common/yandex-map-component/yandex-map-component';
import {FormSpySimpleShippers} from '../../common/form-spy-simple/form-spy-simple';
import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllKPPSelectFromLocal} from '../../../selectors/dadata-reselect';
import {daDataStoreActions} from '../../../redux/dadata-response-reducer';
import {getGeoPositionAuthStore} from '../../../selectors/auth-reselect';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';

type OwnProps = {
    // onSubmit: (requisites: shippersCardType) => void
}


export const ShippersForm: React.FC<OwnProps> = () => {

    const header = 'Заказчики и Грузоотправители'
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const initialValues = useSelector(getInitialValuesShippersStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)
    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const [ isSelectorChange, setIsSelectorChange ] = useState(false)
    const [ isCoordsChange, setIsCoordsChange ] = useState(false)

    const label = useSelector(getLabelShippersStore)
    const maskOn = useSelector(getMaskOnShippersStore)
    const validators = useSelector(getValidatorsShippersStore)
    const parsers = useSelector(getParsersShippersStore)

    const localCoords = useSelector(getGeoPositionAuthStore)
    const currentId = useSelector(getCurrentIdShipperStore)
    const oneShipper = useSelector(getOneShipperFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdFromNavigate } = useParams<{ id: string | undefined }>()
    const isNew = currentIdFromNavigate === 'new'

    const fromFormDemaskedValues = ( values: ShippersCardType ) => ( {
        ...values,
        innNumber: parseAllNumbers(values.innNumber) || undefined,
        ogrn: parseAllNumbers(values.ogrn) || undefined,
        shipperTel: ( parseAllNumbers(values.shipperTel) === '7' ) ? '' : values.shipperTel,
    } )

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: ShippersCardType ) => {
        if (isNew) {
            // создаём нового
            dispatch<any>(newShipperSaveToAPI(values as ShippersCardType<string>))
        } else {
            // сохраняем измененное значение
            dispatch<any>(modifyOneShipperToAPI(values as ShippersCardType<string>))
        }
        // зачищаем поля
        dispatch(shippersStoreActions.setDefaultInitialValues())
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        dispatch(shippersStoreActions.setDefaultInitialValues())
        navigate(options)
    }

    const shipperDeleteHandleClick = () => {
        dispatch<any>(oneShipperDeleteToAPI(currentId))
        dispatch(shippersStoreActions.setDefaultInitialValues())
        navigate(options)
    }

    const getCoordinatesToInitial = ( coords: [ number, number ] ) => {
        dispatch(shippersStoreActions.setCoordinates(coords))
        setIsCoordsChange(true)
    }

    // онлайн валидация ИНН с подгрузкой КПП в селектор
    const innValidate = async ( value: string ) => {
        const parsedValue = parseAllNumbers(value)
        const response = await dispatch<any>(getOrganizationByInnShipper({ inn: +parsedValue }))
        return response
    }

    // автозаполнение полей при выборе селектора
    const setDataToForm = ( value: string | undefined ) => {
        if (value)
            dispatch<any>(setOrganizationByInnKppShippers({ kppNumber: value }))
        setIsSelectorChange(true)
    }

    // для синхры с redux стейтом
    const exposeValues = ( { values, valid }: { values: ShippersCardType, valid: boolean } ) => {
        const demaskedValues = fromFormDemaskedValues(values)
        if (!valuesAreEqual(demaskedValues, initialValues)) {
            if (!isSelectorChange && !isCoordsChange) {
                dispatch(shippersStoreActions.setInitialValues(demaskedValues))
            }
        }
        setIsSelectorChange(false)
        setIsCoordsChange(false)
    }


    useEffect(() => {
        if (isFirstRender) {
            if (isNew) {
                // зачищаем селектор при первом рендере
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // выставляем координаты геолокации
                dispatch(shippersStoreActions.setCoordinates(localCoords as [ number, number ]))
                setIsCoordsChange(true)
            }
            setIsFirstRender(false)
        }
    })

    useEffect(() => {
            if (!isNew) {
                if (currentId === currentIdFromNavigate) {
                    if (initialValues.coordinates === undefined) {
                        dispatch(shippersStoreActions.setInitialValues(oneShipper))
                    }
                } else {
                    dispatch(shippersStoreActions.setCurrentId(currentIdFromNavigate + ''))
                }
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
                                                   validate={ ( value ) => {
                                                       if (isNew) {
                                                           // расчищаем значения от лишних символов и пробелов после маски
                                                           const [ preValue, currentValue ] = [ form.getFieldState('innNumber')?.value, value ]
                                                               .map(val => parseAllNumbers(val) || undefined)
                                                           // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
                                                           if (currentValue && ( preValue !== currentValue ))
                                                               // запускаем асинхронную валидацию только после синхронной
                                                               return ( validators.innNumber && validators.innNumber(value) ) || innValidate(value)
                                                       }
                                                   } }
                                                   parse={ parsers.innNumber }
                                                   disabled={ !isNew }
                                            />
                                            { isNew
                                                ?
                                                <FormSelector named={ 'kpp' }
                                                              placeholder={ label.kpp }
                                                              values={ kppSelect }
                                                              validate={ validators.kpp }
                                                              handleChanger={ setDataToForm }
                                                              disabled={ ( kppSelect.length < 1 ) || !form.getFieldState('innNumber')?.valid }
                                                              errorTop
                                                              isClearable
                                                />
                                                :
                                                <Field name={ 'kpp' }
                                                       placeholder={ label.kpp }
                                                       maskFormat={ maskOn.kpp }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.kpp }
                                                       parse={ parsers.kpp }
                                                       disabled={ !isNew }
                                                />
                                            }
                                            <Field name={ 'organizationName' }
                                                   placeholder={ label.organizationName }
                                                   maskFormat={ maskOn.organizationName }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.organizationName }
                                                   parse={ parsers.organizationName }
                                            />
                                            <Field name={ 'ogrn' }
                                                   placeholder={ label.ogrn }
                                                   maskFormat={ maskOn.ogrn }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.ogrn }
                                                   parse={ parsers.ogrn }
                                                   disabled={ !isNew }
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

                                            <div className={ styles.shippersConsigneesForm__map + ' ' +
                                                styles.shippersConsigneesForm__mapImage }>
                                                <YandexMapToForm
                                                    center={ stringToCoords(values.coordinates) }
                                                    getCoordinates={ getCoordinatesToInitial }
                                                />
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
                                                            disabled={ isNew }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            rounded
                                                            onClick={ shipperDeleteHandleClick }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <FormSpySimpleShippers
                                            form={ form }
                                            onChange={ ( { values, valid } ) => {
                                                exposeValues({ values, valid })
                                            } }/>
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
