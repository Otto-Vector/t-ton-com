import React, {useCallback, useEffect, useState} from 'react'
import styles from './add-drivers-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../common/button/button'
import {Preloader} from '../common/preloader/preloader'
import noImage from '../../media/logo192.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'
import {useNavigate, useParams} from 'react-router-dom'
import {CancelButton} from '../common/cancel-button/cancel-button'
import {ResponseToRequestCardType} from '../../types/form-types'

import {
    getInitialValuesAddDriverStore,
    getLabelAddDriverStore,
    getPlaceholderAddDriverStore,
    getValidatorsAddDriverStore,
} from '../../selectors/forms/add-driver-reselect'
import {FormSelector} from '../common/form-selector/form-selector'
import {FormInputType} from '../common/form-input-type/form-input-type'
import {getInitialValuesRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getOneEmployeeFromLocal} from '../../selectors/options/employees-reselect'
import {getOneTransportFromLocal} from '../../selectors/options/transport-reselect'

import {getOneTrailerFromLocal} from '../../selectors/options/trailer-reselect'
import {employeesStoreActions} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/utils/lightbox-store-reducer'
import {AppStateType} from '../../redux/redux-store';
import {getOneRequestsAPI} from '../../redux/forms/request-store-reducer';
import {syncParsers} from '../../utils/parsers';
import {FormApi} from 'final-form';
import {FormSpySimple} from '../common/form-spy-simple/form-spy-simple';
import {getAllEmployeesSelectWithCargoType} from '../../selectors/options/options-reselect';

type OwnProps = {}

