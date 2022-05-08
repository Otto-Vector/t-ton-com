import React, {ChangeEvent} from 'react'
import styles from './transport-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, required, maxLength,
    mustBe0_0Numbers, maxRangeNumber,
} from '../../../utils/validators'
import {Button} from '../../common/button/button'
import {InputType} from '../../common/input-type/input-type'
import {Preloader} from '../../common/Preloader/Preloader'

import noImageTransport from '../../../media/noImageTransport.png'
import {useSelector} from 'react-redux'
import {getIsFetchingRequisitesStore} from '../../../selectors/requisites-reselect'
import {useNavigate} from 'react-router-dom'
import {MaterialIcon} from '../../common/material-icon/material-icon'
import {getRoutesStore} from '../../../selectors/routes-reselect'
import {parseFIO} from '../../../utils/parsers';
import {FormSelector} from '../../common/form-selector/form-selector';


export const cargoType = ['Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз'] as const
type CargoType = typeof cargoType[number]

export const propertyRights = ['Собственность', 'Аренда', 'Лизинг'] as const
type PropertyRights = typeof propertyRights[number]

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
    const infoText = 'Проверьте правильность внесенных данных, перед сохранением.'
    const isFetching = useSelector(getIsFetchingRequisitesStore)
    const {options} = useSelector(getRoutesStore)
    const navigate = useNavigate()

    const onSubmit = () => {
    }

    const onCancelClick = () => {
        navigate(options)
    }

    const sendPassportFile = (event: ChangeEvent<HTMLInputElement>) => {
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
        cargoWeight: composeValidators(mustBe0_0Numbers(1)(2), maxRangeNumber(50)),
        propertyRights: undefined,
        transportImage: undefined,
    }


    return (
        <div className={styles.transportForm}>
            <div className={styles.transportForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.transportForm__header}>{header}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.transportForm__form}>
                                        <div
                                            className={styles.transportForm__inputsPanel + ' ' + styles.transportForm__inputsPanel_titled}>
                                            <Field name={'transportNumber'}
                                                   placeholder={label.transportNumber}
                                                   maskFormat={maskOn.transportNumber}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.transportNumber}
                                                   parse={parseFIO} // как фио чтобы не писали сюда лишних символов
                                            />
                                            <Field name={'transportTrademark'}
                                                   placeholder={label.transportTrademark}
                                                   maskFormat={maskOn.transportTrademark}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.transportTrademark}
                                            />
                                        </div>
                                        <Field name={'transportModel'}
                                               placeholder={label.transportModel}
                                               maskFormat={maskOn.transportModel}
                                               component={InputType}
                                               resetFieldBy={form}
                                               validate={validators.transportModel}
                                        />

                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                        <div className={styles.transportForm__inputsPanel}>
                                            <div className={styles.transportForm__withAttach}>
                                                <Field name={'pts'}
                                                       placeholder={label.pts}
                                                       maskFormat={maskOn.pts}
                                                       component={InputType}
                                                       resetFieldBy={form}
                                                       validate={validators.pts}
                                                       disabled
                                                />
                                                <div className={styles.transportForm__attachFile}>
                                                    <Button colorMode={'white'}
                                                            title={'Добавить' + label.pts}
                                                            rounded>
                                                        <MaterialIcon icon_name={'attach_file'}/>
                                                        <input type={'file'}
                                                               className={styles.transportForm__hiddenAttachFile}
                                                               accept={'.png, .jpeg, .pdf, .jpg'}
                                                               onChange={sendPassportFile}
                                                        />
                                                    </Button>
                                                </div>
                                                <div className={styles.transportForm__attachFile}>
                                                    <Button colorMode={'white'}
                                                            title={'Просмотреть' + label.pts}
                                                            disabled={!initialValues.pts}
                                                            rounded
                                                    >
                                                        <MaterialIcon icon_name={'search'}/>
                                                    </Button>
                                                </div>
                                            </div>
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                            <div className={styles.transportForm__inputsPanel}>
                                                <div className={styles.transportForm__withAttach}>
                                                    <Field name={'dopog'}
                                                           placeholder={label.dopog}
                                                           maskFormat={maskOn.dopog}
                                                           component={InputType}
                                                           resetFieldBy={form}
                                                           validate={validators.dopog}
                                                           disabled
                                                    />
                                                    <div className={styles.transportForm__attachFile}>
                                                        <Button colorMode={'white'}
                                                                title={'Добавить' + label.dopog}
                                                                rounded>
                                                            <MaterialIcon icon_name={'attach_file'}/>
                                                            <input type={'file'}
                                                                   className={styles.transportForm__hiddenAttachFile}
                                                                   accept={'.png, .jpeg, .pdf, .jpg'}
                                                                   onChange={sendDopogFile}
                                                            />
                                                        </Button>
                                                    </div>
                                                    <div className={styles.transportForm__attachFile}>
                                                        <Button colorMode={'white'}
                                                                title={'Просмотреть' + label.dopog}
                                                                disabled={!initialValues.dopog}
                                                                rounded
                                                        >
                                                            <MaterialIcon icon_name={'search'}/>
                                                        </Button>
                                                    </div>
                                                </div>
                                                {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}

                                                <FormSelector named={'cargoType'} values={cargoType}/>
                                                <Field name={'cargoWeight'}
                                                       placeholder={label.cargoWeight}
                                                       maskFormat={maskOn.cargoWeight}
                                                       component={InputType}
                                                       resetFieldBy={form}
                                                       validate={validators.cargoWeight}
                                                />
                                            </div>
                                            <FormSelector named={'propertyRights'} values={propertyRights}/>
                                        </div>
                                        <div className={styles.transportForm__photo}>
                                            <img src={initialValues.transportImage || noImageTransport}
                                                 alt="transportPhoto"/>
                                        </div>

                                        <div className={styles.transportForm__button}>
                                            <Button type={'submit'}
                                                    disabled={submitting}
                                                    colorMode={'green'}
                                                    title={'Cохранить'}
                                                    rounded
                                            />
                                        </div>
                                        <div className={styles.transportForm__button}>
                                            <Button type={'button'}
                                                    disabled={true}
                                                    colorMode={'red'}
                                                    title={'Удалить'}
                                                    rounded
                                            />
                                        </div>


                                        {/*{submitError && <span className={styles.onError}>{submitError}</span>}*/}
                                    </form>
                                )
                            }/>

                    </>}
                <div className={styles.transportForm__cancelButton} onClick={onCancelClick}>
                    <Button type={'submit'}
                            colorMode={'white'}
                            title={'Отменить/вернуться'}
                            rounded
                    ><MaterialIcon icon_name={'close'}/></Button>
                </div>
                <div className={styles.transportForm__infoText}>
                    <span>{infoText}</span>
                </div>
            </div>
        </div>
    )
}
