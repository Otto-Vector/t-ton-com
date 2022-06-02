import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from './redux-store'
import {phoneSubmitType, ValidateType} from '../types/form-types'
import {composeValidators, mustBe00Numbers, mustBe0_0Numbers, required} from '../utils/validators'
import {infoMessagesTest} from './initialsTestData';


export type OneInfoItem = {
    requestNumber: number | undefined,
    infoText: string,
    timeDate: Date,
    mode: 'gray' | 'blue' | 'red' | 'green'
    viewed: boolean
}

const initialState = {
    isFetching: false,
    unreadMessages: 0,
    content: [] as OneInfoItem[],
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
}

/* САНКИ */

export type InfoStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

export const getInfoMessages = ( { authID }: { authID: number } ): InfoStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(infoStoreActions.setIsFetching(true))

        const request = infoMessagesTest
        dispatch(infoStoreActions.setValuesContent(request))

        dispatch(infoStoreActions.setIsFetching(false))
    }


