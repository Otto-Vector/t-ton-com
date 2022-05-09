import React, {ChangeEvent} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, required, maxLength, maxRangeNumber,
} from '../../../utils/validators'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/Preloader/Preloader'

import noImageTrailer from '../../../media/noImageTrailer.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {parseFIO} from '../../../utils/parsers';
import {FormSelector} from '../../common/form-selector/form-selector';
import {InfoText} from '../common-forms/info-text/into-text';
import {CargoType, cargoType, propertyRights, PropertyRights} from './transport-form';
import {CancelButton} from '../common-forms/cancel-button/cancel-button';

type trailerCardType<T = string | undefined> = {
    trailerNumber: T // Гос. номер авто
    trailerTrademark: T // Марка авто
    trailerModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRights // Право собственности
    trailerImage: T // Фото транспорта
}
// вынесенный тип для валидаторов формы
type validateType = undefined | ((val: string) => string | undefined)

type OwnProps = {
    // onSubmit: (requisites: trailerCardType) => void
}


export const TrailerForm: React.FC<OwnProps> = () => {

    const header = 'Прицеп'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const onSubmit = () => {
    }

    const onCancelClick = () => { navigate(options) }

    const sendPhotoFile = (event: ChangeEvent<HTMLInputElement>) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }
    const sendPTSFile = (event: ChangeEvent<HTMLInputElement>) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }
    const sendDopogFile = (event: ChangeEvent<HTMLInputElement>) => {
        // if (event.target.files?.length) dispatch( setPassportFile( event.target.files[0] ) )
    }

    // const dispatch = useDispatch()
    // const employeeSaveHandleClick = () => { // onSubmit
    // }
    //
    // const fakeFetch = () => { // @ts-ignore
    //     // dispatch(fakeAuthFetching())
    // }

    const label: trailerCardType = {
        trailerNumber: 'Гос. номер авто',
        trailerTrademark: 'Марка авто',
        trailerModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        trailerImage: 'Фото транспорта',
    }

    const maskOn: trailerCardType = {
        trailerNumber: undefined, // просто текст
        trailerTrademark: undefined, // просто текст
        trailerModel: undefined, // просто текст
        pts: undefined, // просто фото
        dopog: undefined, // просто фото
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        trailerImage: undefined, // просто текст
    }

    const initialValues: trailerCardType = {
        trailerNumber: undefined,
        trailerTrademark: undefined,
        trailerModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        trailerImage: undefined,
    }

    const validators: trailerCardType<validateType> = {
        trailerNumber: composeValidators(required, maxLength(20)),
        trailerTrademark: composeValidators(required, maxLength(20)),
        trailerModel: composeValidators(required, maxLength(20)),
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: undefined,
        trailerImage: undefined,
    }


    return (
        <div className={styles.transportTrailerForm}>
            <div className={styles.transportTrailerForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.transportTrailerForm__header}>{header}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.transportTrailerForm__form}>
                                        <div className={styles.transportTrailerForm__inputsPanel}>
                                            <Field name={'trailerNumber'}
                                                   placeholder={label.trailerNumber}
                                                   maskFormat={maskOn.trailerNumber}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.trailerNumber}
                                                   parse={parseFIO} // как фио чтобы не писали сюда лишних символов
                                            />
                                            <Field name={'trailerTrademark'}
                                                   placeholder={label.trailerTrademark}
                                                   maskFormat={maskOn.trailerTrademark}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.trailerTrademark}
                                            />

                                            <Field name={'trailerModel'}
                                                   placeholder={label.trailerModel}
                                                   maskFormat={maskOn.trailerModel}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.trailerModel}
                                            />
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <div className={styles.transportTrailerForm__withAttach}>
                                                <Field name={'pts'}
                                                       placeholder={label.pts}
                                                       maskFormat={maskOn.pts}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       validate={validators.pts}
                                                       disabled
                                                />
                                                <div className={styles.transportTrailerForm__attachFile}>
                                                    <Button colorMode={'noFill'}
                                                            title={'Добавить' + label.pts}
                                                            rounded>
                                                        <MaterialIcon icon_name={'attach_file'}/>
                                                        <input type={'file'}
                                                               className={styles.transportTrailerForm__hiddenAttachFile}
                                                               accept={'.png, .jpeg, .pdf, .jpg'}
                                                               onChange={sendPTSFile}
                                                        />
                                                    </Button>
                                                </div>
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <div className={styles.transportTrailerForm__withAttach}>
                                                <Field name={'dopog'}
                                                       placeholder={label.dopog}
                                                       maskFormat={maskOn.dopog}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       validate={validators.dopog}
                                                       disabled
                                                />
                                                <div className={styles.transportTrailerForm__attachFile}>
                                                    <Button colorMode={'noFill'}
                                                            title={'Добавить' + label.dopog}
                                                            rounded>
                                                        <MaterialIcon icon_name={'attach_file'}/>
                                                        <input type={'file'}
                                                               className={styles.transportTrailerForm__hiddenAttachFile}
                                                               accept={'.png, .jpeg, .pdf, .jpg'}
                                                               onChange={sendDopogFile}
                                                        />
                                                    </Button>
                                                </div>

                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}

                                            <div className={styles.transportTrailerForm__smallInput}>
                                                <FormSelector named={'cargoType'} values={cargoType}/>
                                            </div>
                                            <div className={styles.transportTrailerForm__smallInput}>
                                                <Field name={'cargoWeight'}
                                                       placeholder={label.cargoWeight}
                                                       maskFormat={maskOn.cargoWeight}
                                                       component={FormInputType}
                                                       resetFieldBy={form}
                                                       validate={validators.cargoWeight}
                                                />
                                            </div>
                                            <FormSelector named={'propertyRights'} values={propertyRights}/>
                                        </div>
                                        <div>
                                            <div className={styles.transportTrailerForm__photoWrapper}
                                                 title={'Добавить/изменить фото'}
                                            >
                                                <img src={initialValues.trailerImage || noImageTrailer}
                                                     alt="uploadedPhoto"/>
                                                <input type={'file'}
                                                       className={styles.transportTrailerForm__hiddenAttachFile}
                                                       accept={'.png, .jpeg, .pdf, .jpg'}
                                                       onChange={sendPhotoFile}
                                                />
                                            </div>
                                            <div className={styles.transportTrailerForm__buttonsPanel}>

                                                <div className={styles.transportTrailerForm__button}>
                                                    <Button type={'button'}
                                                            disabled={true}
                                                            colorMode={'red'}
                                                            title={'Удалить'}
                                                            rounded
                                                    />
                                                </div>
                                                <div className={styles.transportTrailerForm__button}>
                                                    <Button type={'submit'}
                                                            disabled={submitting}
                                                            colorMode={'green'}
                                                            title={'Cохранить'}
                                                            rounded
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                    </form>
                                )
                            }/>

                    </>}
                <CancelButton onCancelClick={onCancelClick}/>
                <InfoText/>
            </div>
        </div>
    )
}