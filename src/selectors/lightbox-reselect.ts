import {AppStateType} from '../redux/redux-store'
import {LightboxStoreReducerStateType} from '../redux/lightbox-store-reducer'

type LightboxStoreSelectors<T extends keyof Y, Y = LightboxStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsLightBoxOpenLightboxStore: LightboxStoreSelectors<'isLightBoxOpen'> = (state) => state.lightBoxStoreReducer.isLightBoxOpen
export const getImageLightboxStore: LightboxStoreSelectors<'image'> = (state) => state.lightBoxStoreReducer.image
