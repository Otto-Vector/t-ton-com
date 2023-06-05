import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {NavigateFunction, useNavigate} from 'react-router-dom'
import {RoutesStoreReducerStateType} from '../../../../redux/routes-store-reducer'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {getRoutesStore} from '../../../../selectors/routes-reselect'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import {Button} from '../../../common/button/button'
import {TableModesType} from '../../table-section'

type OwnProps = {
    tableModes: TableModesType
    authCash: number
}


const ButtonCellReact: React.ComponentType<OwnProps & OneRequestTableTypeReq> = ( {
                                                                                      tableModes: {
                                                                                          searchTblMode,
                                                                                          historyTblMode,
                                                                                          statusTblMode,
                                                                                      },
                                                                                      authCash,
                                                                                      marked,
                                                                                      answers,
                                                                                      requestNumber,
                                                                                      price,
                                                                                  } ) => {
    const navigate = useNavigate()
    const { info, requestInfo, maps } = useSelector(getRoutesStore)
    const dispatch = useDispatch()

    const toGlobalModalQuest = ( price: number ) => {
        dispatch<any>(textAndActionGlobalModal({
            text: [
                'Не хватает средств (' + price + 'руб) для возможности просмотра и оставления отклика на заявку',
                '- "OK" для перехода к пополнению личного счёта',
            ],
            navigateOnOk: info,
        }))
    }

    return ( <Button title={ 'Открыть' }
                     label={ 'Открыть ' + ( ( marked || !answers ) ? 'заявку' : 'карту с ответами перевозчиков' ) }
                     onClick={ () => {
                         if (searchTblMode) {
                             ( price > authCash )
                                 ? toGlobalModalQuest(price)
                                 : navigate(requestInfo.accept + requestNumber)
                         }
                         if (statusTblMode) navigate(( ( marked || !answers ) ? requestInfo.status : maps.answers ) + requestNumber)
                         if (historyTblMode) navigate(requestInfo.history + requestNumber)
                     } }
                     colorMode={
                         searchTblMode ?
                             price > authCash ? 'gray' : 'blue'
                             : statusTblMode ? ( answers === 0 || marked ) ? 'green' : 'orange'
                                 : historyTblMode ? 'pink'
                                     : 'redAlert'
                     }
    /> )
}

// недо-реакт объект с замыканием для выведения сложной логики отображения кнопки за пределы объекта columns таблицы
export const ButtonCell = ( ownProps: OwnProps ) => ( cellProps: OneRequestTableTypeReq ) =>
    ButtonCellReact({ ...ownProps, ...cellProps })
