import React, {useCallback, useEffect, useMemo, useState} from 'react'
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
import {cargoConstType, propertyRights, TrailerCardType} from '../../../types/form-types'
import {
    getCurrentIdTrailerStore,
    getInitialValuesTrailerStore,
    getIsFetchingTrailerStore,
    getLabelTrailerStore,
    getMaskOnTrailerStore,
    getOneTrailerFromLocal,
    getParsersTrailerStore,
    getValidatorsTrailerStore,
} from '../../../selectors/options/trailer-reselect'
import {
    modifyOneTrailerToAPI,
    newTrailerSaveToAPI,
    oneTrailerDeleteToAPI,
    trailerStoreActions,
} from '../../../redux/options/trailer-store-reducer'
import {ImageViewSet} from '../../common/image-view-set/image-view-set'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer'
import {stringArrayToSelectValue} from '../../common/form-selector/selector-utils'
import {SwitchMask} from '../../common/antd-switch/antd-switch'
import {syncValidators} from '../../../utils/validators'
import {syncParsers} from '../../../utils/parsers'
import {getIsBusyTrailer} from '../../../selectors/options/for-selectors/all-selectors-buffer-reselect'
import {getCargoTypeBaseStore, getPropertyRightsBaseStore} from '../../../selectors/base-reselect'

import createDecorator from 'final-form-focus'

type OwnProps = {}


