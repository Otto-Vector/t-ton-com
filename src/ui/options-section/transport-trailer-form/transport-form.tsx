import React, {useEffect, useState} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector, stringArrayToSelectValue} from '../../common/form-selector/form-selector'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {cargoConstType, propertyRights, TransportCardType} from '../../../types/form-types'
import {
    getAllTransportSelectFromLocal,
    getCurrentIdTransportStore,
    getInitialValuesTransportStore,
    getIsFetchingTransportStore,
    getLabelTransportStore,
    getMaskOnTransportStore,
    getOneTransportFromLocal,
    getParsersTransportStore,
    getValidatorsTransportStore,
} from '../../../selectors/options/transport-reselect'

import {
    modifyOneTransportToAPI,
    newTransportSaveToAPI,
    oneTransportDeleteToAPI,
    transportStoreActions,
} from '../../../redux/options/transport-store-reducer';
import {parseAllNumbers} from '../../../utils/parsers';
import {ImageViewSet} from '../../common/image-view-set/image-view-set'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';

type OwnProps = {}


export const TransportForm: React.FC<OwnProps> = () => {

    const header = 'Транспорт'
    const isFetching = useSelector(getIsFetchingTransportStore)

    const defaultInitialValues = useSelector(getInitialValuesTransportStore)
    //для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelTransportStore)
    const maskOn = useSelector(getMaskOnTransportStore)
    const validators = useSelector(getValidatorsTransportStore)
    const parsers = useSelector(getParsersTransportStore)

    const currentId = useSelector(getCurrentIdTransportStore)
    const oneTransport = useSelector(getOneTransportFromLocal)

    const allBusyTransport = useSelector(getAllTransportSelectFromLocal)
    const isBusyFilter = allBusyTransport.filter(( { key, isDisabled } ) => key === currentId && isDisabled)
    const isBusy = isBusyFilter.length > 0

    const transportHasPassToDelete = () => {
        dispatch(globalModalStoreActions.setTextMessage(
            'Транспорт не может быть удалён, он привязан к сотруднику: '
            + ( isBusy && isBusyFilter[0].subLabel ),
        ))
    }
    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>();

    const onSubmit = ( values: TransportCardType<string> ) => {
        const demaskedValues = { ...values, cargoWeight: parseAllNumbers(values.cargoWeight) }
        if (isNew) {
            //сохраняем НОВОЕ значение
            dispatch<any>(newTransportSaveToAPI(demaskedValues, selectedImage))
        } else {
            //сохраняем измененное значение
            dispatch<any>(modifyOneTransportToAPI(demaskedValues, selectedImage))
        }
        navigate(options) // и возвращаемся в предыдущее окно
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const transportDeleteHandleClick = () => {
        dispatch<any>(oneTransportDeleteToAPI(currentId))
        navigate(options)
    }

    useEffect(() => {
            if (currentId === currentIdForShow) {
                setInitialValues(oneTransport)
            } else {
                dispatch(transportStoreActions.setCurrentId(currentIdForShow || ''))
            }
        }, [ currentId, initialValues ],
    )

    return (
        <div className={ styles.transportTrailerForm }>
            <div className={ styles.transportTrailerForm__wrapper }>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={ styles.transportTrailerForm__header }>{ header }</h4>
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
                                    <form onSubmit={ handleSubmit } className={ styles.transportTrailerForm__form }>
                                        <div className={ styles.transportTrailerForm__inputsPanel }>
                                            <Field name={ 'transportNumber' }
                                                   placeholder={ label.transportNumber }
                                                   maskFormat={ maskOn.transportNumber }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportNumber }
                                                   parse={ parsers.transportNumber }
                                            />
                                            <Field name={ 'transportTrademark' }
                                                   placeholder={ label.transportTrademark }
                                                   maskFormat={ maskOn.transportTrademark }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportTrademark }
                                                   parse={ parsers.transportTrademark }
                                            />
                                            <Field name={ 'transportModel' }
                                                   placeholder={ label.transportModel }
                                                   maskFormat={ maskOn.transportModel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.transportModel }
                                                   parse={ parsers.transportModel }
                                            />
                                            <Field name={ 'pts' }
                                                   placeholder={ label.pts }
                                                   maskFormat={ maskOn.pts }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.pts }
                                                   parse={ parsers.pts }
                                            />
                                            <Field name={ 'dopog' }
                                                   placeholder={ label.dopog }
                                                   maskFormat={ maskOn.dopog }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dopog }
                                                   parse={ parsers.dopog }
                                            />

                                            <div className={ styles.transportTrailerForm__smallInput }>
                                                <FormSelector named={ 'cargoType' }
                                                              placeholder={ label.cargoType }
                                                              values={ stringArrayToSelectValue(cargoConstType.map(x => x)) }
                                                              validate={ validators.cargoType }
                                                />
                                            </div>
                                            <div className={ styles.transportTrailerForm__smallInput }>
                                                <Field name={ 'cargoWeight' }
                                                       placeholder={ label.cargoWeight }
                                                       maskFormat={ maskOn.cargoWeight }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.cargoWeight }
                                                       disabled={ values.cargoType === 'Тягач' }
                                                />
                                            </div>
                                            <FormSelector named={ 'propertyRights' }
                                                          placeholder={ label.propertyRights }
                                                          values={ stringArrayToSelectValue(propertyRights.map(x => x)) }
                                                          validate={ validators.propertyRights }
                                            />
                                        </div>
                                        <div className={ styles.transportTrailerForm__rightSide }>
                                            {/*/////////////---ИЗОБРАЖЕНИЕ---///////////////////////////////*/ }
                                            <div className={ styles.transportTrailerForm__photoWrapper }>
                                                <ImageViewSet imageURL={ values.transportImage }
                                                              onSelectNewImageFileToSend={ ( image ) => {
                                                                  setSelectedImage(image)
                                                              } }
                                                />
                                            </div>
                                            <div className={ styles.transportTrailerForm__buttonsPanel }>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'button' }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            onClick={ isBusy ? transportHasPassToDelete : transportDeleteHandleClick }
                                                            rounded
                                                            disabled={ isNew }
                                                    />
                                                </div>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ submitting || hasValidationErrors }
                                                            colorMode={ 'green' }
                                                            title={ 'Cохранить' }
                                                            rounded
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
