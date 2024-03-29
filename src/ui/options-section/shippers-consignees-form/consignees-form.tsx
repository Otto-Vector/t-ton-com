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
import {ConsigneesCardType} from '../../../types/form-types'
import {
    getCurrentIdConsigneeStore,
    getInitialValuesConsigneesStore,
    getIsFetchingConsigneesStore,
    getLabelConsigneesStore,
    getMaskOnConsigneesStore,
    getOneConsigneesFromLocal,
    getParsersConsigneesStore,
    getValidatorsConsigneesStore,
} from '../../../selectors/options/consignees-reselect'
import {
    consigneesStoreActions,
    modifyOneConsigneeToAPI,
    newConsigneeSaveToAPI,
    oneConsigneeDeleteToAPI,
    setOrganizationByInnKppConsignees,
} from '../../../redux/options/consignees-store-reducer'
import {coordsToString, parseAllNumbers} from '../../../utils/parsers'
import {YandexMapToForm} from '../../common/yandex-map-component/map-to-form'
import {getAllKPPSelectFromLocal} from '../../../selectors/api/dadata-reselect'
import {FormSelector} from '../../common/inputs/final-form-inputs/form-selector/form-selector'
import {daDataStoreActions} from '../../../redux/api/dadata-response-reducer'
import {getGeoPositionAuthStore} from '../../../selectors/auth-reselect'
import {FormApi} from 'final-form'
import {
    getConsigneesAllNamesOptionsStore,
    getConsigneesNamesListOptionsStore,
} from '../../../selectors/options/options-reselect'
import {includesTitleValidator} from '../../../utils/validators'
import {useInnPlusApiValidator} from '../../../use-hooks/useAsyncInnValidate'
import {FormSpySimple} from '../../common/inputs/final-form-inputs/form-spy-simple/form-spy-simple'
import {valuesAreEqual} from '../../../utils/reactMemoUtils'
import {getCityFromDispetcherAPI} from '../../../redux/api/avto-dispetcher-response-reducer'
import createDecorator from 'final-form-focus'
import {stringToCoords} from '../../../utils/map-utils'


type OwnProps = {}

