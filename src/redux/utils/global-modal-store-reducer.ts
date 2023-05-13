import {AppStateType} from '../redux-store'
import {ThunkAction} from 'redux-thunk'
import {To} from 'react-router-dom'
import {GetActionsTypes} from '../../types/ts-utils'

const initialState = {
    modalGlobalTextMessage: '' as string | string[],
    reactChildren: null as null | JSX.Element,
    isFooterVisible: false,
    titleText: undefined as undefined | string,
    navigateToOk: undefined as undefined | To,
    navigateToCancel: undefined as undefined | To,
    action: null as null | ( () => void ),
    timeToDeactivate: null as null | number,
}

export type GlobalModalStoreReducerStateType = typeof initialState

export type GlobalModalActionsType = GetActionsTypes<typeof globalModalStoreActions>

export const globalModalStoreReducer = ( state = initialState, action: GlobalModalActionsType ): GlobalModalStoreReducerStateType => {

    switch (action.type) {

        case 'global-modal-reducer/SET-TEXT-MESSAGE': {
            return {
                ...state,
                modalGlobalTextMessage: action.modalGlobalTextMessage,
                reactChildren: null,
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
        case 'global-modal-reducer/SET-CHILDREN': {
            return {
                ...state,
                reactChildren: action.reactChildren,
                modalGlobalTextMessage: action.reactChildren ? '' : state.modalGlobalTextMessage,
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
        case 'global-modal-reducer/SET-TIME-TO-DEACTIVATE': {
            return {
                ...state,
                timeToDeactivate: action.timeToDeactivate,
            }
        }
        case 'global-modal-reducer/SET-FOOTER-VISIBLE': {
            return {
                ...state,
                isFooterVisible: action.isFooterVisible,
            }
        }
        case 'global-modal-reducer/RESET-ALL-VALUES': {
            return {
                ...state,
                modalGlobalTextMessage: '',
                titleText: undefined,
                navigateToOk: undefined,
                navigateToCancel: undefined,
                reactChildren: null,
                isFooterVisible: true,
                action: null,
                timeToDeactivate: null,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const globalModalStoreActions = {
    setTextMessage: ( modalGlobalTextMessage: string | string[] ) => ( {
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
    setChildren: ( reactChildren: null | JSX.Element ) => ( {
        type: 'global-modal-reducer/SET-CHILDREN',
        reactChildren,
    } as const ),
    setAction: ( action: null | ( () => void ) ) => ( {
        type: 'global-modal-reducer/SET-ACTION',
        action,
    } as const ),
    setTimeToDeactivate: ( timeToDeactivate: null | number ) => ( {
        type: 'global-modal-reducer/SET-TIME-TO-DEACTIVATE',
        timeToDeactivate,
    } as const ),
    setFooterVisible: ( isFooterVisible: boolean ) => ( {
        type: 'global-modal-reducer/SET-FOOTER-VISIBLE',
        isFooterVisible,
    } as const ),
}


/* САНКИ */
export type GlobalModalStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, GlobalModalActionsType>


type GlobalModalType = {
    text?: string | string[]
    reactChildren?: null | JSX.Element
    // заворачиваем диспатч внутрь анонимной функции: ()=>{dispatch(выполняйтся)}
    action?: () => void
    navigateOnOk?: To
    navigateOnCancel?: To
    title?: 'Вопрос' | 'Сообщение' | 'Внимание!' | 'Информация'
    // в миллисекундах
    timeToDeactivate?: number
    isFooterVisible?: boolean
}

// для создания диалогового окна с переданной функцией
export const textAndActionGlobalModal = ( {
                                              text,
                                              action,
                                              navigateOnOk,
                                              navigateOnCancel,
                                              title,
                                              timeToDeactivate,
                                              reactChildren,
                                              isFooterVisible = true,
                                          }: GlobalModalType ): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(globalModalStoreActions.setAction(action || null))
        dispatch(globalModalStoreActions.setNavigateToOk(navigateOnOk))
        dispatch(globalModalStoreActions.setNavigateToCancel(navigateOnCancel))
        dispatch(globalModalStoreActions.setTitle(title))
        dispatch(globalModalStoreActions.setTextMessage(text || ''))
        dispatch(globalModalStoreActions.setChildren(reactChildren || null))
        dispatch(globalModalStoreActions.setTimeToDeactivate(timeToDeactivate || null))
        dispatch(globalModalStoreActions.setFooterVisible(isFooterVisible))
    }
