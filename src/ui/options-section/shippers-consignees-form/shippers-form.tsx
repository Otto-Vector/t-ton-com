import React, {useEffect, useMemo, useState} from 'react'
import styles from './shippers-consignees-form.module.scss'
import {Field, Form} from 'react-final-form'

import {ProjectButton} from '../../common/buttons/project-button/project-button'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {Preloader} from '../../common/tiny/preloader/preloader'

import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {InfoText} from '../../common/tiny/info-text/into-text'
import {CancelXButton} from '../../common/buttons/cancel-button/cancel-x-button'
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
    modifyOneShipperToAPI,
    newShipperSaveToAPI,
    oneShipperDeleteToAPI,
    setOrganizationByInnKppShippers,
    shippersStoreActions,
} from '../../../redux/options/shippers-store-reducer'
import {parseAllNumbers} from '../../../utils/parsers'
import {YandexMapToForm} from '../../common/yandex-map-component/map-to-form'
import {FormSelector} from '../../common/inputs/final-form-inputs/form-selector/form-selector'
import {getAllKPPSelectFromLocal} from '../../../selectors/api/dadata-reselect'
import {daDataStoreActions} from '../../../redux/api/dadata-response-reducer'
import {getGeoPositionAuthStore} from '../../../selectors/auth-reselect'
import {FormApi} from 'final-form'
import {
    getShippersAllNamesOptionsStore,
    getShippersNamesExcludeCurrentOptionsStore,
} from '../../../selectors/options/options-reselect'
import {includesTitleValidator} from '../../../utils/validators'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {FormSpySimple} from '../../common/inputs/final-form-inputs/form-spy-simple/form-spy-simple'
import {useInnPlusApiValidator} from '../../../use-hooks/useAsyncInnValidate'
import {getCityFromDispetcherAPI} from '../../../redux/api/avto-dispetcher-response-reducer'
import createDecorator from 'final-form-focus'
import {stringToCoords} from '../../../utils/map-utils'


type OwnProps = {}