export const TrailerForm: React.FC<OwnProps> = () => {

    const header = 'Прицеп'
    const isFetching = useSelector(getIsFetchingTrailerStore)

    const defaultInitialValues = useSelector(getInitialValuesTrailerStore)
    //для проброса загруженных данных в форму
    const [ initialValues, setInitialValues ] = useState(defaultInitialValues)

    const label = useSelector(getLabelTrailerStore)
    const maskOn = useSelector(getMaskOnTrailerStore)
    const validators = useSelector(getValidatorsTrailerStore)
    const parsers = useSelector(getParsersTrailerStore)
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator(), [])

    const cargoTypes = useSelector(getCargoTypeBaseStore) as typeof cargoConstType
    const propertyRightsGlobal = useSelector(getPropertyRightsBaseStore) as typeof propertyRights

    const currentId = useSelector(getCurrentIdTrailerStore)
    const oneTrailer = useSelector(getOneTrailerFromLocal)

    const isBusyTrailer = useSelector(getIsBusyTrailer)

    const trailertHasPassToDelete = () => {
        dispatch(globalModalStoreActions.setTextMessage(
            'Прицеп не может быть удалён, он привязан к сотруднику: '
            + ( isBusyTrailer?.subLabel ),
        ))
    }

    const unchangeableField = () => {
        dispatch(globalModalStoreActions.setTextMessage(
            'Данное поле Прицепа не может быть изменено, пока он привязан к сотруднику: '
            + ( isBusyTrailer?.subLabel ),
        ))
    }

    // вытаскиваем значение роутера
    const { id: currentIdForShow } = useParams<{ id: string | undefined }>()
    const isNew = currentIdForShow === 'new'
    const [ trailerNumberRusCheck, setTrailerNumberRusCheck ] = useState(isNew)
    const [ ptsRusCheck, setPtsRusCheck ] = useState(isNew)

    const { options } = useSelector(getRoutesStore)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // для манипуляции с картинкой
    const [ selectedImage, setSelectedImage ] = useState<File>()
    const [ isImageChanged, setIsImageChanged ] = useState(false)

    const onSubmit = useCallback(( values: TrailerCardType<string> ) => {

        const demaskedValues: TrailerCardType<string> = {
            ...values,
            cargoWeight: syncParsers.parseAllNumbers(values.cargoWeight) || '0',
            trailerNumber: syncParsers.clearNormalizeTrailerTransportNumberAtEnd(values.trailerNumber),
        }

        if (isNew) {
            //сохраняем НОВОЕ значение
            dispatch<any>(newTrailerSaveToAPI(demaskedValues, selectedImage))
        } else {
            //сохраняем измененное значение
            dispatch<any>(modifyOneTrailerToAPI(demaskedValues, selectedImage))
        }
        navigate(options) // и возвращаемся в предыдущее окно

    }, [ selectedImage, isNew, navigate, options ])


    const onCancelClick = () => {
        navigate(options)
    }


    const trailerDeleteHandleClick = () => {
        dispatch<any>(oneTrailerDeleteToAPI(currentId))
        navigate(options)
    }


    useEffect(() => {
        if (currentId === currentIdForShow) {
            setInitialValues(oneTrailer)
        } else {
            dispatch(trailerStoreActions.setCurrentId(currentIdForShow || ''))
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
                            //@ts-ignore-next-line
                            decorators={ [ focusOnError ] }
                            render={
                                ( {
                                      handleSubmit,
                                      form,
                                      submitting,
                                      values,
                                      pristine,
                                  } ) => (
                                    <form onSubmit={ handleSubmit } className={ styles.transportTrailerForm__form }>
                                        <div className={ styles.transportTrailerForm__inputsPanel }>
                                            <div className={ styles.transportTrailerForm__inputsPanel_withSwitcher }>
                                                <Field name={ 'trailerNumber' }
                                                       placeholder={ label.trailerNumber }
                                                       maskFormat={ trailerNumberRusCheck ? maskOn.trailerNumber : undefined }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ trailerNumberRusCheck ? validators.trailerNumber : syncValidators.textReqMicro }
                                                       parse={ trailerNumberRusCheck ? parsers.trailerNumber : undefined }
                                                       formatCharsToMaskA={ '[АВЕКМНОРСТУХавекмнорстухABEKMHOPCTYXabekmhopctyx]' }
                                                       allowEmptyFormatting={ trailerNumberRusCheck }
                                                       isInputMask={ trailerNumberRusCheck }
                                                />
                                                <SwitchMask
                                                    checked={ trailerNumberRusCheck }
                                                    onClick={ () => {
                                                        setTrailerNumberRusCheck(!trailerNumberRusCheck)
                                                    } }
                                                />
                                            </div>
                                            <Field name={ 'trailerTrademark' }
                                                   placeholder={ label.trailerTrademark }
                                                   maskFormat={ maskOn.trailerTrademark }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerTrademark }
                                                   parse={ parsers.trailerTrademark }
                                            />
                                            <Field name={ 'trailerModel' }
                                                   placeholder={ label.trailerModel }
                                                   maskFormat={ maskOn.trailerModel }
                                                   component={ FormInputType }
                                                   resetFieldBy={ form }
                                                   validate={ validators.trailerModel }
                                                   parse={ parsers.trailerModel }
                                            />
                                            <div className={ styles.transportTrailerForm__inputsPanel_withSwitcher }>
                                                <Field name={ 'pts' }
                                                       placeholder={ label.pts }
                                                       maskFormat={ ptsRusCheck ? maskOn.pts : undefined }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ ptsRusCheck ? validators.pts : syncValidators.textReqMicro }
                                                       parse={ ptsRusCheck ? parsers.pts : syncParsers.parseToUpperCase }
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
                                                 onClick={ isBusyTrailer && unchangeableField }
                                            >
                                                <FormSelector nameForSelector={ 'cargoType' }
                                                              placeholder={ label.cargoType }
                                                              options={ stringArrayToSelectValue([ ...cargoTypes.filter(x => x !== 'Тягач') ]) }
                                                              validate={ validators.cargoType }
                                                              disabled={ !!isBusyTrailer }
                                                />
                                            </div>
                                            <div className={ styles.transportTrailerForm__smallInput }
                                                 onClick={ isBusyTrailer && unchangeableField }
                                            >
                                                <Field name={ 'cargoWeight' }
                                                       placeholder={ label.cargoWeight }
                                                       maskFormat={ maskOn.cargoWeight }
                                                       component={ FormInputType }
                                                       resetFieldBy={ form }
                                                       validate={ values.cargoType === 'Тягач' ? validators.cargoWeight : syncValidators.cargoWeightTrailer }
                                                       disabled={ values.cargoType === 'Тягач' || !!isBusyTrailer }
                                                />
                                            </div>
                                            <FormSelector nameForSelector={ 'propertyRights' }
                                                          placeholder={ label.propertyRights }
                                                          options={ stringArrayToSelectValue([ ...propertyRightsGlobal ]) }
                                                          validate={ validators.propertyRights }
                                            />
                                        </div>
                                        <div className={ styles.transportTrailerForm__rightSide }>
                                            {/*/////////////---ИЗОБРАЖЕНИЕ---///////////////////////////////*/ }
                                            <div className={ styles.transportTrailerForm__photoWrapper }>
                                                <ImageViewSet imageURL={ values.trailerImage }
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
                                                            onClick={ isBusyTrailer ? trailertHasPassToDelete : trailerDeleteHandleClick }
                                                            disabled={ isNew }
                                                            rounded
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
                    </> }
                <CancelButton onCancelClick={ onCancelClick }/>
                <InfoText/>
            </div>
        </div>
    )
}
