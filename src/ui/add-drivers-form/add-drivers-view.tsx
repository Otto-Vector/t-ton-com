import React, {useEffect, useLayoutEffect} from 'react'
import styles from './add-drivers-form.module.scss'
import noImage from '../../media/logo192.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'

import {getLabelAddDriverStore} from '../../selectors/forms/add-driver-reselect'
import {getOneRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getOneEmployeeFromLocal} from '../../selectors/options/employees-reselect'
import {getOneTransportFromLocal} from '../../selectors/options/transport-reselect'

import {getOneTrailerFromLocal} from '../../selectors/options/trailer-reselect'
import {employeesStoreActions} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/utils/lightbox-store-reducer'
import {Preloader} from '../common/preloader/preloader'
import {requestStoreActions} from '../../redux/forms/request-store-reducer'
import {Button} from '../common/button/button'
import {AppStateType} from '../../redux/redux-store'
import {MaterialIcon} from '../common/material-icon/material-icon'


type OwnProps = {
    idEmployee: string,
}
// для отображения сотрудника на карте
export const AddDriversView: React.FC<OwnProps> = ( { idEmployee } ) => {

    const currentURL = useSelector(( state: AppStateType ) => state.baseStoreReducer.serverURL)
    const setImage = ( urlImage?: string | null ): string => urlImage ? currentURL + urlImage : noImage

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const initialValues = useSelector(getOneEmployeeFromLocal)
    const label = useSelector(getLabelAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    const oneRequest = useSelector(getOneRequestStore)
    const distance = oneRequest?.distance
    const dispatch = useDispatch()

    const setLightBoxImage = ( image?: string | null ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    // const oneEmployee = useSelector(getOneEmployeesFromLocal)
    // const employeeOneImage = oneEmployee.photoFace
    const employeeOnePhone = initialValues.employeePhoneNumber

    const oneTransport = useSelector(getOneTransportFromLocal)

    const transportOneImage = oneTransport.transportImage
    // const transportOneCargoWeight = oneTransport.cargoWeight

    const oneTrailer = useSelector(getOneTrailerFromLocal)
    const trailerOneImage = oneTrailer.trailerImage
    // const trailerOneCargoWeight = oneTrailer.cargoWeight

    const clickForTests = () => {
        // dispatch<any>(setOrganizationRequisites())
        // dispatch<any>(getAllShippersAPI())
    }

    useLayoutEffect(() => {
        // dispatch<any>(getTestAddDriverValues())
        dispatch(employeesStoreActions.setCurrentId(idEmployee))
        dispatch(requestStoreActions.setCurrentRequestNumber(76))
    })

    useEffect(() => {
        // dispatch(employeesStoreActions.setCurrentId(initialValues.employeeFIO || ''))
        dispatch(transportStoreActions.setCurrentId(initialValues.idTransport || ''))
        dispatch(trailerStoreActions.setCurrentId(initialValues.idTrailer || ''))
    }, [ initialValues ])

    if (isFetching) return <Preloader/>

    return (
        <div className={ styles.addDriversForm__wrapper }>
            {/* иконка под невидимую закрывалку на балуне яндекс карты */}
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
                            { initialValues.employeeFIO }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTransport + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTransport.transportModel }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.idTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTrailer.trailerModel }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.responseStavka + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { initialValues.rating }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }
                         title={ 'Расстояние: ' + distance + 'км.' }>
                        <label className={ styles.addDriversForm__label }>
                            { label.responsePrice + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneRequest?.responsePrice }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { 'Рейсы шт.:' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { initialValues.rating || '-' }
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
                            src={ setImage(initialValues.photoFace) }
                            alt="driverPhoto"
                            onClick={ () => setLightBoxImage(setImage(initialValues.photoFace)) }
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
                    <a role="button"
                       href={ `tel:${ employeeOnePhone }` }
                       className={ styles.addDriversForm__buttonHrefWrapper }>
                        <Button type={ 'button' }
                                disabled={ !employeeOnePhone }
                                colorMode={ 'blue' }
                                onClick={ () => {
                                    clickForTests()
                                } }
                                title={ employeeOnePhone + '' }
                                rounded
                        />
                    </a>
                </div>
            </div>

        </div>
    )
}
