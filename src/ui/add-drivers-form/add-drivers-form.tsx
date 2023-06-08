import React, {useCallback, useEffect, useState} from 'react'
import styles from './add-drivers-form.module.scss'
import {Field, Form} from 'react-final-form'
import {ProjectButton} from '../common/buttons/project-button/project-button'
import {Preloader} from '../common/tiny/preloader/preloader'
import noImage from '../../media/logo192.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'
import {useNavigate, useParams} from 'react-router-dom'
import {CancelXButton} from '../common/buttons/cancel-button/cancel-x-button'
import {EmployeeCardType, ResponseToRequestCardType, TrailerCardType, TransportCardType} from '../../types/form-types'

import {
    getInitialValuesAddDriverStore,
    getLabelAddDriverStore,
    getPlaceholderAddDriverStore,
    getValidatorsAddDriverStore,
} from '../../selectors/forms/add-driver-reselect'
import {FormSelector} from '../common/inputs/final-form-inputs/form-selector/form-selector'
import {FormInputType} from '../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {getInitialValuesRequestStore} from '../../selectors/forms/request-form-reselect'
import {getOneEmployeeFromLocal} from '../../selectors/options/employees-reselect'
import {getOneTransportFromLocal} from '../../selectors/options/transport-reselect'

import {getOneTrailerFromLocal} from '../../selectors/options/trailer-reselect'
import {employeesStoreActions} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/utils/lightbox-store-reducer'
import {AppStateType} from '../../redux/redux-store'
import {
    addAcceptedResponseToRequestOnCreate,
    deleteCurrentRequestAPI,
    getAllRequestsAPI,
    getOneRequestsAPI,
} from '../../redux/forms/request-store-reducer'
import {syncParsers, toNumber} from '../../utils/parsers'
import {FormApi} from 'final-form'
import {FormSpySimple} from '../common/inputs/final-form-inputs/form-spy-simple/form-spy-simple'
import {SelectOptionsType} from '../common/inputs/final-form-inputs/form-selector/selector-utils'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {ddMmYearFormat} from '../../utils/date-formats'
import {setOneResponseToRequest} from '../../redux/forms/add-driver-store-reducer'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {
    getAllEmployeesSelectWithCargoTypeDisabledWrongCargo,
} from '../../selectors/options/for-selectors/all-selectors-buffer-reselect'
import {cancelRequestCashReturn} from '../../redux/options/requisites-store-reducer'
import {boldWrapper} from '../../utils/html-rebuilds'


type OwnProps = {
    mode: 'addDriver' | 'selfExportDriver' | 'selfExportDriverFromStatus'
}


