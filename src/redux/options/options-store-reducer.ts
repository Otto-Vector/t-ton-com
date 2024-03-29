import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {GetActionsTypes} from '../../types/ts-utils'
import {getAllConsigneesAPI} from './consignees-store-reducer'
import {getAllShippersAPI} from './shippers-store-reducer'
import {getAllTrailerAPI} from './trailer-store-reducer'
import {getAllTransportAPI} from './transport-store-reducer'
import {getAllEmployeesAPI} from './employees-store-reducer'

export type OptionsLabelType = { id: string, title: string, subTitle?: string, extendInfo?: string, moreDataForSearch?: string }


const initialState = {
    requisitesInfo: 'РЕКВИЗИТЫ - юридические данные Вашей организации как основного Заказчика в Заявках, для ' +
        'формирования новых Заявок, доверенностей, накладных и прочих документов. Администрация не несет ' +
        'ответственности за ошибки в указаных реквизитах. В случае указания заведомо ложных данных, администрация ' +
        'справе заблокировать организацию и всех связанных или когда-либо добавленных пользователей до момента ' +
        'урегулирования споров.',
    shippers: {
        label: 'Грузоотправители',
        placeholder: 'Поиск по названию',
        content: [] as OptionsLabelType[],
        info: 'ГРУЗООТПРАВИТЕЛЬ - юридические владельцы груза, реквизиты требуются для создания доверенностив окне ' +
            '«Доп. данные для ТТН» вносится данные фактической организации сбора груза для оформления транспортного ' +
            'документа. Не получает права на просмотр созданной Заявки.',
    },
    employees: {
        label: 'Сотрудники',
        placeholder: 'Поиск по Ф.И.О.',
        content: [] as OptionsLabelType[],
        info: 'СОТРУДНИК - работник оказывающий услуги транспортировки и имеющий доступ до участия в Заявках от Вашей ' +
            'организации. Данные нужны для оформления доверенностей, путевого листа и накладных. Использующий ' +
            'мобильное приложение-отображается на карте полноценно, может звонить всем сторонам Заявки и ' +
            'предоставлять сканы документов, вправе принимать участие в новых и подавать ответы по Заявкам. Не ' +
            'использующий мобильное приложение-отображается на карте без местоположения, все операции осуществляются ' +
            'через логиста.',
    },
    transport: {
        label: 'Транспорт',
        placeholder: 'Поиск по гос.номеру',
        content: [] as OptionsLabelType[],
        info: 'ТРАНСПОРТ - предоставление полной информации требуется для корректного оформления доверенности, путевого' +
            ' листа и накладных.',
    },
    trailer: {
        label: 'Прицеп',
        placeholder: 'Поиск по гос.номеру',
        content: [] as OptionsLabelType[],
        info: 'ПРИЦЕП - предоставление полной информации требуется для корректного оформления доверенности, путевого' +
            ' листа и накладных.',
    },
    consignees: {
        label: 'Грузополучатели',
        placeholder: 'Поиск по названию',
        content: [] as OptionsLabelType[],
        info: 'ГРУЗОПОЛУЧАТЕЛЬ - юридические получатели груза, реквизиты требуются для создания накладных, в окне ' +
            '«Доп. инфо для ТТН» вносится данные фактической организации получения груза для оформления транспортного ' +
            'документа. Получает права на просмотр созданной Заявки.',
    },
}

export type OptionsStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof optionsStoreActions>

export const optionsStoreReducer = ( state = initialState, action: ActionsType ): OptionsStoreReducerStateType => {

    switch (action.type) {

        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const optionsStoreActions = {}

/* САНКИ */

export type OptionsStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const initializedAllOptionsUploads = (): OptionsStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await dispatch(getAllShippersAPI())
            await dispatch(getAllConsigneesAPI())
            await dispatch(getAllEmployeesAPI())
            await dispatch(getAllTransportAPI())
            await dispatch(getAllTrailerAPI())
        } catch (e) {
            console.log(e)
        }
    }
