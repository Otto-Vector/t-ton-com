import React from 'react'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import {MaterialIcon} from '../../../common/material-icon/material-icon'
import {Button} from '../../../common/button/button'

type OwnProps = {
    isStatusTableMode: boolean
    onClick: ( requestNumber: number ) => void
}

// кнопка на удаление в таблице
export const DeleteCell = ( { isStatusTableMode, onClick }: OwnProps ) => {
    const Cell = ( {
                       roleStatus: { isCustomer = false },
                       localStatus,
                       requestNumber,
                   }: OneRequestTableTypeReq ) =>
        isCustomer && localStatus !== 'груз у получателя' && localStatus !== 'груз у водителя'
            ? <div style={ { background: 'none' } }>
                <Button colorMode={ 'redAlert' }
                        onClick={ () => {
                            onClick(requestNumber)
                        } }
                        style={ { border: 'none' } }
                ><MaterialIcon icon_name={ 'cancel' } style={ { fontSize: '20px' } }/> </Button>
            </div>
            : <></>
    return isStatusTableMode ? Cell : <></>
}
