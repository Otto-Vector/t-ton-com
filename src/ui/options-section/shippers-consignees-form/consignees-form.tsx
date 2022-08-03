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
import {ConsigneesCardType} from '../../../types/form-types'
import {
    getCurrentIdConsigneeStore,
    getInitialValuesConsigneesStore,
    getLabelConsigneesStore,
    getMaskOnConsigneesStore,
    getOneConsigneesFromLocal,
    getParsersConsigneesStore,
    getValidatorsConsigneesStore,
} from '../../../selectors/options/consignees-reselect'
import {
    consigneesStoreActions,
    getOrganizationByInnConsignee,
    setOrganizationByInnKppConsignee,
} from '../../../redux/options/consignees-store-reducer';
import {parseAllNumbers, stringToCoords} from '../../../utils/parsers';
import {YandexMapToForm} from '../../common/yandex-map-component/yandex-map-component';
import {getAllKPPSelectFromLocal} from '../../../selectors/dadata-reselect';
import {FormSelector} from '../../common/form-selector/form-selector';
import {FormSpySimpleConsignee} from '../../common/form-spy-simple/form-spy-simple';
import {valuesAreEqual} from '../../../utils/reactMemoUtils';
import {daDataStoreActions} from '../../../redux/dadata-response-reducer';


type OwnProps = {
    // onSubmit: (requisites: consigneesCardType) => void
}


export const ConsigneesForm: React.FC<OwnProps> = () => {

    const header = 'ГрузоПолучатели'
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const initialValues = useSelector(getInitialValuesConsigneesStore)
    const kppSelect = useSelector(getAllKPPSelectFromLocal)
    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const [ isSelectorChange, setIsSelectorChange ] = useState(false)
    const [ isCoordsChange, setIsCoordsChange ] = useState(false)

    const label = useSelector(getLabelConsigneesStore)
    const maskOn = useSelector(getMaskOnConsigneesStore)
    const validators = useSelector(getValidatorsConsigneesStore)
    const parsers = useSelector(getParsersConsigneesStore)

    const currentId = useSelector(getCurrentIdConsigneeStore)
    const oneConsignee = useSelector(getOneConsigneesFromLocal)
    // вытаскиваем значение роутера
    const { id: currentIdFromNavigate } = useParams<{ id: string | undefined }>()
    const isNew = currentIdFromNavigate === 'new'

    const fromFormDemaskedValues = ( values: ConsigneesCardType ) => ( {
        ...values,
        innNumber: parseAllNumbers(values.innNumber) || undefined,
        ogrn: parseAllNumbers(values.ogrn) || undefined,
        consigneesTel: ( parseAllNumbers(values.consigneesTel) === '7' ) ? '' : values.consigneesTel,
    } )

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = ( values: ConsigneesCardType ) => {
        dispatch(consigneesStoreActions.changeOneConsignee(currentId, fromFormDemaskedValues(values))) //сохраняем измененное значение
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        navigate(options)
    }

    const consigneeDeleteHandleClick = () => {
        dispatch(consigneesStoreActions.setDefaultInitialValues())
        dispatch(consigneesStoreActions.deleteConsignee(currentId))
        navigate(options)
    }

    const setCoordinatesToInitial = ( coords: [ number, number ] ) => {
        dispatch(consigneesStoreActions.setCoordinates(coords))
        setIsCoordsChange(true)
    }

    // онлайн валидация ИНН с подгрузкой КПП в селектор
    const innValidate = async ( value: string ) => {
        const parsedValue = parseAllNumbers(value)
        const response = await dispatch<any>(getOrganizationByInnConsignee({ inn: +parsedValue }))

        return response
    }

    // автозаполнение полей при выборе селектора
    const setDataToForm = ( value: string | undefined ) => {
        if (value)
            dispatch<any>(setOrganizationByInnKppConsignee({ kppNumber: value }))
        setIsSelectorChange(true)
    }

    // для синхры с redux стейтом (только после изменения координат или селектора)
    const exposeValues = ( { values, valid }: { values: ConsigneesCardType, valid: boolean } ) => {
        // очищаем от масок
        const demaskedValues = fromFormDemaskedValues(values)
        // сравниваем значения
        if (!valuesAreEqual(demaskedValues, initialValues)) {
            // debugger
            dispatch(consigneesStoreActions.setInitialValues(
                // если прилетело от смены селектора, то ставим initialValues
                !isSelectorChange ? demaskedValues : initialValues),
            )

            setIsSelectorChange(false)
            setIsCoordsChange(false)
        }
    }

    // зачищаем селектор при первом рендере
    useEffect(() => {
        if (isFirstRender) {
            dispatch(daDataStoreActions.setSuggectionsValues([]))
            setIsFirstRender(false)
        }
    })

    useEffect(() => {
            if (!isNew) {
                if (currentId === +( currentIdFromNavigate || 0 )) {
                    if (initialValues.coordinates === undefined) {
                        dispatch(consigneesStoreActions.setInitialValues(oneConsignee))
                    }
                } else {
                    dispatch(consigneesStoreActions.setCurrentId(+( currentIdFromNavigate || 0 )))
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
                                                   parse={ parsers.title }
                                            />
                                        </div>
                                        <div className={ styles.shippersConsigneesForm__inputsPanel }>
                                            <Field name={ 'innNumber' }
                                                   placeholder={ label.innNumber }
                                                   maskFormat={ maskOn.innNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   disabled={ !isNew }
                                                   validate={ ( value ) => {
                                                       // расчищаем значения от лишних символов и пробелов после маски
                                                       const [ preValue, currentValue ] = [ form.getFieldState('innNumber')?.value, value ]
                                                           .map(val => parseAllNumbers(val) || undefined)
                                                       // отфильтровываем лишние срабатывания (в т.ч. undefined при первом рендере)
                                                       if (currentValue && ( preValue !== currentValue ))
                                                           // запускаем асинхронную валидацию только после синхронной
                                                           return ( validators.innNumber && validators.innNumber(value) ) || innValidate(value)
                                                   } }
                                                   parse={ parsers.innNumber }
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
                                                // disabled={ !isNew }
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
                                                // disabled={ !isNew }
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
                                                   allowEmptyFormatting
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.consigneesTel }
                                                   parse={ parsers.consigneesTel }
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
                                                    getCoordinates={ setCoordinatesToInitial }
                                                />
                                            </div>
                                            <div className={ styles.shippersConsigneesForm__buttonsPanel }

                                            >
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
                                                            onClick={ consigneeDeleteHandleClick }
                                                            rounded
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        { ( isCoordsChange || isSelectorChange ) &&
                                            <FormSpySimpleConsignee
                                                form={ form }
                                                onChange={ ( { values, valid } ) => {
                                                    exposeValues({ values, valid })
                                                } }/>
                                        }
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
