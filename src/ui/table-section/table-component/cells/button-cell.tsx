import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {textAndActionGlobalModal} from '../../../../redux/utils/global-modal-store-reducer'
import {getRoutesStore} from '../../../../selectors/routes-reselect'
import {OneRequestTableTypeReq, TableModesBooleanType} from '../../../../types/form-types'
import {ProjectButton} from '../../../common/buttons/project-button/project-button'

type OwnProps = {
    tableModes: TableModesBooleanType
    authCash: number
}


const ButtonCellReact: React.ComponentType<OwnProps & OneRequestTableTypeReq> = ( {
                                                                                      tableModes: {
                                                                                          isSearchTblMode,
                                                                                          isHistoryTblMode,
                                                                                          isStatusTblMode,
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

    return ( <ProjectButton title={ 'Открыть' }
                            label={ 'Открыть ' + ( ( marked || !answers ) ? 'заявку' : 'карту с ответами перевозчиков' ) }
                            onClick={ () => {
                         if (isSearchTblMode) {
                             ( price > authCash )
                                 ? toGlobalModalQuest(price)
                                 : navigate(requestInfo.accept + requestNumber)
                         }
                         if (isStatusTblMode) navigate(( ( marked || !answers ) ? requestInfo.status : maps.answers ) + requestNumber)
                         if (isHistoryTblMode) navigate(requestInfo.history + requestNumber)
                     } }
                            colorMode={
                         isSearchTblMode ?
                             price > authCash ? 'gray' : 'blue'
                             : isStatusTblMode ? ( answers === 0 || marked ) ? 'green' : 'orange'
                                 : isHistoryTblMode ? 'pink'
                                     : 'redAlert'
                     }
    /> )
}

// недо-реакт объект с замыканием для выведения сложной логики отображения кнопки за пределы объекта columns таблицы
export const ButtonCell = ( ownProps: OwnProps ) => ( cellProps: OneRequestTableTypeReq ) =>
    ButtonCellReact({ ...ownProps, ...cellProps })
