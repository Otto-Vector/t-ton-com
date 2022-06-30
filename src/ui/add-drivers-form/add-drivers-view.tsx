import React, {useEffect, useLayoutEffect} from 'react'
import styles from './add-drivers-form.module.scss'
import noImagePhoto from '../../media/noImagePhoto2.png'
import {useDispatch, useSelector} from 'react-redux'
import {
    getIsFetchingRequisitesStore,
    getStoredValuesRequisitesStore,
} from '../../selectors/options/requisites-reselect'

import {
    getInitialValuesAddDriverStore,
    getLabelAddDriverStore,
} from '../../selectors/forms/add-driver-reselect'
import {getOneRequestStore} from '../../selectors/forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {
    getOneEmployeesFromLocal,
} from '../../selectors/options/employees-reselect'
import {
    getOneTransportFromLocal,
} from '../../selectors/options/transport-reselect'

import {
    getOneTrailerFromLocal,
} from '../../selectors/options/trailer-reselect'
import {employeesStoreActions} from '../../redux/options/employees-store-reducer'
import {transportStoreActions} from '../../redux/options/transport-store-reducer'
import {trailerStoreActions} from '../../redux/options/trailer-store-reducer'
import {lightBoxStoreActions} from '../../redux/lightbox-store-reducer'
import {getTestAddDriverValues} from '../../redux/forms/add-driver-store-reducer';
import {Preloader} from '../common/preloader/preloader';
import {requestStoreActions} from '../../redux/forms/request-store-reducer';
import {Button} from '../common/button/button';

type OwnProps = {}

export const AddDriversView: React.FC<OwnProps> = () => {

    const isFetching = useSelector(getIsFetchingRequisitesStore)

    const initialValues = useSelector(getInitialValuesAddDriverStore)
    const label = useSelector(getLabelAddDriverStore)
    const { taxMode } = useSelector(getStoredValuesRequisitesStore)
    const oneRequest = useSelector(getOneRequestStore)
    const distance = oneRequest?.distance
    const dispatch = useDispatch()

    const setLightBoxImage = ( image?: string ) => {
        dispatch(lightBoxStoreActions.setLightBoxImage(image || ''))
    }

    const resultDistanceCost = ( ...args: number[] ): number =>
        args.reduce(( a, b ) => a * b) * ( distance || 1 )

    const oneEmployee = useSelector(getOneEmployeesFromLocal)
    const employeeOneImage = oneEmployee.photoFace
    const employeeOnePhone = oneEmployee.employeePhoneNumber

    const oneTransport = useSelector(getOneTransportFromLocal)

    const transportOneImage = oneTransport.transportImage
    const transportOneCargoWeight = oneTransport.cargoWeight

    const oneTrailer = useSelector(getOneTrailerFromLocal)
    const trailerOneImage = oneTrailer.trailerImage
    const trailerOneCargoWeight = oneTrailer.cargoWeight

    useLayoutEffect(() => {
        dispatch<any>(getTestAddDriverValues())
        dispatch(requestStoreActions.setRequestNumber(375))
    })

    useEffect(() => {
        dispatch(employeesStoreActions.setCurrentId(+( initialValues.driverFIO || 0 )))
        dispatch(transportStoreActions.setCurrentId(+( initialValues.driverTransport || 0 )))
        dispatch(trailerStoreActions.setCurrentId(+( initialValues.driverTrailer || 0 )))
    }, [ initialValues ])

    if (isFetching) return <Preloader/>

    return (
        <div className={ styles.addDriversForm__wrapper }>
            <h4 className={ styles.addDriversForm__header }>{
                `Заявка ${ oneRequest?.id } от ${ ddMmYearFormat(oneRequest?.requestDate) }`
            }</h4>

            <div className={ styles.addDriversForm__form }>
                <div
                    className={ styles.addDriversForm__inputsPanel + ' ' + styles.addDriversForm__inputsPanel_titled }>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverFIO + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneEmployee.employeeFIO }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverTransport + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTransport.transportModel }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__selector }>
                        <label
                            className={ styles.addDriversForm__label }>{ label.driverTrailer + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneTrailer.trailerModel }
                        </div>
                    </div>
                </div>
                <div className={ styles.addDriversForm__infoPanel }>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverStavka + ':' }</label>

                        <div className={ styles.addDriversForm__info }>
                            { initialValues.driverStavka }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }
                         title={ 'Расстояние: ' + distance + 'км.' }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverSumm + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            {
                                resultDistanceCost(
                                    +( initialValues.driverStavka || 0 ),
                                    (
                                        +( trailerOneCargoWeight || 0 )
                                        +
                                        +( transportOneCargoWeight || 0 )
                                    ),
                                ).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                            }
                        </div>
                    </div>
                    <div className={ styles.addDriversForm__infoItem }>
                        <label className={ styles.addDriversForm__label }>
                            { label.driverRating + ':' }</label>
                        <div className={ styles.addDriversForm__info }>
                            { oneEmployee.rating || '-' }
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
                <div className={ styles.addDriversForm__buttonsPanel }>
                    <a role="button" href={ `tel:${ employeeOnePhone }` }
                    className={styles.addDriversForm__buttonHrefWrapper}>
                        <Button type={ 'button' }
                                disabled={ !employeeOnePhone }
                                colorMode={ 'blue' }
                                title={ employeeOnePhone }
                                rounded
                        />
                    </a>
                </div>
            </div>

        </div>
    )
}
