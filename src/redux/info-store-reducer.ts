import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {logInfoApi} from '../api/local-api/logInfo.api';


export type OneInfoItem = {
    idLog: string,
    idUser: string,
    idObject: string,
    typeObject: string,
    Message: string,
    Time: string
    mode: 'gray' | 'blue' | 'red' | 'green'
    viewed: boolean
}

const initialState = {
    isFetching: false,
    unreadMessages: 0,
    content: [] as OneInfoItem[],

    tarifsLabel: { //тарифы на оплату (отображаются в инфо-секции, используются везде)
        create: 'Создание Заявки Заказчиком:',
        acceptLongRoute: 'Принятие Местной Заявки Перевозчиком:',
        acceptShortRoute: 'Принятие Дальней Заявки Перевозчиком:',
        paySafeTax: 'Комиссия с оплат по Безопастным сделкам:',
    },
}

export type InfoStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof infoStoreActions>

export const infoStoreReducer = ( state = initialState, action: ActionsType ): InfoStoreReducerStateType => {

    switch (action.type) {


        case 'info-store-reducer/SET-IS-FETCHING': {
            return {
                ...state,
                isFetching: action.isFetching,
            }
        }
        case 'info-store-reducer/SET-VALUES-CONTENT': {
            return {
                ...state,
                content: action.content,
            }
        }
        case 'info-store-reducer/SET-ALL-MESSAGES-VIEWED': {
            return {
                ...state,
                content: [ ...state.content
                    .map(( item ) => item.viewed ? item : { ...item, viewed: true }),
                ],
            }
        }
        case 'info-store-reducer/SET-UNREAD-COUNT': {
            return {
                ...state,
                unreadMessages: action.unreadCount,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const infoStoreActions = {

    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'info-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
    setValuesContent: ( content: OneInfoItem[] ) => ( {
        type: 'info-store-reducer/SET-VALUES-CONTENT',
        content,
    } as const ),
    setAllMessagesViewed: () => ( {
        type: 'info-store-reducer/SET-ALL-MESSAGES-VIEWED',
    } as const ),
    setUnreadCount: ( unreadCount: number ) => ( {
        type: 'info-store-reducer/SET-UNREAD-COUNT',
        unreadCount,
    } as const ),
}

/* САНКИ */

export type InfoStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const getInfoMessages = (): InfoStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(infoStoreActions.setIsFetching(true))
        try {
            const idUser = getState().authStoreReducer.authID
            // const request = infoMessagesTest
            const request = await logInfoApi.getLogInfoByIdUser({ idUser })
            if (request.length > 0) {
                dispatch(infoStoreActions.setValuesContent(
                    request.map(( values ) => ( {
                        ...values,
                        mode: values.Message.includes('Заявка') ? 'blue' : 'gray',
                        viewed: false,
                    } ))))
            }
        } catch (e) {
            console.log(e)
        }

        dispatch(infoStoreActions.setIsFetching(false))
    }


