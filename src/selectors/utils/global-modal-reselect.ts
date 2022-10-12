import {AppStateType} from '../../redux/redux-store'
import {GlobalModalStoreReducerStateType} from '../../redux/utils/global-modal-store-reducer';

type GlobalModalStoreSelectors<T extends keyof Y, Y = GlobalModalStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getTextGlobalModalStore: GlobalModalStoreSelectors<'modalGlobalTextMessage'> = ( state ) => state.globalModalStoreReducer.modalGlobalTextMessage
export const getNavigateToOkGlobalModalStore: GlobalModalStoreSelectors<'navigateToOk'> = ( state ) => state.globalModalStoreReducer.navigateToOk
export const getIsOkHandleGlobalModalStore: GlobalModalStoreSelectors<'isOkHandle'> = ( state ) => state.globalModalStoreReducer.isOkHandle
export const getActionGlobalModalStore: GlobalModalStoreSelectors<'action'> = ( state ) => state.globalModalStoreReducer.action
