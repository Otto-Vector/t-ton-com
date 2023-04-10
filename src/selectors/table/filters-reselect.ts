import {AppStateType} from '../../redux/redux-store'
import {FiltersStoreReducerStateType} from '../../redux/table/filters-store-reducer'

type FiltersStoreSelectors<T extends keyof Y, Y = FiltersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getValuesFiltersStore: FiltersStoreSelectors<'values'> = ( state ) => state.filtersStoreReducer.values
export const getGlobalValueFiltersStore: FiltersStoreSelectors<'globalFilterValue'> = ( state ) => state.filtersStoreReducer.globalFilterValue
export const getButtonsFiltersStore: FiltersStoreSelectors<'buttons'> = ( state ) => state.filtersStoreReducer.buttons
