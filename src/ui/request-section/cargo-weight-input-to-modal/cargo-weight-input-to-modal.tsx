import React, {useMemo} from 'react'
import {globalModalDestroy} from '../../../redux/utils/global-modal-store-reducer'
import {syncValidators} from '../../../utils/validators'
import {useDispatch, useSelector} from 'react-redux'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {Field, Form} from 'react-final-form'
import createDecorator from 'final-form-focus'
import styles from './cargo-weight-input-to-modal.module.scss'
import {changeCargoWeightValuesOnCurrentRequestAndActivateDocs} from '../../../redux/request-form/request-store-reducer'
import {getInitialDataToModalCalcRequestStore} from '../../../selectors/forms/request-form-reselect'
import {parseCommaToDot, parseToNormalMoney, syncParsers, toNumber} from '../../../utils/parsers'
import {FormApi} from 'final-form'
import {ModalFooter} from '../../common/modals/info-global-to-modal/modal-footer/modal-footer'

type ToSmallCalcFormType = { cargoWeight: string, addedPrice: string }

export const CargoWeightInputToModal: React.ComponentType = () => {
    const {
        distance,
        cargoWeight,
        responsePrice,
        responseStavka,
        driverCanCargoWeight,
    } = useSelector(getInitialDataToModalCalcRequestStore)

    const dispatch = useDispatch()
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator<ToSmallCalcFormType>(), [])

    const cargoValidate = syncValidators.cargoWeightInModal(( cargoWeight || driverCanCargoWeight ) + 1)

    const onCancelHandle = () => {
        dispatch<any>(globalModalDestroy())
    }

    const reparseValuesToNumber = ( formValues: ToSmallCalcFormType ) => ( {
        cargoWeight: toNumber(syncParsers.parseCommaToDot(formValues.cargoWeight)),
        addedPrice: toNumber(syncParsers.parseNoSpace(formValues.addedPrice)),
    } )

    const onSubmit = ( submitValue: ToSmallCalcFormType ) => {
        const { cargoWeight, addedPrice } = reparseValuesToNumber(submitValue)
        dispatch<any>(changeCargoWeightValuesOnCurrentRequestAndActivateDocs({ cargoWeight, addedPrice }))
        onCancelHandle()
    }

    // подсчёт стоимости в зависимости от расстояния, ставки и веса груза
    // (встроен в валидатор ввода цены тн за км)
    const resultWeightCostValidate = ( form: FormApi<ToSmallCalcFormType> ) => ( cargoW: string ): string | undefined => {
        const { cargoWeight } = reparseValuesToNumber({ cargoWeight: cargoW + '', addedPrice: '0' })
        form.change('addedPrice', parseToNormalMoney(responseStavka * cargoWeight * distance))
        return cargoValidate(cargoWeight + '')
    }

    const StavkaTnKm = () => <p className={ styles.cargoWeightInputToModal__tnKm }>
        { responseStavka + 'р/' + distance + 'км' }</p>

    return ( <Form
        onSubmit={ onSubmit }
        decorators={ [ focusOnError ] }
        initialValues={ { cargoWeight: cargoWeight || driverCanCargoWeight, addedPrice: responsePrice } }
        // key={ Math.random() } // решилось опцией destroyOnClose={ true } в модалке
        render={
            ( { handleSubmit, form, values } ) => (
                <form onSubmit={ handleSubmit }>
                    <div className={ styles.cargoWeightInputToModal__formContainer }>
                        <div className={ styles.cargoWeightInputToModal__infoPanel }>
                            <p><strong>{ 'До изменения:' }</strong></p>
                            <p>{ driverCanCargoWeight + ' тн.' }</p>
                            <StavkaTnKm/>
                            <p>{ parseToNormalMoney(responsePrice) + ' руб.' }</p>
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
                            <p>{ parseCommaToDot(values.cargoWeight + ' тн.') }</p>
                            <StavkaTnKm/>
                            <p>{ values.addedPrice + ' руб.' }</p>
                        </div>
                    </div>
                    <ModalFooter
                        onCancelHandle={ onCancelHandle }
                        isCancelButtonEnable
                        isFooterPaddingEnable
                    />
                </form> )
        }
    /> )
}
