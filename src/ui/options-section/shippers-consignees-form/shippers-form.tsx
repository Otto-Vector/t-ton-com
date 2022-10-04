import React, {useEffect, useState} from 'react'
import styles from './shippers-consignees-form.module.scss'
import {Field, Form} from 'react-final-form'

import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'

import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {ShippersCardType} from '../../../types/form-types'
import {
    getCurrentIdShipperStore,
    getInitialValuesShippersStore,
    getIsFetchingShippersStore,
    getLabelShippersStore,
    getMaskOnShippersStore,
    getOneShipperFromLocal,
    getParsersShippersStore,
    getValidatorsShippersStore,
} from '../../../selectors/options/shippers-reselect'
import {
    getCityFromDispetcherAPI,
    getOrganizationByInnShipper,
    modifyOneShipperToAPI,
    newShipperSaveToAPI,
    oneShipperDeleteToAPI,
    setOrganizationByInnKppShippers,
    shippersStoreActions,
} from '../../../redux/options/shippers-store-reducer'
import {parseAllNumbers, stringToCoords} from '../../../utils/parsers'
import {YandexMapToForm} from '../../common/yandex-map-component/yandex-map-component';
import {FormSelector} from '../../common/form-selector/form-selector';
import {getAllKPPSelectFromLocal} from '../../../selectors/dadata-reselect';
import {daDataStoreActions} from '../../../redux/dadata-response-reducer';
import {getGeoPositionAuthStore} from '../../../selectors/auth-reselect';
import {FormApi} from 'final-form';
import {
    getShippersAllNamesListOptionsStore,
    getShippersNamesListOptionsStore,
} from '../../../selectors/options/options-reselect';
import {includesTitleValidator} from '../../../utils/validators';

type OwnProps = {
    // onSubmit: (requisites: shippersCardType) => void
}


export const ShippersForm: React.FC<OwnProps> = () => {

    const header = 'Заказчики и Грузоотправители'
    const isFetching = useSelector(getIsFetchingShippersStore)

    const initialValues = useSelector(getInitialValuesShippersStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)
    const consigneesListToValidate = useSelector(getShippersNamesListOptionsStore)
    const consigneesAllListToValidate = useSelector(getShippersAllNamesListOptionsStore)
    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const [ initialCoords, setInitialCoords ] = useState(initialValues.coordinates)

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
    // расчищаем значения от лишних символов и пробелов после маски
    const fromFormDemaskedValues = ( values: ShippersCardType ) => ( {
        ...values,
        innNumber: parseAllNumbers(values.innNumber) || undefined,
        ogrn: parseAllNumbers(values.ogrn) || undefined,
        shipperTel: ( parseAllNumbers(values.shipperTel) === '7' ) ? '' : values.shipperTel,
    } )

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = async ( values: ShippersCardType ) => {
        const demaskedValues = fromFormDemaskedValues(values)

        // находим название города и сохраняем в форме
        let currentCity = demaskedValues.city
        if (demaskedValues.coordinates !== initialCoords) {
            currentCity = await dispatch<any>(getCityFromDispetcherAPI({
                from: demaskedValues.coordinates as string,
                to: '55.032328, 82.819442',
            }))
            demaskedValues.city = currentCity
        }

        if (isNew) {
            // создаём нового
            dispatch<any>(newShipperSaveToAPI(demaskedValues as ShippersCardType<string>))
        } else {
            // сохраняем измененное значение
            dispatch<any>(modifyOneShipperToAPI(demaskedValues as ShippersCardType<string>))
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

    const getCoordinatesToInitial = ( form: FormApi<ShippersCardType> ) => ( coordinates: [ number, number ] ) => {
        // перезапись всех значений с новыми координатами, взятыми из API яндекса
        dispatch(shippersStoreActions.setCoordinates({ formValue: form.getState().values, coordinates }))
    }

    // автозаполнение полей при выборе селектора
    const setDataToForm = ( form: FormApi<ShippersCardType> ) => ( value: string | undefined ) => {
        const formValue = form.getState().values
        if (value)
            dispatch<any>(setOrganizationByInnKppShippers({ formValue, kppNumber: value }))
    }

    // онлайн валидация ИНН с подгрузкой КПП в селектор
    const innValidate = async ( value: string ) => {
        return await dispatch<any>(getOrganizationByInnShipper({ inn: +value }))
    }

    // синхронно/асинхронный валидатор на поле ИНН
    const innPlusApiValidator = ( preValue: string ) => ( currentValue: string ) => {
        const [ prev, current ] = [ preValue, currentValue ].map(parseAllNumbers)
        // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
        if (current && ( prev !== current ))
            // запускаем асинхронную валидацию только после синхронной
            return ( validators.innNumber && validators.innNumber(current) ) || innValidate(current)
    }

    // валидатор на одинаковые названия заголовков
    const titleValidator = ( preValue: string ) => ( currentValue: string ) => {
        if (currentValue && ( preValue !== currentValue ))
            return ( validators.title && validators.title(currentValue) ) ||
                includesTitleValidator(isNew ? consigneesAllListToValidate : consigneesListToValidate, currentValue)
    }

    useEffect(() => {
        if (isFirstRender) {
            if (isNew) {
                // зачищаем селектор при первом рендере
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // выставляем координаты геолокации
                dispatch(shippersStoreActions.setCoordinates({
                    formValue: initialValues,
                    coordinates: localCoords as [ number, number ],
                }))
            }
            setIsFirstRender(false)
        }
    }, [])

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
            // запоминаем первое адекватное значение координат и заполняем их
            if (initialValues.coordinates && !initialCoords) setInitialCoords(initialValues.coordinates)
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
                                ( {
                                      submitError,
                                      pristine,
                                      hasValidationErrors,
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.shippersConsigneesForm__form }>
                                        <div
                                            className={ styles.shippersConsigneesForm__inputsPanel + ' ' + styles.shippersConsigneesForm__inputsPanel_titled }>
                                            <Field name={ 'title' }
                                                   placeholder={ label.title }
                                                   maskFormat={ maskOn.title }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ titleValidator(values.title as string) }
                                                   parse={ parsers.title }
                                            />
                                        </div>
                                        <div className={ styles.shippersConsigneesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ isNew ? maskOn.innNumber : undefined }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ ( value ) => {
                                                       if (isNew)
                                                           return innPlusApiValidator(values.innNumber || '')(value)
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
                                                              handleChanger={ setDataToForm(form) }
                                                              disabled={ ( kppSelect.length < 1 ) || !form.getFieldState('innNumber')?.valid }
                                                              errorTop
                                                              isClearable
                                                />
                                                :
                                                <Field name={ 'kpp' }
                                                       placeholder={ label.kpp }
                                                       maskFormat={ isNew ? maskOn.kpp : undefined }
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
                                                   maskFormat={ isNew ? maskOn.ogrn : undefined }
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
                                                    getCoordinates={ getCoordinatesToInitial(form) }
                                                />
                                            </div>
                                            <div className={ styles.shippersConsigneesForm__buttonsPanel }>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || hasValidationErrors || submitError }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                    >{ submitting && <Preloader/> }</Button>
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
