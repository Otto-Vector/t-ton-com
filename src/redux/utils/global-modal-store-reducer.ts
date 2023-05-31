import {AppStateType} from '../redux-store'
import {ThunkAction} from 'redux-thunk'
import {To} from 'react-router-dom'
import {GetActionsTypes} from '../../types/ts-utils'

type GlobalModalType = {
    text?: string | string[]
    reactChildren?: null | JSX.Element
    title?: 'Вопрос' | 'Сообщение' | 'Внимание!' | 'Информация'
    // заворачиваем диспатч внутрь анонимной функции: ()=>{dispatch(выполняйтся)}
    // /// НИКОГДА НЕ ПЕРЕДАВАТЬ СЮДА СОЗДАНИЕ НОВОГО ОКНА !!!
    action?: null | ( () => void )
    navigateOnOk?: To
    navigateOnCancel?: To
    // в миллисекундах
    timeToDeactivate?: number | null
    isFooterVisible?: boolean
    isTitleVisible?: boolean
    // подстройка под компоненту, убирает отступы и ставит ширину 'auto'
    isBodyPadding?: boolean
}

export type GlobalModalStoreReducerStateType = GlobalModalType & { activeModals: GlobalModalType[] }

const initialState: GlobalModalStoreReducerStateType = {
    text: undefined,
    reactChildren: null,
    title: undefined,
    action: null,
    navigateOnOk: undefined,
    navigateOnCancel: undefined,
    timeToDeactivate: null,
    isFooterVisible: false,
    isTitleVisible: false,
    isBodyPadding: true,
    activeModals: [],
}


export type GlobalModalActionsType = GetActionsTypes<typeof globalModalStoreActions>

