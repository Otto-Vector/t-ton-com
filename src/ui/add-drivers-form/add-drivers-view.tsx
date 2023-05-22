import React, {useCallback, useEffect, useMemo} from 'react'
import styles from './add-drivers-form.module.scss'
import noImage from '../../media/logo192.png'
import {useDispatch, useSelector} from 'react-redux'
import {getStoredValuesRequisitesStore} from '../../selectors/options/requisites-reselect'

import {getLabelAddDriverStore} from '../../selectors/forms/add-driver-reselect'
import {getInitialValuesRequestStore, getIsFetchingRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getAllEmployeesAPI, modifyOneEmployeeStatusToAPI} from '../../redux/options/employees-store-reducer'
import {lightBoxStoreActions} from '../../redux/utils/lightbox-store-reducer'
import {Preloader} from '../common/preloader/preloader'
import {addAcceptedResponseToRequestOnAcceptDriver, getOneRequestsAPI} from '../../redux/forms/request-store-reducer'
import {Button} from '../common/button/button'
import {AppStateType} from '../../redux/redux-store'
import {
    getFilteredDriversBigMapStore,
    getFilteredResponsesBigMapStore,
    getFilteredTrailersBigMapStore,
    getFilteredTransportBigMapStore,
} from '../../selectors/maps/big-map-reselect'
import {useLocation} from 'react-router-dom'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {removeResponseToRequestsBzRemoveThisDriverFromRequest} from '../../redux/forms/add-driver-store-reducer'
import {setAnswerDriversToMap} from '../../redux/maps/big-map-store-reducer'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {getIsFetchingEmployeesStore} from '../../selectors/options/employees-reselect'
import {CancelXButtonDriverView} from './cancel-x-button-driver-view/cancel-x-button-driver-view'
import {toNumber, parseToNormalMoney} from '../../utils/parsers'
import {boldWrapper} from '../../utils/html-rebuilds'
import {EmployeeCardType, ResponseToRequestCardType, TrailerCardType, TransportCardType} from '../../types/form-types'


