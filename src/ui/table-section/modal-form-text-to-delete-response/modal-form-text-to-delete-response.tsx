import React, {useMemo} from 'react'
import {globalModalDestroy} from '../../../redux/utils/global-modal-store-reducer'
import {syncValidators} from '../../../utils/validators'
import {useDispatch} from 'react-redux'
import {FormInputType} from '../../common/inputs/final-form-inputs/form-input-type/form-input-type'
import {Field, Form} from 'react-final-form'
import createDecorator from 'final-form-focus'
import styles from './modal-form-text-to-delete-response.module.scss'
import {cancelRequestOnDeleteButton} from '../../../redux/request-form/request-store-reducer'
import {ModalFooter} from '../../common/modals/info-global-to-modal/modal-footer/modal-footer'

type PropsType = { requestNumber: number }

export const ModalFormTextToDeleteResponse: React.ComponentType<PropsType> = ( { requestNumber } ) => {

    const dispatch = useDispatch()
    //фокусировка на проблемном поле при вводе
    const focusOnError = useMemo(() => createDecorator<{ isCanceledReason: string }>(), [])

    const isCanceledReason = 'Стандартное удаление'

    const onCancelHandle = () => {
        dispatch<any>(globalModalDestroy())
    }

    const onSubmit = ( { isCanceledReason }: { isCanceledReason: string } ) => {
        dispatch<any>(cancelRequestOnDeleteButton({ requestNumber, isCanceledReason }))
        onCancelHandle()
    }


    return ( <Form
        onSubmit={ onSubmit }
        decorators={ [ focusOnError ] }
        initialValues={ { isCanceledReason } }
        // key={ Math.random() } // решилось опцией destroyOnClose={ true } в модалке
        render={
            ( { handleSubmit, form } ) => (
                <form onSubmit={ handleSubmit }>

                    <div className={ styles.modalFormTextToDeleteResponse__inputsItem }>
                        <p className={ styles.modalFormTextToDeleteResponse__label }
                               style={ { fontWeight: 'bold', paddingBottom: '1em' } }
                        >{ 'Вы действительно хотите удалить заявку №' + requestNumber + '?' }
                        </p>
                        <p className={ styles.modalFormTextToDeleteResponse__label }>
                            { 'Введите пожалуйста причину удаления:' }</p>
                        <Field name={ 'isCanceledReason' }
                               placeholder={ 'Причина удаления' }
                               component={ FormInputType }
                               inputType={ 'text' }
                               validate={ syncValidators.textReqMin }
                               resetFieldBy={ form }
                               errorBottom
                        />
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
