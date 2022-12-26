import {AppStateType} from '../redux/redux-store'
import {BaseStoreReducerStateType} from '../redux/base-store-reducer';


type BaseStoreSelectors<T extends keyof Y, Y = BaseStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getHeaderBaseStore: BaseStoreSelectors<'header'> = ( state ) => state.baseStoreReducer.header
export const getHelloDescriptionBaseStore: BaseStoreSelectors<'helloDescription'> = ( state ) => state.baseStoreReducer.helloDescription

export const getFooterBaseStore: BaseStoreSelectors<'footer'> = ( state ) => state.baseStoreReducer.footer
export const getLinksBaseStore: BaseStoreSelectors<'links'> = ( state ) => state.baseStoreReducer.links
export const getDrivingCategorySelectorBaseStore: BaseStoreSelectors<'drivingCategorySelector'> = ( state ) => state.baseStoreReducer.drivingCategorySelector

// глобальные переменные
export const getTariffsBaseStore: BaseStoreSelectors<'tariffs'> = ( state ) => state.baseStoreReducer.tariffs
export const getCargoTypeBaseStore: BaseStoreSelectors<'cargoFormats'> = ( state ) => state.baseStoreReducer.cargoFormats