export const AddDriversForm: React.FC<OwnProps> = () => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string ): string => urlImage ? currentURL + urlImage : noImage

    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const requestNumber = +( reqNumber || 0 )
    const header = ( requestNumber: number, shipmentDate: Date ): string =>
        `Заявка ${ requestNumber } от ${ ddMmYearFormat(shipmentDate) }`

    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const externalInitialValues = useSelector(getInitialValuesAddDriverStore)
    const [ initialValues, setInitialValues ] = useState(externalInitialValues)

    const label = useSelector(getLabelAddDriverStore)
    const placeholder = useSelector(getPlaceholderAddDriverStore)
    const validators = useSelector(getValidatorsAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    const requestValues = useSelector(getInitialValuesRequestStore)
    const distance = requestValues?.distance

    const dispatch = useDispatch()

    const setLightBoxImage = ( imageURL?: string ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(setImage(imageURL)))
    }

    const employeesSelect = useSelector(getAllEmployeesSelectWithCargoType)

    const navigate = useNavigate()

    const onSubmit = ( values: ResponseToRequestCardType ) => {
        console.log(values)
        // navigate(create)
    }

    const oneEmployee = useSelector(getOneEmployeeFromLocal)
    const setOneEmployee = ( searchId: string ) => {
        dispatch(employeesStoreActions.setCurrentId(searchId))
    }

    const employeeOneImage = oneEmployee.photoFace
    const employeeOneRating = oneEmployee.rating
    // const employeeOnePhone = oneEmployee.employeePhoneNumber

    const oneTransport = useSelector(getOneTransportFromLocal)
    const setOneTransport = ( searchId: string | undefined ) => {
        dispatch(transportStoreActions.setCurrentId(searchId || ''))
    }
    const transportOneImage = oneTransport.transportImage
    const transportOneCargoWeight = oneTransport.cargoWeight

    const oneTrailer = useSelector(getOneTrailerFromLocal)
    const setOneTrailer = ( searchId: string | undefined ) => {
        dispatch(trailerStoreActions.setCurrentId(searchId || ''))
    }

    const trailerOneImage = oneTrailer.trailerImage
    const trailerOneCargoWeight = oneTrailer.cargoWeight

    // подсчёт стоимости в зависимости от расстояния, ставки и веса груза
    const resultDistanceCost = useCallback(( form: FormApi<ResponseToRequestCardType> ) => ( stavka: string ): string => {
        const [ stavkaNum, trailerNum, transportNum, distanceNum ] = [ stavka, trailerOneCargoWeight, transportOneCargoWeight, distance ]
            .map(( v ) => +( v || 0 ))
        form.change('responsePrice', syncParsers.parseToNormalMoney(( stavkaNum * ( trailerNum + transportNum ) * distanceNum )))
        return validators.responseStavka ? ( validators.responseStavka(stavka) || '' ) : ''
    }, [ trailerOneCargoWeight, transportOneCargoWeight, distance ])

    // перезаписываем состояние в стейт для перерасчёта калькулятора
    const spyChanger = ( values: ResponseToRequestCardType ) => {
        setInitialValues(values)
    }

    const onCancelClick = () => {
        navigate(-1)
    }

    useEffect(() => {
        if (isFirstRender) {
            // избавляемся от лишнего запроса
            if (requestValues?.requestNumber !== requestNumber) {
                dispatch<any>(getOneRequestsAPI(requestNumber))
            }
            // чистим данные
            setOneEmployee('')
            setOneTransport('')
            setOneTrailer('')
            setIsFirstRender(false)
        }
    }, [])

    useEffect(() => {
        if (!isFirstRender && oneEmployee) {
            setOneTransport(oneEmployee.idTransport)
            setOneTrailer(oneEmployee.idTrailer)
        }
    }, [ oneEmployee ])

    useEffect(() => {
        if (oneTrailer.idTrailer !== initialValues.idTrailer || oneTransport.idTransport !== initialValues.idTransport)
            setInitialValues({
                ...initialValues,
                idEmployee: oneEmployee.idEmployee,
                idTransport: oneTransport.idTransport,
                idTrailer: oneTrailer.idTrailer,
                responseTax: taxMode,
            })
    }, [ oneTrailer, oneTransport ])

    return (
        <div className={ styles.addDriversForm }>
            <div className={ styles.addDriversForm__wrapper + ' ' + styles.addDriversForm__wrapper_width }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.addDriversForm__header }>{ header(requestNumber, new Date()) }</h4>
                        <Form
                            onSubmit={ onSubmit }
                            initialValues={ initialValues }
                            render={
                                ( {
                                      hasValidationErrors,
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.addDriversForm__form }>
                                        <FormSpySimple form={ form }
                                                       isOnActiveChange
                                                       onChange={ spyChanger }
                                        />
                                        <div
                                            className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>
                                                    { label.idEmployee + ':' }</label>
                                                <FormSelector nameForSelector={ 'idEmployee' }
                                                              placeholder={ placeholder.idEmployee }
                                                              values={ employeesSelect }
                                                              validate={ validators.idEmployee }
                                                              handleChanger={ setOneEmployee }
                                                              isSubLabelOnOption
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>
                                                    { label.idTransport + ':' }</label>
                                                <div
                                                    className={ styles.addDriversForm__info + ' ' + styles.addDriversForm__info_maxHeight }>
                                                    { oneTransport.transportNumber
                                                        ? oneTransport.transportTrademark + ', ' + oneTransport.transportNumber + ', (' + oneTransport.cargoWeight + 'т.)'
                                                        : 'не привязан'
                                                    }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__selector }>
                                                <label
                                                    className={ styles.addDriversForm__label }>
                                                    { label.idTrailer + ':' }</label>
                                                <div
                                                    className={ styles.addDriversForm__info + ' ' + styles.addDriversForm__info_maxHeight }>
                                                    { oneTrailer.trailerNumber
                                                        ? oneTrailer.trailerTrademark + ', ' + oneTrailer.trailerNumber + ', (' + oneTrailer.cargoWeight + 'т.)'
                                                        : 'не привязан'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className={ styles.addDriversForm__infoPanel }>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.responseStavka + ':' }</label>
                                                <Field name={ 'responseStavka' }
                                                       placeholder={ placeholder.responseStavka }
                                                       component={ FormInputType }
                                                       inputType={ 'money' }
                                                       pattern={ '/d*.' }
                                                       resetFieldBy={ form }
                                                       validate={ resultDistanceCost(form) }
                                                       noLabel
                                                       errorBottom
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }
                                                 title={ 'Расстояние: ' + distance + 'км.' }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.responsePrice + ':' }</label>
                                                <div className={ styles.addDriversForm__info + ' ' +
                                                    styles.addDriversForm__info_long }>
                                                    { values.responsePrice || 'за весь рейс' }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { 'Вып. заказов:' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { employeeOneRating || '-' }
                                                </div>
                                            </div>
                                            <div className={ styles.addDriversForm__infoItem }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.responseTax + ':' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { initialValues.responseTax || taxMode }
                                                </div>
                                            </div>
                                        </div>
                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                                        <div className={ styles.addDriversForm__photoPanel }>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ setImage(employeeOneImage as string) }
                                                    alt="driverPhoto"
                                                    onClick={ () => setLightBoxImage(employeeOneImage) }
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ setImage(transportOneImage as string) }
                                                    alt="transportPhoto"
                                                    onClick={ () => setLightBoxImage(transportOneImage) }
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__photo }>
                                                <img
                                                    src={ setImage(trailerOneImage as string) }
                                                    alt="driverTrailerPhoto"
                                                    onClick={ () => setLightBoxImage(trailerOneImage) }
                                                />
                                            </div>
                                        </div>

                                        <div className={ styles.addDriversForm__buttonsPanel }>
                                            <div className={ styles.addDriversForm__button }>
                                                <Button type={ 'submit' }
                                                        disabled={ submitting || hasValidationErrors }
                                                        colorMode={ 'green' }
                                                        title={ 'Принять' }
                                                        rounded
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__button }>
                                                <Button type={ 'button' }
                                                        colorMode={ 'red' }
                                                        title={ 'Отказаться' }
                                                        onClick={ () => {
                                                            onCancelClick()
                                                        } }
                                                        rounded
                                                />
                                            </div>
                                        </div>
                                    </form>
                                ) }/>
                    </> }
                <CancelButton onCancelClick={ onCancelClick }/>
            </div>
        </div>
    )
}
