import React from 'react'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import {MaterialIcon} from '../../../common/tiny/material-icon/material-icon'
import {ProjectButton} from '../../../common/buttons/project-button/project-button'
import {useDispatch} from 'react-redux'
import {
    ModalFormTextToDeleteResponse,
} from '../../modal-form-text-to-delete-response/modal-form-text-to-delete-response'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'

type OwnProps = {
    isStatusTblMode: boolean
    text?: string
}

// кнопка на удаление в таблице
export const DeleteCellReact: React.ComponentType<OwnProps & OneRequestTableTypeReq> = ( {
                                                                                             isStatusTblMode,
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
            <ProjectButton colorMode={ 'redAlert' }
                           title={ 'Удалить заявку №' + requestNumber }
                           onClick={ () => {
                               onDeleteRequest(requestNumber)
                           } }
                           style={ { border: 'none' } }
            ><MaterialIcon icon_name={ 'cancel' } style={ { fontSize: '20px' } }/> </ProjectButton>
        </div>
        : <></>
    return isStatusTblMode ? Cell : <></>
}

// замыкаем React объект для Cell
export const DeleteCell = ( ownProps: OwnProps ) => ( cellProps: OneRequestTableTypeReq ) =>
    DeleteCellReact({ ...ownProps, ...cellProps })
