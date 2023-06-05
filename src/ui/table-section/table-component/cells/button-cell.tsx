import {NavigateFunction} from 'react-router-dom'
import {RoutesStoreReducerStateType} from '../../../../redux/routes-store-reducer'
import {OneRequestTableTypeReq} from '../../../../types/form-types'
import {Button} from '../../../common/button/button'
import {TableModesType} from '../../table-section'

type OwnProps = {
    tableModes: TableModesType
    authCash: number
    navigate: NavigateFunction
    routes: RoutesStoreReducerStateType['routes']
    toGlobalModalQuest: ( price: number ) => void
}

// недо-реакт объект с замыканием для выведения сложной логики отображения кнопки за пределы объекта columns таблицы
export const ButtonCell = ( {
                                tableModes: { searchTblMode, historyTblMode, statusTblMode },
                                authCash,
                                navigate,
                                routes: { requestInfo, maps },
                                toGlobalModalQuest,
                            }: OwnProps ) => {

    return ( {
                 requestNumber,
                 price,
                 marked,
                 answers,
             }: OneRequestTableTypeReq ) =>
        <Button title={ 'Открыть' }
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
        />
}