export const AddDriversForm: React.ComponentType<OwnProps> = ( { mode } ) => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string ): string => urlImage ? currentURL + urlImage : noImage

    const addDriverModes = {
        addDriver: mode === 'addDriver',
        selfExportDriver: mode === 'selfExportDriver',
        selfExportDriverFromStatus: mode === 'selfExportDriverFromStatus',
    }

    const navRoutes = useSelector(getRoutesStore)
    const { reqNumber } = useParams<{ reqNumber: string | undefined }>()
    const requestNumber = toNumber(reqNumber)

    const [ isFirstRender, setIsFirstRender ] = useState(true)
    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const externalInitialValues = useSelector(getInitialValuesAddDriverStore)
    const [ initialValues, setInitialValues ] = useState(externalInitialValues)

    const label = useSelector(getLabelAddDriverStore)
    const placeholder = useSelector(getPlaceholderAddDriverStore)
    const validators = useSelector(getValidatorsAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    const currentRequestValues = useSelector(getInitialValuesRequestStore)
    const distance = currentRequestValues?.distance

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const setLightBoxImage = ( imageURL?: string ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(setImage(imageURL)))
    }

    // список сотрудников для селектора (с доп.данными)
    const employeesSelect = useSelector(getAllEmployeesSelectWithCargoTypeDisabledWrongCargo)

    const oneEmployee = useSelector(getOneEmployeeFromLocal) as EmployeeCardType<string>
    const setOneEmployee = ( searchId: string ) => {
        dispatch(employeesStoreActions.setCurrentId(searchId))
    }

    const employeeOneImage = oneEmployee.photoFace

    const oneTransport = useSelector(getOneTransportFromLocal) as TransportCardType<string>
    const setOneTransport = ( searchId: string | undefined ) => {
        dispatch(transportStoreActions.setCurrentId(searchId || ''))
    }
    const transportOneImage = oneTransport.transportImage

    const oneTrailer = useSelector(getOneTrailerFromLocal) as TrailerCardType<string>
    const setOneTrailer = ( searchId: string | undefined ) => {
        dispatch(trailerStoreActions.setCurrentId(searchId || ''))
    }
    const trailerOneImage = oneTrailer.trailerImage

    // перевозимый вес транспорта
    const transportOneCargoWeight = toNumber(oneTransport?.cargoWeight)
    // перевозимый вес прицепа
    const trailerOneCargoWeight = toNumber(oneTrailer?.cargoWeight)
    // общий вес перевозимого груза
    const cargoWeight = ( trailerOneCargoWeight + transportOneCargoWeight ).toString()

    // подсчёт стоимости в зависимости от расстояния, ставки и веса груза
    // (встроен в валидатор ввода цены тн за км)
    const resultDistanceCost = useCallback(( form: FormApi<ResponseToRequestCardType<string>> ) => ( stavka: string ): string | undefined => {
        const parsedStavka = syncParsers.parseCommaToDot(stavka)
        const [ stavkaNum, cargoWeight, distanceNum ] = [ parsedStavka, form.getState().values.cargoWeight, distance ]
            .map(toNumber)
        form.change('responsePrice', syncParsers.parseToNormalMoney(( stavkaNum * cargoWeight * distanceNum )))
        return ( validators.responseStavka && validators.responseStavka(stavka) ) || ''
    }, [ distance, validators?.responseStavka ])


    const onSubmit = useCallback(async ( addDriverValues: ResponseToRequestCardType<string> ) => {
        const demaskedValues: ResponseToRequestCardType<string> = {
            ...addDriverValues,
            responsePrice: syncParsers.parseNoSpace(addDriverValues.responsePrice),
        }
        if (addDriverModes.addDriver) {
            await dispatch<any>(setOneResponseToRequest({ addDriverValues: demaskedValues, oneEmployee }))
            navigate(navRoutes.searchList)
        }
        if (addDriverModes.selfExportDriver || addDriverModes.selfExportDriverFromStatus) {
            await dispatch<any>(addAcceptedResponseToRequestOnCreate({
                addDriverValues: demaskedValues,
                oneEmployee,
                oneTrailer,
                oneTransport,
                idCustomer: currentRequestValues.idCustomer + '',
                cargoWeight,
            }))
            navigate(navRoutes.requestsList)
        }
    }, [ oneEmployee, oneTransport, oneTrailer, cargoWeight ])

    // перезаписываем состояние в стейт для перерасчёта калькулятора
    const spyChanger = ( values: ResponseToRequestCardType ) => {
        setInitialValues(values)
    }

    const onCancelClick = () => {
        if (addDriverModes.selfExportDriver) {
            dispatch<any>(textAndActionGlobalModal({
                    title: 'Внимание!',
                    text: [
                        'Создание заяки приостановлено. Удалить заявку?',
                        'ОК - Удалить текущую заявку',
                        'Отмена - Сохранить заявку для откликов перевозчиками',
                    ],
                    action: () => {
                        // удаляем созданную заявку
                        dispatch<any>(deleteCurrentRequestAPI({ requestNumber }))
                        // так как деньги уже списались при нажатии "Самовывоз"
                        dispatch<any>(cancelRequestCashReturn())
                    },
                    navigateOnOk: navRoutes.searchList,
                    navigateOnCancel: navRoutes.searchList,
                },
            ))
        }

        if (addDriverModes.addDriver || addDriverModes.selfExportDriverFromStatus) {
            navigate(-1)
        }
    }

    // при клике на неактивный пункт селектора
    const onDisableOptionSelectorHandleClick = ( optionValue: SelectOptionsType ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: [
                'Нельзя добавить, причина: ' + boldWrapper(optionValue.extendInfo?.toUpperCase()),
                'На заявке нужен: ' + boldWrapper(currentRequestValues.cargoType?.toUpperCase()),
            ],
        }))
    }

    useEffect(() => {
        if (isFirstRender) {
            dispatch<any>(getOneRequestsAPI(requestNumber))
            // чистим данные
            setInitialValues({} as ResponseToRequestCardType)
            setOneEmployee('')
            setOneTransport('')
            setOneTrailer('')
            setIsFirstRender(false)
        }
    }, [])

    // подгружаем данные водителя и транспорта
    useEffect(() => {
        if (!isFirstRender && oneEmployee) {
            setOneTransport(oneEmployee.idTransport)
            setOneTrailer(oneEmployee.idTrailer)
        }
    }, [ oneEmployee ])

    // подгружаем данные в стейт формы для перерасчёта калькулятора суммы при изменении водителя в селекторе
    useEffect(() => {
        if (oneTrailer.idTrailer !== initialValues.idTrailer || oneTransport.idTransport !== initialValues.idTransport)
            setInitialValues({
                ...initialValues,
                requestNumber: requestNumber + '',
                idEmployee: oneEmployee.idEmployee,
                idTransport: oneTransport.idTransport,
                idTrailer: oneTrailer.idTrailer,
                // под шумок втыкаем общий вес перевозимого груза
                cargoWeight,
                responseTax: taxMode,
            })
    }, [ oneTrailer, oneTransport ])

    // если "по таймингу" или случайно захотелось ответить на заявку, на которую невозможно ответить
    useEffect(() => {
        if (currentRequestValues.globalStatus === 'в работе') {
            dispatch<any>(textAndActionGlobalModal({
                text: 'Извините, заявку уже приняли в работу. Обновляем данные...',
                timeToDeactivate: 3000,
            }))
            dispatch<any>(getAllRequestsAPI())
            navigate(navRoutes.searchList)
        }
    }, [ currentRequestValues.globalStatus, navRoutes, dispatch ])


    return (
        <div className={ styles.addDriversForm }>
            <div className={ styles.addDriversForm__wrapper + ' ' + styles.addDriversForm__wrapper_width }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.addDriversForm__header }>{
                            `Заявка ${ currentRequestValues.requestNumber } от ${ ddMmYearFormat(currentRequestValues.requestDate) }` }
                        </h4>
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
                                                              options={ employeesSelect }
                                                              validate={ validators.idEmployee }
                                                              handleChanger={ setOneEmployee }
                                                              isSubLabelOnOption
                                                              onDisableHandleClick={ onDisableOptionSelectorHandleClick }
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
                                            <div className={ styles.addDriversForm__infoItem }
                                                 title={ 'Общий вес: ' + cargoWeight + 'тн.' }>
                                                <label className={ styles.addDriversForm__label }>
                                                    { label.responseStavka + ':' }</label>
                                                <Field name={ 'responseStavka' }
                                                       placeholder={ placeholder.responseStavka }
                                                       component={ FormInputType }
                                                       inputType={ 'money' }
                                                       pattern={ '/d*.' }
                                                       resetFieldBy={ form }
                                                       validate={ resultDistanceCost(form) }
                                                       disabled={ !values.idEmployee }
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
                                                    { 'Тонн / км:' }</label>
                                                <div className={ styles.addDriversForm__info }>
                                                    { cargoWeight + '/' + distance }
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
                                            <div className={ styles.addDriversForm__photo }
                                                 title={ 'Фото водителя' }>
                                                <img
                                                    src={ setImage(employeeOneImage as string) }
                                                    alt="driverPhoto"
                                                    onClick={ () => setLightBoxImage(employeeOneImage) }
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__photo }
                                                 title={ 'Фото транспорта' }>
                                                <img
                                                    src={ setImage(transportOneImage as string) }
                                                    alt="transportPhoto"
                                                    onClick={ () => setLightBoxImage(transportOneImage) }
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__photo }
                                                 title={ 'Фото прицепа' }>
                                                <img
                                                    src={ setImage(trailerOneImage as string) }
                                                    alt="driverTrailerPhoto"
                                                    onClick={ () => setLightBoxImage(trailerOneImage) }
                                                />
                                            </div>
                                        </div>

                                        <div className={ styles.addDriversForm__buttonsPanel }>
                                            <div className={ styles.addDriversForm__button }>
                                                <ProjectButton type={ 'submit' }
                                                               disabled={ submitting || hasValidationErrors }
                                                               colorMode={ 'green' }
                                                               title={ 'Принять' }
                                                               rounded
                                                />
                                            </div>
                                            <div className={ styles.addDriversForm__button }>
                                                <ProjectButton type={ 'button' }
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
                <CancelXButton onCancelClick={ onCancelClick }/>
            </div>
        </div>
    )
}
