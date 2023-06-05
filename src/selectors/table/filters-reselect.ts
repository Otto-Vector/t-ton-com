import {AppStateType} from '../../redux/redux-store'
import {FiltersStoreReducerStateType} from '../../redux/table/filters-store-reducer'
import {createSelector} from 'reselect'


type FiltersStoreSelectors<T extends keyof Y, Y = FiltersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getValuesFiltersStore: FiltersStoreSelectors<'values'> = ( state ) => state.filtersStoreReducer.values
export const getButtonsFiltersStore: FiltersStoreSelectors<'buttons'> = ( state ) => state.filtersStoreReducer.buttons

export const getGlobalValueFiltersStore = createSelector(getValuesFiltersStore, ( filters ) => filters.globalFilterValue)
