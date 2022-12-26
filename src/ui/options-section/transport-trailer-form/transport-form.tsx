import React, {useCallback, useEffect, useState} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/preloader/preloader'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate, useParams} from 'react-router-dom'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector} from '../../common/form-selector/form-selector'
import {InfoText} from '../../common/info-text/into-text'
import {CancelButton} from '../../common/cancel-button/cancel-button'
import {cargoConstType, propertyRights, TransportCardType} from '../../../types/form-types'
import {
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
import {syncParsers} from '../../../utils/parsers';
import {ImageViewSet} from '../../common/image-view-set/image-view-set'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer';
import {stringArrayToSelectValue} from '../../common/form-selector/selector-utils';
import {SwitchMask} from '../../common/antd-switch/antd-switch';
import {syncValidators} from '../../../utils/validators';
import {getIsBusyTransport} from '../../../selectors/options/for-selectors/all-selectors-buffer-reselect';
import {getCargoTypeBaseStore, getPropertyRightsBaseStore} from '../../../selectors/base-reselect';


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
    const cargoTypes = useSelector(getCargoTypeBaseStore) as typeof cargoConstType
    const propertyRightsGlobal = useSelector(getPropertyRightsBaseStore) as typeof propertyRights

    const currentId = useSelector(getCurrentIdTransportStore)
    const oneTransport = useSelector(getOneTransportFromLocal)

    const isBusyTransport = useSelector(getIsBusyTransport)

    const transportHasPassToDelete = () => {
        dispatch(globalModalStoreActions.setTextMessage(
            'Транспорт не может быть удалён, он привязан к сотруднику: '
            + ( isBusyTransport?.subLabel ),
        ))
    }

    const unchangeableField = () => {
        dispatch(globalModalStoreActions.setTextMessage(
            'Данное поле Прицепа не может быть изменено, пока он привязан к сотруднику: '
            + ( isBusyTransport?.subLabel ),
        ))
    }

    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'
    // переменные для переключателей
    const [ transportNumberRusCheck, setTransportNumberRusCheck ] = useState(isNew)
    const [ ptsRusCheck, setPtsRusCheck ] = useState(isNew)

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>();
    const [ isImageChanged, setIsImageChanged ] = useState(false);

    const onSubmit = useCallback(( values: TransportCardType<string> ) => {

        const demaskedValues: TransportCardType<string> = {
            ...values,
            cargoWeight: syncParsers.parseAllNumbers(values.cargoWeight),
            transportNumber: syncParsers.clearNormalizeTrailerTransportNumberAtEnd(values.transportNumber),
        }

        if (isNew) {
            //сохраняем НОВОЕ значение
            dispatch<any>(newTransportSaveToAPI(demaskedValues, selectedImage))
        } else {
            //сохраняем измененное значение
            dispatch<any>(modifyOneTransportToAPI(demaskedValues, selectedImage))
        }
        navigate(options) // и возвращаемся в предыдущее окно

    }, [ selectedImage, isNew, navigate, options ])


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
    }, [ currentId, initialValues ])

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
                                      pristine,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.transportTrailerForm__form }>
                                        <div className={ styles.transportTrailerForm__inputsPanel }>
                                            <div className={ styles.transportTrailerForm__inputsPanel_withSwitcher }>
                                                <Field name={ 'transportNumber' }
                                                       placeholder={ label.transportNumber }
                                                       maskFormat={ transportNumberRusCheck ? maskOn.transportNumber : undefined }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ transportNumberRusCheck ? validators.transportNumber : syncValidators.textReqMicro }
                                                       parse={ transportNumberRusCheck ? parsers.transportNumber : undefined }
                                                       formatCharsToMaskA={ '[АВЕКМНОРСТУХавекмнорстухABEKMHOPCTYXabekmhopctyx]' }
                                                       allowEmptyFormatting={ transportNumberRusCheck }
                                                       isInputMask={ transportNumberRusCheck }
                                                />
                                                <SwitchMask
                                                    checked={ transportNumberRusCheck }
                                                    onClick={ () => {
                                                        setTransportNumberRusCheck(!transportNumberRusCheck)
                                                    } }
                                                />
                                            </div>
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
                                            <div className={ styles.transportTrailerForm__inputsPanel_withSwitcher }>
                                                <Field name={ 'pts' }
                                                       placeholder={ label.pts }
                                                       maskFormat={ ptsRusCheck ? maskOn.pts : undefined }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ ptsRusCheck ? validators.pts : syncValidators.textReqMicro }
                                                       parse={ ptsRusCheck ? parsers.pts : undefined }
                                                       formatCharsToMaskA={ '[АВЕКМНОРСТУХавекмнорстухABEKMHOPCTYXabekmhopctyx]' }
                                                       allowEmptyFormatting={ ptsRusCheck }
                                                       isInputMask={ ptsRusCheck }
                                                />
                                                <SwitchMask
                                                    checked={ ptsRusCheck }
                                                    onClick={ () => {
                                                        setPtsRusCheck(!ptsRusCheck)
                                                    } }
                                                />
                                            </div>
                                            <Field name={ 'dopog' }
                                                   placeholder={ label.dopog }
                                                   maskFormat={ maskOn.dopog }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.dopog }
                                                   parse={ parsers.dopog }
                                            />
                                            <div className={ styles.transportTrailerForm__smallInput }
                                                 onClick={ isBusyTransport && unchangeableField }
                                            >
                                                <FormSelector nameForSelector={ 'cargoType' }
                                                              placeholder={ label.cargoType }
                                                              values={ stringArrayToSelectValue([ ...cargoTypes ]) }
                                                              handleChanger={ ( val: string ) => {
                                                                  if (val === 'Тягач') {
                                                                      form.resetFieldState('cargoWeight')
                                                                      form.change('cargoWeight', '')
                                                                  }
                                                              } }
                                                              validate={ validators.cargoType }
                                                              disabled={ !!isBusyTransport }
                                                />
                                            </div>
                                            <div className={ styles.transportTrailerForm__smallInput }
                                                 onClick={ isBusyTransport && unchangeableField }
                                            >
                                                <Field name={ 'cargoWeight' }
                                                       placeholder={ label.cargoWeight }
                                                       maskFormat={ maskOn.cargoWeight }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ validators.cargoWeight }
                                                       disabled={ values.cargoType === 'Тягач' || !!isBusyTransport }
                                                />
                                            </div>
                                            <FormSelector nameForSelector={ 'propertyRights' }
                                                          placeholder={ label.propertyRights }
                                                          values={ stringArrayToSelectValue([ ...propertyRightsGlobal ]) }
                                                          validate={ validators.propertyRights }
                                            />
                                        </div>
                                        <div className={ styles.transportTrailerForm__rightSide }>
                                            {/*/////////////---ИЗОБРАЖЕНИЕ---///////////////////////////////*/ }
                                            <div className={ styles.transportTrailerForm__photoWrapper }>
                                                <ImageViewSet imageURL={ values.transportImage }
                                                              onSelectNewImageFileToSend={ ( image ) => {
                                                                  setSelectedImage(image)
                                                                  setIsImageChanged(true)
                                                              } }
                                                />
                                            </div>
                                            <div className={ styles.transportTrailerForm__buttonsPanel }>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'button' }
                                                            colorMode={ 'red' }
                                                            title={ 'Удалить' }
                                                            onClick={ isBusyTransport ? transportHasPassToDelete : transportDeleteHandleClick }
                                                            rounded
                                                            disabled={ isNew }
                                                    />
                                                </div>
                                                <div className={ styles.transportTrailerForm__button }>
                                                    <Button type={ 'submit' }
                                                            disabled={ !isImageChanged && ( submitting || pristine ) }
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
                    </>
                }
                <CancelButton onCancelClick={ onCancelClick }/>
                <InfoText/>
            </div>
        </div>
    )
}
