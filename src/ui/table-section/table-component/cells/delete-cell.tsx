import React from 'react'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import {MaterialIcon} from '../../../common/material-icon/material-icon'
import {Button} from '../../../common/button/button'
import {useDispatch} from 'react-redux'
import {
    ModalFormTextToDeleteResponse,
} from '../../modal-form-text-to-delete-response/modal-form-text-to-delete-response'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'

type OwnProps = {
    isStatusTableMode: boolean
}

// кнопка на удаление в таблице
export const DeleteCellReact: React.ComponentType<OwnProps & OneRequestTableTypeReq> = ( {
                                                                                             isStatusTableMode,
                                                                                             roleStatus: { isCustomer = false },
                                                                                             localStatus,
                                                                                             requestNumber,
                                                                                         } ) => {
    const dispatch = useDispatch()
    const onDeleteRequest = ( requestNumber: number ) => {
        dispatch<any>(textAndActionGlobalModal({
            title: 'Вопрос',
            reactChildren: <ModalFormTextToDeleteResponse requestNumber={ requestNumber }/>,
            isFooterVisible: false,
        }))
    }

    const Cell = isCustomer && localStatus !== 'груз у получателя' && localStatus !== 'груз у водителя'
        ? <div style={ { background: 'none' } }>
            <Button colorMode={ 'redAlert' }
                    onClick={ () => {
                        onDeleteRequest(requestNumber)
                    } }
                    style={ { border: 'none' } }
            ><MaterialIcon icon_name={ 'cancel' } style={ { fontSize: '20px' } }/> </Button>
        </div>
        : <></>
    return isStatusTableMode ? Cell : <></>
}

// замыкаем React объект для Cell
export const DeleteCell = ( ownProps: OwnProps ) => ( cellProps: OneRequestTableTypeReq ) =>
    DeleteCellReact({ ...ownProps, ...cellProps })
