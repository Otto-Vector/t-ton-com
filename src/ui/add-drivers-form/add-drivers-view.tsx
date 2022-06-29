import React, {useLayoutEffect} from 'react'
import styles from './add-drivers-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../common/button/button'
import {Preloader} from '../common/preloader/preloader'
import noImagePhoto from '../../media/noImagePhoto2.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {CancelButton} from '../common/cancel-button/cancel-button'
import {AddDriverCardType} from '../../types/form-types'

import {
    getInitialValuesAddDriverStore,
    getLabelAddDriverStore,
    getPlaceholderAddDriverStore,
    getValidatorsAddDriverStore,
} from '../../selectors/forms/add-driver-reselect'
import {FormSelector} from '../common/form-selector/form-selector'
import {FormInputType} from '../common/form-input-type/form-input-type'
import {getOneRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {
    getAllEmployeesSelectFromLocal,
    getOneEmployeesFromLocal,
} from '../../selectors/options/employees-reselect'
import {
    getAllTransportSelectFromLocal,
    getOneTransportFromLocal,
} from '../../selectors/options/transport-reselect'

import {
    getAllTrailerSelectFromLocal,
    getOneTrailerFromLocal,
} from '../../selectors/options/trailer-reselect'
import {employeesStoreActions} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/lightbox-store-reducer'

type OwnProps = {}

export const AddDriversView: React.FC<OwnProps> = () => {

    const header = ( requestNumber: number, shipmentDate: Date ): string =>
        `Заявка ${ requestNumber } от ${ ddMmYearFormat(shipmentDate) }`

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const initialValues = useSelector(getInitialValuesAddDriverStore)
    const label = useSelector(getLabelAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    const { distance } = useSelector(getOneRequestStore)
    const dispatch = useDispatch()

    const setLightBoxImage = ( image?: string ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const resultDistanceCost = ( ...args: number[] ): number =>
        args.reduce(( a, b ) => a * b) * ( distance || 1 )


    const oneEmployee = useSelector(getOneEmployeesFromLocal)
    const employeeOneImage = oneEmployee.photoFace
    // const employeeOnePhone = oneEmployee.employeePhoneNumber

    const oneTransport = useSelector(getOneTransportFromLocal)

    const transportOneImage = oneTransport.transportImage
    const transportOneCargoWeight = oneTransport.cargoWeight

    const oneTrailer = useSelector(getOneTrailerFromLocal)
    const trailerOneImage = oneTrailer.trailerImage
    const trailerOneCargoWeight = oneTrailer.cargoWeight

    useLayoutEffect(() => {
        dispatch(employeesStoreActions.setCurrentId(+( initialValues.driverFIO || 0 )))
        dispatch(transportStoreActions.setCurrentId(+( initialValues.driverTransport || 0 )))
        dispatch(trailerStoreActions.setCurrentId(+( initialValues.driverTrailer || 0 )))
    })

    return (
        <div className={ styles.addDriversForm__wrapper }>
            <h4 className={ styles.addDriversForm__header }>{ header(999, new Date()) }</h4>

            <div className={ styles.addDriversForm__form }>
                <div
                    className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverFIO + ':' }</label>
                        <div className={ styles.addDriversForm__infoItem }>
                            { initialValues.driverFIO }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverTransport + ':' }</label>
                        <div className={ styles.addDriversForm__infoItem }>
                            { initialValues.driverTransport }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__infoItem }>
                            { initialValues.driverTrailer }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverStavka + ':' }</label>

                        <div className={ styles.addDriversForm__infoItem }>
                            { initialValues.driverStavka }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }
                         title={ 'Расстояние: ' + distance + 'км.' }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverSumm + ':' }</label>
                        <div className={ styles.addDriversForm__info + ' ' +
                            styles.addDriversForm__info_long }>
                            {
                                resultDistanceCost(
                                    +( initialValues.driverStavka || 0 ),
                                    (
                                        +( trailerOneCargoWeight || 0 )
                                        +
                                        +( transportOneCargoWeight || 0 )
                                    ),
                                ).toString()
                            }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverRating + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { initialValues.driverRating || '-' }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverTax + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { initialValues.driverTax || taxMode }
                        </div>
                    </div>
                </div>
                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/ }
                <div className={ styles.addDriversForm__photoPanel }>
                    <div className={ styles.addDriversForm__photo }>
                        <img
                            src={ employeeOneImage || noImagePhoto }
                            alt="driverPhoto"
                            onClick={ () => setLightBoxImage(employeeOneImage) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }>
                        <img
                            src={ transportOneImage || noImagePhoto }
                            alt="driverTransportPhoto"
                            onClick={ () => setLightBoxImage(transportOneImage) }
                        />
                    </div>
                    <div className={ styles.addDriversForm__photo }>
                        <img
                            src={ trailerOneImage || noImagePhoto }
                            alt="driverTrailerPhoto"
                            onClick={ () => setLightBoxImage(trailerOneImage) }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
