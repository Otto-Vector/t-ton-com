import React, {useEffect, useLayoutEffect, useMemo} from 'react'
import styles from './add-drivers-form.module.scss'
import noImage from '../../media/logo192.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'

import {getLabelAddDriverStore} from '../../selectors/forms/add-driver-reselect'
import {getInitialValuesRequestStore, getOneRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getOneEmployeeFromLocal} from '../../selectors/options/employees-reselect'
import {getOneTransportFromLocal} from '../../selectors/options/transport-reselect'

import {getOneTrailerFromLocal} from '../../selectors/options/trailer-reselect'
import {
    employeesStoreActions,
    getAllEmployeesAPI, modifyOneEmployeeStatusToAPI,
    modifyOneEmployeeToAPI,
} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/utils/lightbox-store-reducer'
import {Preloader} from '../common/preloader/preloader'
import {requestStoreActions} from '../../redux/forms/request-store-reducer'
import {Button} from '../common/button/button'
import {AppStateType} from '../../redux/redux-store'
import {MaterialIcon} from '../common/material-icon/material-icon'
import {
    getFilteredDriversBigMapStore, getFilteredResponsesBigMapStore,
    getFilteredTrailersBigMapStore,
    getFilteredTransportBigMapStore,
} from '../../selectors/maps/big-map-reselect'
import {useLocation} from 'react-router-dom'
import {getRoutesStore} from '../../selectors/routes-reselect'
import {removeResponseToRequestsBzRemoveThisDriverFromRequest} from '../../redux/forms/add-driver-store-reducer'
import {setAnswerDriversToMap} from '../../redux/maps/big-map-store-reducer'
import {textAndActionGlobalModal} from '../../redux/utils/global-modal-store-reducer'
import {EmployeeCardType} from '../../types/form-types'


type OwnProps = {
    idEmployee: string,
}
// для отображения сотрудника на карте
export const AddDriversView: React.FC<OwnProps> = ( { idEmployee } ) => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string | null ): string => urlImage ? currentURL + urlImage : noImage

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const label = useSelector(getLabelAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    // const oneRequest = useSelector(getOneRequestStore)
    const oneRequest = useSelector(getInitialValuesRequestStore)
    const distance = oneRequest?.distance
    const dispatch = useDispatch()
    const { pathname } = useLocation()
    const routes = useSelector(getRoutesStore)

    const mapModes = useMemo(() => ( {
        answersMode: pathname.includes(routes.maps.answers),
        routesMode: pathname.includes(routes.maps.routes),
    } ), [ pathname ])

    const setLightBoxImage = ( image?: string | null ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const oneEmployee = useSelector(getFilteredDriversBigMapStore).find(( { idEmployee: id } ) => idEmployee === id)
    const employeeOnePhone = oneEmployee?.employeePhoneNumber

    const oneResponse = useSelector(getFilteredResponsesBigMapStore).find(( { idTransport } ) => idTransport === oneEmployee?.idTransport)

    const oneTransport = useSelector(getFilteredTransportBigMapStore).find(( { idTransport } ) => idTransport === oneEmployee?.idTransport)
    const transportOneImage = oneTransport?.transportImage

    const oneTrailer = useSelector(getFilteredTrailersBigMapStore).find(( { idTrailer } ) => idTrailer === oneEmployee?.idTrailer)
    const trailerOneImage = oneTrailer?.trailerImage

    // перевозимый вес транспорта
    const transportOneCargoWeight = +( oneTransport?.cargoWeight || 0 )
    // перевозимый вес прицепа
    const trailerOneCargoWeight = +( oneTrailer?.cargoWeight || 0 )
    // общий вес перевозимого груза
    const cargoWeight = ( trailerOneCargoWeight + transportOneCargoWeight ).toString()

    const onSubmit = () => {
    }

    // при отмене (отвязке) от заявки водителя
    const onDecline = async () => {
        await dispatch<any>(removeResponseToRequestsBzRemoveThisDriverFromRequest(oneResponse?.responseId + ''))
        await dispatch<any>(setAnswerDriversToMap(oneRequest?.requestNumber + ''))
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
        if (oneRequest?.answers?.length && oneRequest.answers.length > 1) {
            await dispatch<any>(textAndActionGlobalModal({
                text: 'Сотруднику <b>' + oneEmployee?.employeeFIO + '</b> отказано в участии в заявке',
            }))
        } else {
            await dispatch<any>(textAndActionGlobalModal({
                text: 'На заявке <b>' + oneRequest.requestNumber + '</b> больше нет ответов',
                navigateOnOk: routes.requestsList,
                navigateOnCancel: routes.requestsList,
            }))
        }
    }

    if (isFetching) return <Preloader/>

    return (
        <div className={ styles.addDriversForm__wrapper }>
            {/* иконка под невидимую закрывалку на балуне яндекс карты */ }
            <MaterialIcon icon_name={ 'highlight_off' }
                          style={ {
                              position: 'absolute',
                              top: '7px',
                              right: '7px',
                              fontSize: '20px',
                              color: 'rgb(2, 62, 138)',
                          } }
            />
            <h4 className={ styles.addDriversForm__header }>{
                `Заявка ${ oneRequest?.requestNumber } от ${ ddMmYearFormat(oneRequest?.requestDate) }`
            }</h4>

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
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTransport + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTransport?.transportModel || '-' }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTrailer?.trailerModel || '-' }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoItem }
                         title={ 'Вес груза: ' + oneResponse?.cargoWeight + 'т.' }
                    >
                        <label className={ styles.addDriversForm__label }>
                            { label.responseStavka + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneResponse?.responseStavka }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }
                         title={ 'Расстояние: ' + distance + 'км.' }>
                        <label className={ styles.addDriversForm__label }>
                            { label.responsePrice + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneResponse?.responsePrice }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { 'Рейсы шт.:' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneEmployee?.rating || '-' }
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
                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                <div className={ styles.addDriversForm__photoPanel }>
                    <div className={ styles.addDriversForm__photo }>
                        <img
                            src={ setImage(oneEmployee?.photoFace) }
                            alt="driverPhoto"
                            onClick={ () => setLightBoxImage(setImage(oneEmployee?.photoFace)) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }>
                        <img
                            src={ setImage(transportOneImage) }
                            alt="driverTransportPhoto"
                            onClick={ () => setLightBoxImage(setImage(transportOneImage)) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }>
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
                                        console.log('нажали кнопку')
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