export const ShippersForm: React.ComponentType<OwnProps> = () => {

    const header = 'Заказчики и Грузоотправители'
    const isFetching = useSelector(getIsFetchingShippersStore)

    const initialValues = useSelector(getInitialValuesShippersStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)
    const shippersNamesExcludeCurrentToValidate = useSelector(getShippersNamesExcludeCurrentOptionsStore)
    const shippersAllNamesToValidate = useSelector(getShippersAllNamesOptionsStore)
    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const [ initialCoords, setInitialCoords ] = useState(initialValues.coordinates)

    const label = useSelector(getLabelShippersStore)
    const maskOn = useSelector(getMaskOnShippersStore)
    const validators = useSelector(getValidatorsShippersStore)
    const parsers = useSelector(getParsersShippersStore)
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])

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
        address: values.address || '',
        kpp: values.kpp || '',
        organizationName: values.organizationName || '',
        shipperTel: ( parseAllNumbers(values.shipperTel) === '7' ) ? '' : values.shipperTel,
    } )

    // сохраняем изменения формы в стейт редакса
    const formSpyChangeHandlerToLocalInit = ( values: ShippersCardType ) => {
        const [ demaskedValues, demaskedInitialValues ] = [ values, initialValues ].map(fromFormDemaskedValues)
        if (!valuesAreEqual(demaskedValues, demaskedInitialValues))
            dispatch(shippersStoreActions.setInitialValues(demaskedValues))
    }

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = async ( values: ShippersCardType ) => {
        const demaskedValues = fromFormDemaskedValues(values)

        // находим название города и сохраняем в форме
        if (demaskedValues.coordinates !== initialCoords) {
            const currentCitySearch = await dispatch<any>(getCityFromDispetcherAPI({
                from: demaskedValues.coordinates as string,
                to: '55.032328, 82.819442', // Новосибирск
            }))
            if (currentCitySearch.city) {
                demaskedValues.city = currentCitySearch.city
            } else {
                return currentCitySearch || { coordinates: 'Ошибка запроса. Измените координаты' }
            }
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
    const setDataToForm = ( form: FormApi<ShippersCardType> ) => ( kppNumber: string | undefined ) => {
        const demaskedValues = fromFormDemaskedValues(form.getState().values)
        if (kppNumber) {
            dispatch<any>(setOrganizationByInnKppShippers({ formValue: demaskedValues, kppNumber }))
        } else {
            // при зачистке освобождаются поля
            dispatch(shippersStoreActions.setInitialValues({
                ...demaskedValues,
                organizationName: '',
                ogrn: '',
                address: '',
                kpp: '',
            } as ShippersCardType))
        }
    }

    // онлайн валидация ИНН с подгрузкой КПП в селектор
    const innPlusApiValidator = useInnPlusApiValidator<ShippersCardType<string>>(
        dispatch, shippersStoreActions.setInitialValues,
        { organizationName: '', ogrn: '', address: '', kpp: '' } as ShippersCardType<string>,
    )

    // валидатор на одинаковые названия заголовков
    const titleValidator = ( preValue: string ) => ( currentValue: string ) => {
        return ( validators.title && validators.title(currentValue) )
            || ( currentValue && ( preValue !== currentValue )
                    ? includesTitleValidator(isNew ? shippersAllNamesToValidate : shippersNamesExcludeCurrentToValidate, currentValue)
                    : undefined
            )
    }

    useEffect(() => {
        if (isFirstRender) {
            dispatch(shippersStoreActions.setInitialValues({} as ShippersCardType))
            if (isNew) {
                // зачищаем селектор при первом рендере
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // выставляем координаты геолокации
                dispatch(shippersStoreActions.setCoordinates({
                    formValue: {} as ShippersCardType,
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

    useEffect(() => {
        // присваивается автоматически значение из первого селектора
        if (!isFirstRender && kppSelect.length > 0) {
            const preKey = initialValues.kpp + '' + initialValues.innNumber
            // если предыдущий список селектора не совпадает с выбраным
            if (!kppSelect.find(( { key } ) => key === preKey)) {
                dispatch<any>(setOrganizationByInnKppShippers({
                    formValue: initialValues,
                    kppNumber: kppSelect[0].value,
                }))
            }
        }
    }, [ kppSelect ])

    return (
        <div className={ styles.shippersConsigneesForm }>
            <div className={ styles.shippersConsigneesForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.shippersConsigneesForm__header }>{ header }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            //@ts-ignore-next-line
                            decorators={ [ focusOnError ] }
                            render={
                                ( {
                                      submitError,
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.shippersConsigneesForm__form }>
                                        {/*отслеживаем и отправляем данные в локальный инит*/ }
                                        <FormSpySimple form={ form }
                                                       onChange={ formSpyChangeHandlerToLocalInit }
                                                       isOnActiveChange
                                        />
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
                                                   validate={ ( isNew && form.getFieldState('innNumber')?.visited ) ? innPlusApiValidator(values as ShippersCardType<string>) : undefined }
                                                   parse={ parsers.innNumber }
                                                   disabled={ !isNew }
                                            />
                                            { isNew
                                                ?
                                                <FormSelector nameForSelector={ 'kpp' }
                                                              placeholder={ label.kpp }
                                                              options={ kppSelect }
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
                                            <Field name={ 'phisicalAddress' }
                                                       placeholder={ label.phisicalAddress }
                                                       maskFormat={ maskOn.phisicalAddress }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.phisicalAddress }
                                                       parse={ parsers.phisicalAddress }
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
                                                    <ProjectButton type={ 'submit' }
                                                                   disabled={ submitting || submitError }
                                                                   colorMode={ 'green' }
                                                                   title={ 'Cохранить' }
                                                                   rounded
                                                    >{ submitting && <Preloader/> }</ProjectButton>
                                                </div>
                                                <div className={ styles.shippersConsigneesForm__button }>
                                                    <ProjectButton type={ 'button' }
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
                <CancelXButton onCancelClick={ onCancelClick }/>
                <InfoText/>
            </div>
        </div>
    )
}
