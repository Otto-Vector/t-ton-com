import React from 'react'
import {globalModalStoreActions} from '../../../redux/utils/global-modal-store-reducer'
import {syncValidators} from '../../../utils/validators'
import {useDispatch, useSelector} from 'react-redux'
import {FormInputType} from '../../common/form-input-type/form-input-type'
import {Field, Form} from 'react-final-form'
import styles from './cargo-weight-input-to-modal.module.scss'
import {Button} from '../../common/button/button'
import {changeCargoWeightValuesOnCurrentRequestAndActivateDocs} from '../../../redux/forms/request-store-reducer'
import {getInitialCargoWeightRequestStore} from '../../../selectors/forms/request-form-reselect'


export const CargoWeightInputToModal: React.FC = () => {

    const initCargoWeightCurrentRequest = useSelector(getInitialCargoWeightRequestStore)
    const dispatch = useDispatch()

    const onSubmit = ( submitValue: { cargoWeight: string } ) => {
        const cargoWeight = +( submitValue.cargoWeight || 0 )
        dispatch<any>(changeCargoWeightValuesOnCurrentRequestAndActivateDocs(cargoWeight))
        dispatch(globalModalStoreActions.resetAllValues())
    }

    const onCancelHandle = () => {
        dispatch(globalModalStoreActions.resetAllValues())
    }

    return ( <Form
        onSubmit={ onSubmit }
        initialValues={ { cargoWeight: initCargoWeightCurrentRequest } }
        // key={ Math.random() }
        render={
            ( { handleSubmit, form, values } ) => (
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
                               validate={ syncValidators.cargoWeightInModal(+values.cargoWeight + 1) }
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
