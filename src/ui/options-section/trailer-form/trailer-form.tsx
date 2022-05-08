import React, {ChangeEvent} from 'react'
import styles from './trailer-form.module.scss'
import {Field, Form} from 'react-final-form'
import {
    composeValidators, required, maxLength,
    mustBe0_0Numbers, maxRangeNumber,
} from '../../../utils/validators'
import {Button} from '../../common/button/button'
import {InputType} from '../../common/input-type/input-type'
import {Preloader} from '../../common/Preloader/Preloader'

import noImageTrailer from '../../../media/noImageTrailer.png'
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

type trailerCardType<T = string | undefined> = {
    trailerNumber: T // Гос. номер прицепа
    trailerTrademark: T // Марка прицепа
    trailerModel: T // Модель прицепа
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

    const label: trailerCardType = {
        trailerNumber: 'Гос. номер прицепа',
        trailerTrademark: 'Марка прицепа',
        trailerModel: 'Модель прицепа',
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
        cargoWeight: composeValidators(mustBe0_0Numbers(1)(2), maxRangeNumber(50)),
        propertyRights: undefined,
        trailerImage: undefined,
    }


    return (
        <div className={styles.trailerForm}>
            <div className={styles.trailerForm__wrapper}>
                { // установил прелоадер
                    isFetching ? <Preloader/> : <>
                        <h4 className={styles.trailerForm__header}>{header}</h4>
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            render={
                                ({submitError, handleSubmit, pristine, form, submitting}) => (
                                    <form onSubmit={handleSubmit} className={styles.trailerForm__form}>
                                        <div
                                            className={styles.trailerForm__inputsPanel + ' ' + styles.trailerForm__inputsPanel_titled}>
                                            <Field name={'trailerNumber'}
                                                   placeholder={label.trailerNumber}
                                                   maskFormat={maskOn.trailerNumber}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.trailerNumber}
                                                   parse={parseFIO} // как фио чтобы не писали сюда лишних символов
                                            />
                                            <Field name={'trailerTrademark'}
                                                   placeholder={label.trailerTrademark}
                                                   maskFormat={maskOn.trailerTrademark}
                                                   component={InputType}
                                                   resetFieldBy={form}
                                                   validate={validators.trailerTrademark}
                                            />
                                        </div>
                                        <Field name={'trailerModel'}
                                               placeholder={label.trailerModel}
                                               maskFormat={maskOn.trailerModel}
                                               component={InputType}
                                               resetFieldBy={form}
                                               validate={validators.trailerModel}
                                        />

                                        {/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/}
                                        <div className={styles.trailerForm__inputsPanel}>
                                            <div className={styles.trailerForm__withAttach}>
                                                <Field name={'pts'}
                                                       placeholder={label.pts}
                                                       maskFormat={maskOn.pts}
                                                       component={InputType}
                                                       resetFieldBy={form}
                                                       validate={validators.pts}
                                                       disabled
                                                />
                                                <div className={styles.trailerForm__attachFile}>
                                                    <Button colorMode={'white'}
                                                            title={'Добавить' + label.pts}
                                                            rounded>
                                                        <MaterialIcon icon_name={'attach_file'}/>
                                                        <input type={'file'}
                                                               className={styles.trailerForm__hiddenAttachFile}
                                                               accept={'.png, .jpeg, .pdf, .jpg'}
                                                               onChange={sendPassportFile}
                                                        />
                                                    </Button>
                                                </div>
                                                <div className={styles.trailerForm__attachFile}>
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
                                            <div className={styles.trailerForm__inputsPanel}>
                                                <div className={styles.trailerForm__withAttach}>
                                                    <Field name={'dopog'}
                                                           placeholder={label.dopog}
                                                           maskFormat={maskOn.dopog}
                                                           component={InputType}
                                                           resetFieldBy={form}
                                                           validate={validators.dopog}
                                                           disabled
                                                    />
                                                    <div className={styles.trailerForm__attachFile}>
                                                        <Button colorMode={'white'}
                                                                title={'Добавить' + label.dopog}
                                                                rounded>
                                                            <MaterialIcon icon_name={'attach_file'}/>
                                                            <input type={'file'}
                                                                   className={styles.trailerForm__hiddenAttachFile}
                                                                   accept={'.png, .jpeg, .pdf, .jpg'}
                                                                   onChange={sendDopogFile}
                                                            />
                                                        </Button>
                                                    </div>
                                                    <div className={styles.trailerForm__attachFile}>
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
                                        <div className={styles.trailerForm__photo}>
                                            <img src={initialValues.trailerImage || noImageTrailer}
                                                 alt="trailerPhoto"/>
                                        </div>

                                        <div className={styles.trailerForm__button}>
                                            <Button type={'submit'}
                                                    disabled={submitting}
                                                    colorMode={'green'}
                                                    title={'Cохранить'}
                                                    rounded
                                            />
                                        </div>
                                        <div className={styles.trailerForm__button}>
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
                <div className={styles.trailerForm__cancelButton} onClick={onCancelClick}>
                    <Button type={'submit'}
                            colorMode={'white'}
                            title={'Отменить/вернуться'}
                            rounded
                    ><MaterialIcon icon_name={'close'}/></Button>
                </div>
                <div className={styles.trailerForm__infoText}>
                    <span>{infoText}</span>
                </div>
            </div>
        </div>
    )
}