type OwnProps = {
    idEmployee: string,
    isModal?: boolean
}
// для отображения сотрудника на карте
export const AddDriversView: React.FC<OwnProps> = ( { idEmployee, isModal = false } ) => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string | null ): string => urlImage ? currentURL + urlImage : noImage

    const isFetchingEmployee = useSelector(getIsFetchingEmployeesStore)
    const isFetchingRequest = useSelector(getIsFetchingRequestStore)
    const isFetching = isFetchingEmployee && isFetchingRequest

    const label = useSelector(getLabelAddDriverStore)

    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const routes = useSelector(getRoutesStore)

    const { isAnswersMode, isRequestCenterMapMode, isStatusMode } = useMemo(() => ( {
        isAnswersMode: pathname.includes(routes.maps.answers),
        isRequestCenterMapMode: pathname.includes(routes.requestInfo.status),
        isStatusMode: pathname.includes(routes.maps.status),
    } ), [ pathname, routes ])

    // данные tax пользователя, авторизованного в системе
    const requisites = useSelector(getStoredValuesRequisitesStore)

    const currentOneRequest = useSelector(getInitialValuesRequestStore)
    const distance = currentOneRequest?.distance

    // для модульного окна с просмотром картинки
    const setLightBoxImage = ( image?: string | null ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const oneEmployeeFind = useSelector(getFilteredDriversBigMapStore).find(( { idEmployee: id } ) => idEmployee === id)
    const oneEmployee = !isRequestCenterMapMode ? oneEmployeeFind : currentOneRequest.responseEmployee as EmployeeCardType<string>
    const oneEmployeePhoto = oneEmployee?.photoFace
    const employeeOnePhone = oneEmployee?.employeePhoneNumber
    // на какой он сейчас заявке
    const oneEmployeeOnRequestNumber = toNumber(!isRequestCenterMapMode ? oneEmployee?.onCurrentRequest : currentOneRequest?.requestNumber)
    const oneEmployeeStatus = !isRequestCenterMapMode ? oneEmployee?.status : 'на заявке'

    // конкретный ответ на заявку
    const oneResponseFind = useSelector(getFilteredResponsesBigMapStore).find(( { idEmployee: id } ) => idEmployee === id)
    const oneResponse: ResponseToRequestCardType<string> | undefined = !isRequestCenterMapMode ? oneResponseFind : {
        responseTax: currentOneRequest.responseTax + '',
        requestNumber: currentOneRequest.requestNumber + '',
        cargoWeight: currentOneRequest.cargoWeight + '',
        idEmployee: currentOneRequest.idEmployee + '',
        idTrailer: currentOneRequest.idTrailer + '',
        responseId: '0',
        idTransport: currentOneRequest.idTransport + '',
        responsePrice: currentOneRequest.responsePrice + '',
        responseStavka: currentOneRequest.responseStavka + '',
        requestCarrierId: currentOneRequest.requestCarrierId + '',
    }

    const taxMode = isStatusMode ? requisites.taxMode : oneResponse?.responseTax

    const oneTransportFind = useSelector(getFilteredTransportBigMapStore).find(( { idTransport } ) => idTransport === oneEmployee?.idTransport)
    const oneTransport = !isRequestCenterMapMode ? oneTransportFind : currentOneRequest.responseTransport as TransportCardType<string>
    const transportOneImage = oneTransport?.transportImage
    const oneTransportCargoWeight = toNumber(oneTransport?.cargoWeight)

    const oneTrailerFind = useSelector(getFilteredTrailersBigMapStore).find(( { idTrailer } ) => idTrailer === oneEmployee?.idTrailer)
    const oneTrailer = !isRequestCenterMapMode ? oneTrailerFind : currentOneRequest.responseTrailer as TrailerCardType<string>
    const trailerOneImage = oneTrailer?.trailerImage
    const oneTralerCagoWeigth = toNumber(oneTrailer?.cargoWeight)
    // водитель на заявке
    const isDriverOnActiveRequest = isRequestCenterMapMode || isAnswersMode || ( isStatusMode && oneEmployeeStatus === 'на заявке' && !!oneEmployeeOnRequestNumber )

    const responseStavka = isAnswersMode ? oneResponse?.responseStavka
        : isDriverOnActiveRequest && currentOneRequest?.responseStavka
    const responsePrice = isAnswersMode ? oneResponse?.responsePrice
        : isDriverOnActiveRequest ? currentOneRequest?.responsePrice || '' : ''
    const cargoWeight = isAnswersMode
        ? oneResponse?.cargoWeight
        : isDriverOnActiveRequest && currentOneRequest.localStatus?.cargoHasBeenReceived ? currentOneRequest?.cargoWeight : oneTransportCargoWeight + oneTralerCagoWeigth

    // блок для изменения отображения информационных данных в зависимости от статуса водителя и т.п.
    const answerModeTitle = `Заявка ${ currentOneRequest?.requestNumber } от ${ ddMmYearFormat(currentOneRequest?.requestDate) }`
    const title = isDriverOnActiveRequest ? answerModeTitle : oneEmployeeStatus
    const tnKmLabel = `Тонн${ isDriverOnActiveRequest ? ' / км' : '' }:`
    const tnKmData = `${ cargoWeight }т${ isDriverOnActiveRequest ? '/' + distance + 'км' : '' }`

    const transportTitle = oneTransportCargoWeight ? oneTransportCargoWeight + 'тн / ' + oneTransport?.cargoType : 'тягач'
    const transportTradeMarkModel = ( oneTransport?.transportTrademark && oneTransport?.transportTrademark !== '-' ) ? oneTransport?.transportTrademark + ' , ' + oneTransport?.transportModel : '-'
    const trailerTitle = oneTralerCagoWeigth ? oneTralerCagoWeigth + 'тн / ' + oneTrailer?.cargoType : ''
    const trailerTradeMarkModel = ( oneTrailer?.trailerTrademark && oneTrailer?.trailerTrademark !== '-' ) ? oneTrailer?.trailerTrademark + ' , ' + oneTrailer?.trailerModel : '-'


    useEffect(() => {
        if (isStatusMode && oneEmployeeOnRequestNumber && oneEmployeeStatus === 'на заявке' && ( oneEmployeeOnRequestNumber !== currentOneRequest.requestNumber )) {
            dispatch<any>(getOneRequestsAPI(oneEmployeeOnRequestNumber))
        }
    }, [ currentOneRequest.requestNumber, oneEmployeeOnRequestNumber, isAnswersMode, oneEmployeeStatus ])

    // при выборе водителя на заявку
    const onSubmit = useCallback(async () => {
        // закрываем модальное окно, если прорисовка в модалке
        if (isAnswersMode && oneResponse && oneEmployee && oneTransport) {
            await dispatch<any>(addAcceptedResponseToRequestOnAcceptDriver({
                oneResponse,
                oneEmployee,
                oneTransport,
                oneTrailer,
            }))
            await dispatch<any>(textAndActionGlobalModal({
                text: 'Водитель <b>' + oneEmployee?.employeeFIO + '</b> принят на заявку № ' + oneResponse.requestNumber,
                title: 'Информация',
                navigateOnCancel: routes.requestsList,
                navigateOnOk: routes.requestsList,
            }))
        } else {
            await dispatch<any>(textAndActionGlobalModal({
                text: 'Не хватает данных для принятия данного водителя',
            }))
        }
    }, [ oneResponse, oneEmployee, oneTrailer, oneTransport, routes, isModal ])

    // при отмене (отвязке) от заявки водителя
    const onDecline = async () => {
        await dispatch<any>(removeResponseToRequestsBzRemoveThisDriverFromRequest(oneResponse?.responseId + ''))
        await dispatch<any>(setAnswerDriversToMap(currentOneRequest?.requestNumber + ''))
        // зачистка статуса, если сотрудник всего на одной заявке
        if (oneEmployee?.addedToResponse
            // если привязан всего к одной заявке и она сейчас "отвалится"
            && oneEmployee.addedToResponse.split(', ').filter(x => x).length === 1
            // на всякий случай доп. проверка
            && oneEmployee?.status === 'ожидает принятия') {
            await dispatch<any>(modifyOneEmployeeStatusToAPI(idEmployee, 'свободен'))
        } else {
            dispatch<any>(getAllEmployeesAPI())
        }

        // если на заявке ещё останутся ответы
        if (currentOneRequest?.answers?.length && currentOneRequest.answers.length > 1) {
            await dispatch<any>(textAndActionGlobalModal({
                text: 'Сотруднику <b>' + oneEmployee?.employeeFIO + '</b> отказано в участии в заявке',
            }))
        } else {
            await dispatch<any>(textAndActionGlobalModal({
                text: 'На заявке <b>' + currentOneRequest.requestNumber + '</b> больше нет ответов',
                navigateOnOk: routes.requestsList,
                navigateOnCancel: routes.requestsList,
            }))
        }

    }

    // телефон водителя в модалку
    const phoneToModal = ( employeeOnePhone: string | undefined ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: 'Телефон водителя: ' + boldWrapper(employeeOnePhone),
        }))
    }

    if (isFetching) return <Preloader/>

    return (
        <div className={ styles.addDriversForm__wrapper }>
            {/* иконка под невидимую закрывалку на балуне яндекс карты */ }
            { !isModal && <CancelXButtonDriverView/> }
            <h4 className={ styles.addDriversForm__header }>{ title }</h4>
            <div className={ styles.addDriversForm__form }>
                <div
                    className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                    {/* ВОДИТЕЛЬ */ }
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idEmployee + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneEmployee?.employeeFIO }
                        </div>
                    </div>
                    {/* ТЯГАЧ/ТРАНСПОРТ */ }
                    <div className={ styles.addDriversForm__selector }
                         title={ transportTitle }
                    >
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTransport + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { transportTradeMarkModel }
                        </div>
                    </div>
                    {/* ПРИЦЕП */ }
                    <div className={ styles.addDriversForm__selector }
                         title={ trailerTitle }
                    >
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { trailerTradeMarkModel }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoRow
                        + ` ${ !isDriverOnActiveRequest ? styles.addDriversForm__infoRow_fog : '' }`
                    }>
                        {/* СТАВКА ТН.КМ. */ }
                        <div className={ styles.addDriversForm__infoItem }
                             title={ isDriverOnActiveRequest ? 'Вес груза: ' + cargoWeight + 'т.' : '' }
                        >
                            <label className={ styles.addDriversForm__label }>
                                { label.responseStavka + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { responseStavka }
                            </div>
                        </div>
                        {/* СУММА */ }
                        <div className={ styles.addDriversForm__infoItem }
                             title={ isDriverOnActiveRequest ? 'Расстояние: ' + distance + 'км.' : '' }>
                            <label className={ styles.addDriversForm__label }>
                                { label.responsePrice + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { parseToNormalMoney(toNumber(responsePrice)) }
                            </div>
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoRow }>
                        {/* ТОНН/КМ */ }
                        <div className={ styles.addDriversForm__infoItem }>
                            <label className={ styles.addDriversForm__label }>
                                { tnKmLabel }</label>
                            <div className={ styles.addDriversForm__info }>
                                { tnKmData }
                            </div>
                        </div>
                        {/* НАЛОГ */ }
                        <div className={ styles.addDriversForm__infoItem }>
                            <label className={ styles.addDriversForm__label }>
                                { label.responseTax + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { taxMode }
                            </div>
                        </div>
                    </div>
                </div>
                {/*\\\\\\\\\ ФОТО ПАНЕЛЬ /////////*/ }
                <div className={ styles.addDriversForm__photoPanel }>
                    <div className={ styles.addDriversForm__photo }
                         title={ 'Фото водителя' }>
                        <img
                            src={ setImage(oneEmployeePhoto) }
                            alt="driverPhoto"
                            onClick={ () => setLightBoxImage(setImage(oneEmployeePhoto)) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }
                         title={ 'Фото транспорта' }>
                        <img
                            src={ setImage(transportOneImage) }
                            alt="driverTransportPhoto"
                            onClick={ () => setLightBoxImage(setImage(transportOneImage)) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }
                         title={ 'Фото прицепа' }>
                        <img
                            src={ setImage(trailerOneImage) }
                            alt="driverTrailerPhoto"
                            onClick={ () => setLightBoxImage(setImage(trailerOneImage)) }
                        />
                    </div>
                </div>
                <div className={ styles.addDriversForm__buttonsPanel }>
                    { isAnswersMode
                        ? <>
                            <Button colorMode={ 'blue' } title={ 'Принять' }
                                    onClick={ onSubmit }
                            />
                            <span style={ { paddingLeft: '10px' } }/>
                            <Button colorMode={ 'red' } title={ 'Отказать' }
                                    onClick={ onDecline }
                            />
                        </>
                        :
                        <Button type={ 'button' }
                                disabled={ !employeeOnePhone }
                                colorMode={ 'blue' }
                                onClick={ () => {
                                    phoneToModal(employeeOnePhone)
                                } }
                                title={ employeeOnePhone + '' }
                                rounded
                        />
                    }
                </div>
            </div>

        </div>
    )
}
