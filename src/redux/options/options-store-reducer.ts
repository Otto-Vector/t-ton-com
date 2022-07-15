import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ShippersCardType} from '../../types/form-types';

export type OptionsLabelType = { id: number, title?: string }


const initialState = {
    shippers: {
        label: 'Грузоотправители',
        placeholder: 'Поиск по названию',
        content: [] as OptionsLabelType[],
        info: 'ГРУЗООТПРАВИТЕЛЬ - юридические владельцы груза, реквизиты требуются для создания доверенности' +
            'в окне «Доп. данные для ТТН» вносится данные фактической организации сбора груза для оформления' +
            ' транспортного документа. Не получает права на просмотр созданной Заявки. «Заказчик»-организация ' +
            'использующая Агентов для оказания собственных услуг перевозки. Получает права владельца Заявки ' +
            'после создания Заявки.',
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
        info: ' ГРУЗОПОЛУЧАТЕЛЬ - юридические получатели груза, реквизиты требуются для создания накладных, в окне' +
            ' «Доп. инфо для ТТН» вносится данные фактической организации получения груза для оформления транспортного' +
            ' документа. Получает права на просмотр созданной Заявки. ПЕРЕВОЗЧИК - юридическое лицо, осуществляемое ' +
            'транспортировку Вашего груза от Грузоотправителя до Грузополучателя, при наличии у Водителя мобильного ' +
            'приложения отображает маршрут и предоставляет возможность для связи. Не видит информацию о Заказчике, ' +
            'Грузоотправителе и Грузополучателе, до принятия Заявки. Требуется проверка перевозчика до момента ' +
            'передачи груза!',
    },
}

export type OptionsStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof optionsStoreActions>

export const optionsStoreReducer = ( state = initialState, action: ActionsType ): OptionsStoreReducerStateType => {

    switch (action.type) {

        case 'options-store-reducer/SET-SHIPPERS': {
            return {
                ...state,
                shippers: {
                    ...state.shippers,
                    content: [
                        ...action.shippers.map(( { id, title } ) => ( { id, title } )),
                    ],
                },
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const optionsStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setShippers: ( shippers: ShippersCardType[] ) => ( {
        type: 'options-store-reducer/SET-SHIPPERS',
        shippers,
    } as const ),
}

/* САНКИ */

export type OptionsStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): BaseStoreReducerThunkActionType =>
//     async ( dispatch ) => {
//         // dispatch( requestFormActions.setIcons( null ) )
//         try {
//             const response = await getIconsFromApi( { domain } )
//             dispatch( baseStoreActions.setIcons( domain, response ) )
//         } catch (e) {
//             alert( e )
//             // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
//         }
//
//     }

