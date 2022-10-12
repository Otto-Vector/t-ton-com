import {AppStateType, GetActionsTypes} from '../redux-store'
import {ThunkAction} from 'redux-thunk';

const initialState = {
    modalGlobalTextMessage: '',
    navigateToOk: '',
    isOkHandle: false,
    action: null as null | (()=>void),
}

export type GlobalModalStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof globalModalStoreActions>

export const globalModalStoreReducer = ( state = initialState, action: ActionsType ): GlobalModalStoreReducerStateType => {

    switch (action.type) {

        case 'global-modal-reducer/SET-TEXT-MESSAGE': {
            return {
                ...state,
                modalGlobalTextMessage: action.modalGlobalTextMessage,
            }
        }
        case 'global-modal-reducer/SET-NAVIGATE-TO-OK': {
            return {
                ...state,
                navigateToOk: action.navigateToOk,
            }
        }
        case 'global-modal-reducer/SET-IS-OK-HANDLE': {
            return {
                ...state,
                isOkHandle: action.isOkHandle,
            }
        }
        case 'global-modal-reducer/SET-ACTION': {
            return {
                ...state,
                action: action.action
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const globalModalStoreActions = {
    setTextMessage: ( modalGlobalTextMessage: string ) => ( {
        type: 'global-modal-reducer/SET-TEXT-MESSAGE',
        modalGlobalTextMessage,
    } as const ),
    setNavigateToOk: ( navigateToOk: string ) => ( {
        type: 'global-modal-reducer/SET-NAVIGATE-TO-OK',
        navigateToOk,
    } as const ),
    setIsOkHandle: ( isOkHandle: boolean ) => ( {
        type: 'global-modal-reducer/SET-IS-OK-HANDLE',
        isOkHandle,
    } as const ),
    setAction: ( action: null | (() => void) ) => ( {
        type: 'global-modal-reducer/SET-ACTION',
        action,
    } as const ),
}


/* САНКИ */
export type GlobalModalStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>

// для блокировки нажатия НОВЫЙ ПАРОЛЬ на одну минуту
export const textAndActionGlobalModal = ( text: string, action: () => void ): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(globalModalStoreActions.setAction(action))
        dispatch(globalModalStoreActions.setTextMessage(text))
    }