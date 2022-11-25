import {AppStateType, GetActionsTypes} from '../redux-store'
import {ThunkAction} from 'redux-thunk';
import {To} from 'react-router-dom';

const initialState = {
    modalGlobalTextMessage: '',
    titleText: undefined as string | undefined,
    navigateToOk: undefined as undefined | To,
    navigateToCancel: undefined as undefined | To,
    isOkHandle: false,
    action: null as null | ( () => void ),
}

export type GlobalModalStoreReducerStateType = typeof initialState

export type GlobalModalActionsType = GetActionsTypes<typeof globalModalStoreActions>

export const globalModalStoreReducer = ( state = initialState, action: GlobalModalActionsType ): GlobalModalStoreReducerStateType => {

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
        case 'global-modal-reducer/SET-NAVIGATE-TO-CANCEL': {
            return {
                ...state,
                navigateToCancel: action.navigateToCancel,
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
                action: action.action,
            }
        }
        case 'global-modal-reducer/SET-TITLE': {
            return {
                ...state,
                titleText: action.titleText,
            }
        }
        case 'global-modal-reducer/RESET-ALL-VALUES': {
            return {
                ...state,
                modalGlobalTextMessage: '',
                titleText: undefined,
                navigateToOk: undefined,
                navigateToCancel: undefined,
                isOkHandle: false,
                action: null,
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
    setTitle: ( titleText?: string ) => ( {
        type: 'global-modal-reducer/SET-TITLE',
        titleText,
    } as const ),
    setNavigateToOk: ( navigateToOk?: To ) => ( {
        type: 'global-modal-reducer/SET-NAVIGATE-TO-OK',
        navigateToOk,
    } as const ),
    setNavigateToCancel: ( navigateToCancel?: To ) => ( {
        type: 'global-modal-reducer/SET-NAVIGATE-TO-CANCEL',
        navigateToCancel,
    } as const ),
    resetAllValues: () => ( {
        type: 'global-modal-reducer/RESET-ALL-VALUES',
    } as const ),
    setIsOkHandle: ( isOkHandle: boolean ) => ( {
        type: 'global-modal-reducer/SET-IS-OK-HANDLE',
        isOkHandle,
    } as const ),
    setAction: ( action: null | ( () => void ) ) => ( {
        type: 'global-modal-reducer/SET-ACTION',
        action,
    } as const ),
}


/* САНКИ */
export type GlobalModalStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, GlobalModalActionsType>


type GlobalModalType = {
    text: string
    action?: () => void
    navigateOnOk?: To
    navigateOnCancel?: To
    title?: 'Вопрос' | 'Сообщение' | 'Внимание!' | 'Информация'
}

// для создания диалогового окна с переданной функцией
export const textAndActionGlobalModal = ( {
                                              text,
                                              action,
                                              navigateOnOk,
                                              navigateOnCancel,
                                              title,
                                          }: GlobalModalType ): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(globalModalStoreActions.setAction(action || null))
        dispatch(globalModalStoreActions.setNavigateToOk(navigateOnOk))
        dispatch(globalModalStoreActions.setNavigateToCancel(navigateOnCancel))
        dispatch(globalModalStoreActions.setTitle(title))
        dispatch(globalModalStoreActions.setTextMessage(text))
    }