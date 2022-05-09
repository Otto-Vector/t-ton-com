import React, {ChangeEvent} from 'react'
import styles from './transport-trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, required, maxLength, maxRangeNumber,
} from '../../../utils/validators'
import {Button} from '../../common/button/button'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Preloader} from '../../common/Preloader/Preloader'

import noImageTransport from '../../../media/noImageTransport.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {FormSelector} from '../../common/form-selector/form-selector';
import {InfoText} from '../common-forms/info-text/into-text';
import {CancelButton} from '../common-forms/cancel-button/cancel-button';


export const cargoType = ['Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз'] as const
export type CargoType = typeof cargoType[number]

export const propertyRights = ['Собственность', 'Аренда', 'Лизинг'] as const
export type PropertyRights = typeof propertyRights[number]

type transportCardType<T = string | undefined> = {
    transportNumber: T // Гос. номер авто
    transportTrademark: T // Марка авто
    transportModel: T // Модель авто
    pts: T // ПТС
    dopog: T // ДОПОГ
    cargoType: T | CargoType // Тип груза
    cargoWeight: T // Вес груза
    propertyRights: T | PropertyRights // Право собственности
    transportImage: T // Фото транспорта
}
// вынесенный тип для валидаторов формы
type validateType = undefined | ((val: string) => string | undefined)

type OwnProps = {
    // onSubmit: (requisites: transportCardType) => void
}


export const TransportForm: React.FC<OwnProps> = () => {

    const header = 'Транспорт'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const onSubmit = () => {
    }

    const onCancelClick = () => {
        navigate(options)
    }

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

    const label: transportCardType = {
        transportNumber: 'Гос. номер авто',
        transportTrademark: 'Марка авто',
        transportModel: 'Модель авто',
        pts: 'ПТС',
        dopog: 'ДОПОГ',
        cargoType: 'Тип груза',
        cargoWeight: 'Вес груза (тн.)',
        propertyRights: 'Право собственности',
        transportImage: 'Фото транспорта',
    }

    const maskOn: transportCardType = {
        transportNumber: undefined, // просто текст
        transportTrademark: undefined, // просто текст
        transportModel: undefined, // просто текст
        pts: undefined, // просто фото
        dopog: undefined, // просто фото
        cargoType: undefined, // просто текст
        cargoWeight: '##', // не больше 50-ти тонн
        propertyRights: undefined, // просто текст
        transportImage: undefined, // просто текст
    }

    const initialValues: transportCardType = {
        transportNumber: undefined,
        transportTrademark: undefined,
        transportModel: undefined,
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: undefined,
        propertyRights: undefined,
        transportImage: undefined,
    }

    const validators: transportCardType<validateType> = {
        transportNumber: composeValidators(required, maxLength(20)),
        transportTrademark: composeValidators(required, maxLength(20)),
        transportModel: composeValidators(required, maxLength(20)),
        pts: undefined,
        dopog: undefined,
        cargoType: undefined,
        cargoWeight: composeValidators(maxRangeNumber(50)),
        propertyRights: undefined,
        transportImage: undefined,
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
                                            <Field name={'transportNumber'}
                                                   placeholder={label.transportNumber}
                                                   maskFormat={maskOn.transportNumber}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.transportNumber}
                                            />
                                            <Field name={'transportTrademark'}
                                                   placeholder={label.transportTrademark}
                                                   maskFormat={maskOn.transportTrademark}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.transportTrademark}
                                            />

                                            <Field name={'transportModel'}
                                                   placeholder={label.transportModel}
                                                   maskFormat={maskOn.transportModel}
                                                   component={FormInputType}
                                                   resetFieldBy={form}
                                                   validate={validators.transportModel}
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
                                                 title={'Добавить/изменить фото транспорта'}
                                            >
                                                <img src={initialValues.transportImage || noImageTransport}
                                                     alt="transportPhoto"/>
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
