import React from 'react'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer'
import {syncValidators} from '../../../utils/validators'
import {useDispatch, useSelector} from 'react-redux'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Field, Form} from 'react-final-form'
import createDecorator from 'final-form-focus'
import styles from './cargo-weight-input-to-modal.module.scss'
import {Button} from '../../common/button/button'
import {changeCargoWeightValuesOnCurrentRequestAndActivateDocs} from '../../../redux/forms/request-store-reducer'
import {getInitialDataToModalCalcRequestStore} from '../../../selectors/forms/request-form-reselect'
import {parseCommaToDot, parseToNormalMoney, syncParsers} from '../../../utils/parsers'
import {FormApi} from 'final-form'

type ToSmallCalcFormType = { cargoWeight: string, addedPrice: string }

export const CargoWeightInputToModal: React.FC = () => {
    const {
        distance,
        cargoWeight,
        addedPrice,
        responseStavka,
        driverCanCargoWeight,
    } = useSelector(getInitialDataToModalCalcRequestStore)

    const dispatch = useDispatch()
    //фокусировка на проблемном поле при вводе
    const focusOnError = createDecorator<ToSmallCalcFormType>()

    const cargoValidate = syncValidators.cargoWeightInModal(( cargoWeight || driverCanCargoWeight ) + 1)

    const onCancelHandle = () => {
        dispatch(globalModalStoreActions.resetAllValues())
    }

    const reparseValuesToNumber = ( formValues: ToSmallCalcFormType ) => ( {
        cargoWeight: +( syncParsers.parseCommaToDot(formValues.cargoWeight) || 0 ),
        addedPrice: +( syncParsers.parseNoSpace(formValues.addedPrice) || 0 ),
    } )

    const onSubmit = ( submitValue: ToSmallCalcFormType ) => {
        const { cargoWeight, addedPrice } = reparseValuesToNumber(submitValue)
        dispatch<any>(changeCargoWeightValuesOnCurrentRequestAndActivateDocs({ cargoWeight,addedPrice }))
        onCancelHandle()
    }

    // подсчёт стоимости в зависимости от расстояния, ставки и веса груза
    // (встроен в валидатор ввода цены тн за км)
    const resultWeightCostValidate = ( form: FormApi<ToSmallCalcFormType> ) => ( cargoW: string ): string | undefined => {
        const { cargoWeight } = reparseValuesToNumber({ cargoWeight: cargoW+'', addedPrice: '0' })
        form.change('addedPrice', parseToNormalMoney(responseStavka * cargoWeight * distance))
        return cargoValidate(cargoWeight + '')
    }


    return ( <Form
        onSubmit={ onSubmit }
        decorators={ [ focusOnError ] }
        initialValues={ { cargoWeight, addedPrice } }
        key={ Math.random() }
        render={
            ( { handleSubmit, form, values } ) => (
                <form onSubmit={ handleSubmit }>
                    <div className={ styles.cargoWeightInputToModal__formContainer }>
                        <div className={ styles.cargoWeightInputToModal__infoPanel }>
                            <p><strong>{ 'До изменения:' }</strong></p>
                            <p>{ cargoWeight + ' тн.' }</p>
                            <p>{ parseToNormalMoney(addedPrice) + ' руб.' }</p>
                        </div>
                        <div className={ styles.cargoWeightInputToModal__inputsItem }>
                            <label className={ styles.cargoWeightInputToModal__label }
                                   style={ { fontWeight: 'bold' } }
                            >{ 'Груз у водителя?' }</label>
                            <div><label
                                className={ styles.cargoWeightInputToModal__label }>{ 'Фактический вес при погрузке:' }</label>
                            </div>
                            <Field name={ 'cargoWeight' }
                                   placeholder={ 'Вес груза (тонн)' }
                                   component={ FormInputType }
                                   inputType={ 'money' }
                                   validate={ resultWeightCostValidate(form) }
                                   resetFieldBy={ form }
                                   errorBottom
                            />
                        </div>
                        <div className={ styles.cargoWeightInputToModal__infoPanel }>
                            <p><strong>{ 'После изменения:' }</strong></p>
                            <p>{ parseCommaToDot(values.cargoWeight+'') + ' тн.' }</p>
                            <p>{ values.addedPrice + ' руб.' }</p>
                        </div>
                    </div>
                    <footer className={ styles.cargoWeightInputToModal__footer }>
                        <div className={ styles.cargoWeightInputToModal__button }>
                            <Button title={ 'Отмена' }
                                    colorMode={ 'blueAlert' }
                                    onClick={ onCancelHandle }
                            />
                        </div>
                        <div className={ styles.cargoWeightInputToModal__button }>
                            <Button title={ 'Ok' }
                                    type={ 'submit' }
                                    colorMode={ 'blue' }
                            />
                        </div>
                    </footer>
                </form> )
        }
    /> )
}
