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
import {getInitialCargoWeightRequestStore} from '../../../selectors/forms/request-form-reselect'
import {parseToNormalMoney, syncParsers} from '../../../utils/parsers'
import {FormApi} from 'final-form'

type ToSmallCalcFormType = { cargoWeight: string, addedPrice: string, distance: string }

export const CargoWeightInputToModal: React.FC = () => {

    const initCargoWeightCurrentRequest = useSelector(getInitialCargoWeightRequestStore)
    const distance = 555
    const dispatch = useDispatch()
    //фокусировка на проблемном поле при вводе
    const focusOnError = createDecorator<ToSmallCalcFormType>()

    const cargoValidate = syncValidators.cargoWeightInModal(+( initCargoWeightCurrentRequest ? initCargoWeightCurrentRequest : 50 ) + 1)

    const onCancelHandle = () => {
        dispatch(globalModalStoreActions.resetAllValues())
    }

    const onSubmit = ( submitValue: ToSmallCalcFormType ) => {
        const cargoWeight = +( syncParsers.parseCommaToDot(submitValue.cargoWeight) || 0 )
        dispatch<any>(changeCargoWeightValuesOnCurrentRequestAndActivateDocs(cargoWeight))
        onCancelHandle()
    }

    // подсчёт стоимости в зависимости от расстояния, ставки и веса груза
    // (встроен в валидатор ввода цены тн за км)
    const resultWeightCostValidate = ( form: FormApi<ToSmallCalcFormType> ) => ( cargoW: string ): string | undefined => {
        const parsedStavka = syncParsers.parseCommaToDot(cargoW)
        const [ stavkaNum, cargoWNum, distanceNum ] = [ parsedStavka, form.getState().values.cargoWeight, distance ]
            .map(( v ) => +( v || 0 ))
        form.change('addedPrice',  parseToNormalMoney(stavkaNum * cargoWNum * distanceNum) )
        return cargoValidate(cargoW)
    }


    return ( <Form
        onSubmit={ onSubmit }
        decorators={ [ focusOnError ] }
        initialValues={ { cargoWeight: initCargoWeightCurrentRequest } }
        key={ Math.random() }
        render={
            ( { handleSubmit, form } ) => (
                <form onSubmit={ handleSubmit }>
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
