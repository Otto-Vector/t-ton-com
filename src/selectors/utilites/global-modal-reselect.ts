import {AppStateType} from '../../redux/redux-store'
import {GlobalModalStoreReducerStateType} from '../../redux/utils/global-modal-store-reducer';

type GlobalModalStoreSelectors<T extends keyof Y, Y = GlobalModalStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getTextGlobalModalStore: GlobalModalStoreSelectors<'text'> = ( state ) => state.globalModalStoreReducer.text
export const getChildrenGlobalModalStore: GlobalModalStoreSelectors<'reactChildren'> = ( state ) => state.globalModalStoreReducer.reactChildren
export const getNavigateToOkGlobalModalStore: GlobalModalStoreSelectors<'navigateOnOk'> = ( state ) => state.globalModalStoreReducer.navigateOnOk
export const getNavigateToCancelGlobalModalStore: GlobalModalStoreSelectors<'navigateOnCancel'> = ( state ) => state.globalModalStoreReducer.navigateOnCancel
export const getTitleGlobalModalStore: GlobalModalStoreSelectors<'title'> = ( state ) => state.globalModalStoreReducer.title
export const getTimeToDeactivateGlobalModalStore: GlobalModalStoreSelectors<'timeToDeactivate'> = ( state ) => state.globalModalStoreReducer.timeToDeactivate
export const getActionGlobalModalStore: GlobalModalStoreSelectors<'action'> = ( state ) => state.globalModalStoreReducer.action
export const getIsFooterVisibleGlobalModalStore: GlobalModalStoreSelectors<'isFooterVisible'> = ( state ) => state.globalModalStoreReducer.isFooterVisible
export const getIsTitleVisibleGlobalModalStore: GlobalModalStoreSelectors<'isTitleVisible'> = ( state ) => state.globalModalStoreReducer.isTitleVisible
export const getIsBodyPaddingVisibleGlobalModalStore: GlobalModalStoreSelectors<'isBodyPadding'> = ( state ) => state.globalModalStoreReducer.isBodyPadding
export const geActivetModalsListGlobalModalStore: GlobalModalStoreSelectors<'activeModals'> = ( state ) => state.globalModalStoreReducer.activeModals
