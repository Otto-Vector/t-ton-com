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


type OwnProps = {
    idEmployee: string,
}
// для отображения сотрудника на карте
export const AddDriversView: React.FC<OwnProps> = ( { idEmployee } ) => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string | null ): string => urlImage ? currentURL + urlImage : noImage

    const isFetchingEmployee = useSelector(getIsFetchingEmployeesStore)
    const isFetchingRequest = useSelector(getIsFetchingRequestStore)
    const isFetching = isFetchingEmployee && isFetchingRequest

    const label = useSelector(getLabelAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)

    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const routes = useSelector(getRoutesStore)

    const mapModes = useMemo(() => ( {
        answersMode: pathname.includes(routes.maps.answers),
        routesMode: pathname.includes(routes.maps.routes),
        statusMode: pathname.includes(routes.maps.status),
    } ), [ pathname, routes ])

    const currentOneRequest = useSelector(getInitialValuesRequestStore)
    const distance = currentOneRequest?.distance

    // для модульного окна с просмотром картинки
    const setLightBoxImage = ( image?: string | null ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const oneEmployee = useSelector(getFilteredDriversBigMapStore).find(( { idEmployee: id } ) => idEmployee === id)
    const employeeOnePhone = oneEmployee?.employeePhoneNumber
    const oneEmployeeOnRequestNumber = +( oneEmployee?.onCurrentRequest || 0 )
    const oneEmployeeStatus = oneEmployee?.status

    const oneResponse = useSelector(getFilteredResponsesBigMapStore).find(( { idEmployee: id } ) => idEmployee === id)

    const oneTransport = useSelector(getFilteredTransportBigMapStore).find(( { idTransport } ) => idTransport === oneEmployee?.idTransport)
    const transportOneImage = oneTransport?.transportImage
    const oneTransportCargoWeight = +( oneTransport?.cargoWeight || 0 )

    const oneTrailer = useSelector(getFilteredTrailersBigMapStore).find(( { idTrailer } ) => idTrailer === oneEmployee?.idTrailer)
    const trailerOneImage = oneTrailer?.trailerImage
    const oneTralerCagoWeigth = +( oneTrailer?.cargoWeight || 0 )
    // водитель на заявке
    const isDriverOnActiveRequest = mapModes.answersMode || ( mapModes.statusMode && oneEmployeeStatus === 'на заявке' && !!oneEmployeeOnRequestNumber )

    const responseStavka = mapModes.answersMode ? oneResponse?.responseStavka
        : isDriverOnActiveRequest && currentOneRequest?.responseStavka
    const responsePrice = mapModes.answersMode ? oneResponse?.responsePrice
        : isDriverOnActiveRequest ? currentOneRequest?.responsePrice || '' : ''
    const cargoWeight = mapModes.answersMode
        ? oneResponse?.cargoWeight
        : isDriverOnActiveRequest ? currentOneRequest?.cargoWeight : oneTransportCargoWeight + oneTralerCagoWeigth

    // блок для изменения отображения информационных данных в зависимости от статуса водителя и т.п.
    const answerModeTitle = `Заявка ${ currentOneRequest?.requestNumber } от ${ ddMmYearFormat(currentOneRequest?.requestDate) }`
    const title = isDriverOnActiveRequest ? answerModeTitle : oneEmployeeStatus
    const tnKmLabel = `Тонн${ isDriverOnActiveRequest ? ' / км' : '' }:`
    const tnKmData = `${ cargoWeight }т${ isDriverOnActiveRequest ? '/' + distance + 'км' : '' }`

    const transportTitle = oneTransportCargoWeight ? oneTransportCargoWeight + 'тн / ' + oneTransport?.cargoType : 'тягач'
    const trailerTitle = oneTralerCagoWeigth ? oneTralerCagoWeigth + 'тн / ' + oneTrailer?.cargoType : ''


    useEffect(() => {
        if (mapModes.statusMode && oneEmployeeOnRequestNumber && oneEmployeeStatus === 'на заявке' && ( oneEmployeeOnRequestNumber !== currentOneRequest.requestNumber )) {
            dispatch<any>(getOneRequestsAPI(oneEmployeeOnRequestNumber))
        }
    }, [ currentOneRequest.requestNumber, oneEmployeeOnRequestNumber, mapModes.answersMode, oneEmployeeStatus ])

    // при выборе водителя на заявку
    const onSubmit = useCallback(async () => {
        if (mapModes.answersMode && oneResponse && oneEmployee && oneTransport) {
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
    }, [ oneResponse, oneEmployee, oneTrailer, oneTransport, routes ])

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

    if (isFetching) return <Preloader/>

    return (
        <div className={ styles.addDriversForm__wrapper }>
            {/* иконка под невидимую закрывалку на балуне яндекс карты */ }
            <CancelXButtonDriverView/>
            <h4 className={ styles.addDriversForm__header }>{ title }</h4>
            <div className={ styles.addDriversForm__form }>
                <div
                    className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idEmployee + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneEmployee?.employeeFIO }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }
                         title={ transportTitle }
                    >
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTransport + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTransport?.transportModel || '-' }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }
                         title={ trailerTitle }
                    >
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTrailer?.trailerModel || '-' }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoRow
                        + ` ${ !isDriverOnActiveRequest ? styles.addDriversForm__infoRow_fog : '' }`
                    }>
                        <div className={ styles.addDriversForm__infoItem }
                             title={ isDriverOnActiveRequest ? 'Вес груза: ' + cargoWeight + 'т.' : '' }
                        >
                            <label className={ styles.addDriversForm__label }>
                                { label.responseStavka + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { responseStavka }
                            </div>
                        </div>
                        <div className={ styles.addDriversForm__infoItem }
                             title={ isDriverOnActiveRequest ? 'Расстояние: ' + distance + 'км.' : '' }>
                            <label className={ styles.addDriversForm__label }>
                                { label.responsePrice + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { responsePrice }
                            </div>
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoRow }>
                        <div className={ styles.addDriversForm__infoItem }>
                            <label className={ styles.addDriversForm__label }>
                                { tnKmLabel }</label>
                            <div className={ styles.addDriversForm__info }>
                                { tnKmData }
                            </div>
                        </div>
                        <div className={ styles.addDriversForm__infoItem }>
                            <label className={ styles.addDriversForm__label }>
                                { label.responseTax + ':' }</label>
                            <div className={ styles.addDriversForm__info }>
                                { taxMode }
                            </div>
                        </div>
                    </div>
                </div>
                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                <div className={ styles.addDriversForm__photoPanel }>
                    <div className={ styles.addDriversForm__photo }
                         title={ 'Фото водителя' }>
                        <img
                            src={ setImage(oneEmployee?.photoFace) }
                            alt="driverPhoto"
                            onClick={ () => setLightBoxImage(setImage(oneEmployee?.photoFace)) }
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
                    { mapModes.answersMode
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
                        <a role="button"
                           href={ `tel:${ employeeOnePhone }` }
                           className={ styles.addDriversForm__buttonHrefWrapper }>
                            <Button type={ 'button' }
                                    disabled={ !employeeOnePhone }
                                    colorMode={ 'blue' }
                                    onClick={ () => {
                                        console.log('нажали кнопку с номером телефона')
                                    } }
                                    title={ employeeOnePhone + '' }
                                    rounded
                            />
                        </a> }
                </div>
            </div>

        </div>
    )
}
