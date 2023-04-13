import {AppStateType} from '../../redux/redux-store'
import {GlobalModalStoreReducerStateType} from '../../redux/utils/global-modal-store-reducer';

type GlobalModalStoreSelectors<T extends keyof Y, Y = GlobalModalStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getTextGlobalModalStore: GlobalModalStoreSelectors<'modalGlobalTextMessage'> = ( state ) => state.globalModalStoreReducer.modalGlobalTextMessage
export const getChildrenGlobalModalStore: GlobalModalStoreSelectors<'reactChildren'> = ( state ) => state.globalModalStoreReducer.reactChildren
export const getNavigateToOkGlobalModalStore: GlobalModalStoreSelectors<'navigateToOk'> = ( state ) => state.globalModalStoreReducer.navigateToOk
export const getNavigateToCancelGlobalModalStore: GlobalModalStoreSelectors<'navigateToCancel'> = ( state ) => state.globalModalStoreReducer.navigateToCancel
export const getTitleGlobalModalStore: GlobalModalStoreSelectors<'titleText'> = ( state ) => state.globalModalStoreReducer.titleText
export const getTimeToDeactivateGlobalModalStore: GlobalModalStoreSelectors<'timeToDeactivate'> = ( state ) => state.globalModalStoreReducer.timeToDeactivate
export const getActionGlobalModalStore: GlobalModalStoreSelectors<'action'> = ( state ) => state.globalModalStoreReducer.action