export const ConsigneesForm: React.ComponentType<OwnProps> = () => {

    const header = 'ГрузоПолучатели'
    const isFetching = useSelector(getIsFetchingConsigneesStore)

    const initialValues = useSelector(getInitialValuesConsigneesStore)

    const kppSelect = useSelector(getAllKPPSelectFromLocal)
    const consigneesListExcludeCurrentToValidate = useSelector(getConsigneesNamesListOptionsStore)
    const consigneesAllListToValidate = useSelector(getConsigneesAllNamesOptionsStore)

    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const [ initialCoords, setInitialCoords ] = useState(initialValues.coordinates)

    const label = useSelector(getLabelConsigneesStore)
    const maskOn = useSelector(getMaskOnConsigneesStore)
    const validators = useSelector(getValidatorsConsigneesStore)
    const parsers = useSelector(getParsersConsigneesStore)
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])

    const localCoords = useSelector(getGeoPositionAuthStore)
    const currentId = useSelector(getCurrentIdConsigneeStore)
    const oneConsignee = useSelector(getOneConsigneesFromLocal)

    // вытаскиваем значение роутера
    const { id: currentIdFromNavigate } = useParams<{ id: string | undefined }>()
    const isNew = currentIdFromNavigate === 'new'

    // расчищаем значения от лишних символов и пробелов после маски
    const fromFormDemaskedValues = ( values: ConsigneesCardType ): ConsigneesCardType => ( {
        ...values,
        innNumber: parseAllNumbers(values.innNumber) || '',
        ogrn: parseAllNumbers(values.ogrn) || '',
        address: values.address || '',
        kpp: values.kpp || '',
        organizationName: values.organizationName || '',
        consigneesTel: ( parseAllNumbers(values.consigneesTel) === '7' ) ? '' : values.consigneesTel,
    } )

    // сохраняем изменения формы в стейт редакса
    const formSpyChangeHandlerToLocalInit = ( values: ConsigneesCardType ) => {
        const [ demaskedValues, demaskedInitialValues ] = [ values, initialValues ].map(fromFormDemaskedValues)
        if (!valuesAreEqual(demaskedValues, demaskedInitialValues)) {
            dispatch(consigneesStoreActions.setInitialValues(demaskedValues))
        }
    }

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = async ( values: ConsigneesCardType ) => {
        const demaskedValues = fromFormDemaskedValues(values)

        // находим название города и сохраняем в форме
        if (demaskedValues.coordinates !== initialCoords) {
            const currentCitySearch = await dispatch<any>(getCityFromDispetcherAPI({
                from: demaskedValues.coordinates as string,
                to: '55.032328, 82.819442',
            }))
            if (currentCitySearch.city) {
                demaskedValues.city = currentCitySearch.city
            } else {
                return currentCitySearch
            }
        }

        if (isNew) {
            // создаём нового
            dispatch<any>(newConsigneeSaveToAPI(demaskedValues as ConsigneesCardType<string>))
        } else {
            // сохраняем измененное значение
            dispatch<any>(modifyOneConsigneeToAPI(demaskedValues as ConsigneesCardType<string>))
        }
        // зачищаем поля
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        navigate(options)
    }

    const consigneeDeleteHandleClick = () => {
        dispatch<any>(oneConsigneeDeleteToAPI(currentId))
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        navigate(options)
    }

    const getCoordinatesToInitial = ( form: FormApi<ConsigneesCardType> ) => ( coordinates: [ number, number ] ) => {
        // перезапись всех значений с новыми координатами, взятыми из API яндекса
        dispatch(consigneesStoreActions.setCoordinates({ formValue: form.getState().values, coordinates }))
    }

    // автозаполнение полей при выборе селектора
    const setDataToFormOnSelectorChange = ( form: FormApi<ConsigneesCardType> ) => ( kppNumber: string | undefined ) => {
        const demaskedValues = fromFormDemaskedValues(form.getState().values)
        if (kppNumber) {
            dispatch<any>(setOrganizationByInnKppConsignees({ formValue: demaskedValues, kppNumber }))
        } else {
            // при зачистке освобождаются поля
            dispatch(consigneesStoreActions.setInitialValues({
                ...demaskedValues,
                organizationName: '',
                ogrn: '',
                address: '',
                kpp: '',
                coordinates: coordsToString(localCoords as [ number, number ]),
            } as ConsigneesCardType))
        }
    }

    // синхронно/асинхронный валидатор на поле ИНН
    const innPlusApiValidator = useInnPlusApiValidator<ConsigneesCardType<string>>(
        dispatch, consigneesStoreActions.setInitialValues,
        {
            organizationName: '',
            ogrn: '',
            address: '',
            kpp: '',
            coordinates: coordsToString(localCoords as [ number, number ]),
        } as ConsigneesCardType<string>,
    )

    // валидатор на одинаковые названия заголовков
    const titleValidator = ( preValue: string ) => ( currentValue: string ) => {
        return ( validators.title && validators.title(currentValue) )
            || ( currentValue && ( preValue !== currentValue )
                    ? includesTitleValidator(isNew ? consigneesAllListToValidate : consigneesListExcludeCurrentToValidate, currentValue)
                    : undefined
            )
    }

    // зачистка значений при первом рендере
    useEffect(() => {
        if (isFirstRender) {
            dispatch(consigneesStoreActions.setInitialValues({} as ConsigneesCardType))
            if (isNew) {
                // зачищаем селектор при первом рендере
                dispatch(daDataStoreActions.setSuggectionsValues([]))
                // зачищаем InitValues при первом рендере
                dispatch(consigneesStoreActions.setDefaultInitialValues())
                // выставляем координаты геолокации
                dispatch(consigneesStoreActions.setCoordinates({
                    formValue: {} as ConsigneesCardType,
                    coordinates: localCoords as [ number, number ],
                }))
            }
            setIsFirstRender(false)
        }
    }, [])

    // работа с автозаполнением координат
    useEffect(() => {
            if (!isNew) {
                if (currentId === currentIdFromNavigate) {
                    if (initialValues.coordinates === undefined) {
                        dispatch(consigneesStoreActions.setInitialValues(oneConsignee))
                    }
                } else {
                    dispatch(consigneesStoreActions.setCurrentId(currentIdFromNavigate + ''))
                }
            }
            // запоминаем первое адекватное значение координат и заполняем их
            if (initialValues.coordinates && !initialCoords) setInitialCoords(initialValues.coordinates)
        }, [ currentId, initialValues ],
    )

    // присваивание первого селектора из списка
    useEffect(() => {
        // присваивается автоматически значение из первого селектора
        if (!isFirstRender && kppSelect.length > 0) {
            const preKey = initialValues.kpp + '' + initialValues.innNumber
            // если предыдущий список селектора не совпадает с выбраным
            if (!kppSelect.find(( { key } ) => key === preKey)) {
                dispatch<any>(setOrganizationByInnKppConsignees({
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
                                                   validate={ ( isNew && form.getFieldState('innNumber')?.visited )
                                                       ? innPlusApiValidator(values as ConsigneesCardType<string>) : undefined }
                                                   parse={ parsers.innNumber }
                                                   disabled={ !isNew }
                                            />
                                            { isNew
                                                ?
                                                <FormSelector nameForSelector={ 'kpp' }
                                                              placeholder={ label.kpp }
                                                              options={ kppSelect }
                                                              validate={ validators.kpp }
                                                              handleChanger={ setDataToFormOnSelectorChange(form) }
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
                                            <Field name={ 'consigneesFio' }
                                                   placeholder={ label.consigneesFio }
                                                   maskFormat={ maskOn.consigneesFio }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.consigneesFio }
                                                   parse={ parsers.consigneesFio }
                                            />
                                            <Field name={ 'consigneesTel' }
                                                   placeholder={ label.consigneesTel }
                                                   maskFormat={ maskOn.consigneesTel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.consigneesTel }
                                                   parse={ parsers.consigneesTel }
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
                                                                   onClick={ consigneeDeleteHandleClick }
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
