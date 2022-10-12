import {GetActionsTypes} from '../redux-store'

const initialState = {
    modalGlobalTextMessage: '',
    navigateToOk: ''
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
                navigateToOk: action.navigateToOk
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
}