export const globalModalStoreReducer = ( state = initialState, action: GlobalModalActionsType ): GlobalModalStoreReducerStateType => {

    switch (action.type) {

        case 'global-modal-reducer/SET-TEXT-MESSAGE': {
            return {
                ...state,
                text: action.text,
                reactChildren: null,
            }
        }
        case 'global-modal-reducer/SET-NAVIGATE-TO-OK': {
            return {
                ...state,
                navigateOnOk: action.navigateOnOk,
            }
        }
        case 'global-modal-reducer/SET-NAVIGATE-TO-CANCEL': {
            return {
                ...state,
                navigateOnCancel: action.navigateOnCancel,
            }
        }
        case 'global-modal-reducer/SET-CHILDREN': {
            return {
                ...state,
                reactChildren: action.reactChildren,
                text: action.reactChildren ? '' : state.text,
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
                title: action.title,
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
        case 'global-modal-reducer/SET-TITLE-VISIBLE': {
            return {
                ...state,
                isTitleVisible: action.isTitleVisible,
            }
        }
        case 'global-modal-reducer/SET-BODY-PADDING-VISIBLE': {
            return {
                ...state,
                isBodyPadding: action.isBodyPadding,
            }
        }
        case 'global-modal-reducer/RESET-ALL-VALUES-ON-CURRENT-MODAL': {
            return {
                ...state,
                text: undefined,
                title: undefined,
                navigateOnOk: undefined,
                navigateOnCancel: undefined,
                reactChildren: null,
                isFooterVisible: true,
                isTitleVisible: true,
                isBodyPadding: true,
                action: null,
                timeToDeactivate: null,
            }
        }
        case 'global-modal-reducer/ADD-CURRENT-MODAL-TO-ACTIVE-LIST': {
            return {
                ...state,
                activeModals: [ ...state.activeModals, action.currentModal ],
            }
        }
        case 'global-modal-reducer/REMOVE-CURRENT-MODAL-FROM-ACTIVE': {
            return {
                ...state,
                activeModals: state.activeModals.slice(0, -1),
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
const globalModalStoreActions = {
    setTextMessage: ( text: GlobalModalType['text'] ) => ( {
        type: 'global-modal-reducer/SET-TEXT-MESSAGE',
        text,
    } as const ),
    setTitle: ( title: GlobalModalType['title'] ) => ( {
        type: 'global-modal-reducer/SET-TITLE',
        title,
    } as const ),
    setNavigateToOk: ( navigateOnOk: GlobalModalType['navigateOnOk'] ) => ( {
        type: 'global-modal-reducer/SET-NAVIGATE-TO-OK',
        navigateOnOk,
    } as const ),
    setNavigateToCancel: ( navigateOnCancel: GlobalModalType['navigateOnCancel'] ) => ( {
        type: 'global-modal-reducer/SET-NAVIGATE-TO-CANCEL',
        navigateOnCancel,
    } as const ),
    resetAllValuesOnCurrentModal: () => ( {
        type: 'global-modal-reducer/RESET-ALL-VALUES-ON-CURRENT-MODAL',
    } as const ),
    addCurrentModalToActiveList: ( currentModal: GlobalModalType ) => ( {
        type: 'global-modal-reducer/ADD-CURRENT-MODAL-TO-ACTIVE-LIST',
        currentModal,
    } as const ),
    removeCurrentModalFromActiveList: () => ( {
        type: 'global-modal-reducer/REMOVE-CURRENT-MODAL-FROM-ACTIVE',
    } as const ),
    setChildren: ( reactChildren: GlobalModalType['reactChildren'] ) => ( {
        type: 'global-modal-reducer/SET-CHILDREN',
        reactChildren,
    } as const ),
    setAction: ( action: GlobalModalType['action'] ) => ( {
        type: 'global-modal-reducer/SET-ACTION',
        action,
    } as const ),
    setTimeToDeactivate: ( timeToDeactivate: GlobalModalType['timeToDeactivate'] ) => ( {
        type: 'global-modal-reducer/SET-TIME-TO-DEACTIVATE',
        timeToDeactivate,
    } as const ),
    setFooterVisible: ( isFooterVisible: GlobalModalType['isFooterVisible'] ) => ( {
        type: 'global-modal-reducer/SET-FOOTER-VISIBLE',
        isFooterVisible,
    } as const ),
    setTitleVisible: ( isTitleVisible: GlobalModalType['isTitleVisible'] ) => ( {
        type: 'global-modal-reducer/SET-TITLE-VISIBLE',
        isTitleVisible,
    } as const ),
    setBodyPaddingVisible: ( isBodyPadding: GlobalModalType['isBodyPadding'] ) => ( {
        type: 'global-modal-reducer/SET-BODY-PADDING-VISIBLE',
        isBodyPadding,
    } as const ),
}


/* САНКИ */
export type GlobalModalStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, GlobalModalActionsType>


// для создания диалогового окна с переданной функцией
export const textAndActionGlobalModal = ( globalModalValue: GlobalModalType ): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch ) => {
        const {
            text,
            action,
            navigateOnOk,
            navigateOnCancel,
            title,
            timeToDeactivate,
            reactChildren,
            isFooterVisible = true,
            isTitleVisible = true,
            isBodyPadding = true,
        } = globalModalValue

        dispatch(globalModalStoreActions.addCurrentModalToActiveList(globalModalValue))

        dispatch(globalModalStoreActions.resetAllValuesOnCurrentModal())
        dispatch(globalModalStoreActions.setTitle(title))
        dispatch(globalModalStoreActions.setTextMessage(text))
        // reactChildren: ставить ТОЛЬКО после текста
        dispatch(globalModalStoreActions.setChildren(reactChildren || null))
        dispatch(globalModalStoreActions.setBodyPaddingVisible(isBodyPadding))
        dispatch(globalModalStoreActions.setFooterVisible(isFooterVisible))
        dispatch(globalModalStoreActions.setTitleVisible(isTitleVisible))
        dispatch(globalModalStoreActions.setAction(action || null))
        dispatch(globalModalStoreActions.setNavigateToOk(navigateOnOk))
        dispatch(globalModalStoreActions.setNavigateToCancel(navigateOnCancel))
        dispatch(globalModalStoreActions.setTimeToDeactivate(timeToDeactivate || null))

    }

// принудительное закрытие окна c переходом на предыдущее
// (если оно было перекрыто другим окном)
export const globalModalDestroy = (): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const activeModals = getState().globalModalStoreReducer.activeModals
        const length = activeModals.length
        // если имеем два и более окна
        if (length > 1) {
            // последнее - активное окно, удаляется (но не сразу :))
            dispatch(globalModalStoreActions.removeCurrentModalFromActiveList())
            // переходим на предпоследнее
            await dispatch(textAndActionGlobalModal(activeModals[length - 2]))
        } else {
            // просто закрытие/очистка
            dispatch(globalModalStoreActions.resetAllValuesOnCurrentModal())
        }
        // второе удаление при срабатывании активизации нового "старого" окна
        // оно же просто удаление при нормальном закрытии
        dispatch(globalModalStoreActions.removeCurrentModalFromActiveList())
    }

// закрыть все модалки вообще
export const globalModalDestroyAll = (): GlobalModalStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        // удаляем окна по количеству созданных
        getState().globalModalStoreReducer.activeModals.every(() => {
            dispatch(globalModalStoreActions.removeCurrentModalFromActiveList())
            return true
        })
        // зачищаем активное окно
        dispatch(globalModalStoreActions.resetAllValuesOnCurrentModal())
    }
