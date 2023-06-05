import {AppStateType} from '../../redux/redux-store'
import {FiltersStoreReducerStateType} from '../../redux/table/filters-store-reducer'
import {createSelector} from 'reselect'


type FiltersStoreSelectors<T extends keyof Y, Y = FiltersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getSearchValuesFiltersStore: FiltersStoreSelectors<'search'> = ( state ) => state.filtersStoreReducer.search
export const getStatusValuesFiltersStore: FiltersStoreSelectors<'status'> = ( state ) => state.filtersStoreReducer.status
export const getHistoryValuesFiltersStore: FiltersStoreSelectors<'history'> = ( state ) => state.filtersStoreReducer.history

export const getSearchFilterValuesFiltersStore = createSelector(getSearchValuesFiltersStore, ( { values } ) => values)
export const getHistoryFilterValuesFiltersStore = createSelector(getHistoryValuesFiltersStore, ( { values } ) => values)
export const getStatusFilterValuesFiltersStore = createSelector(getStatusValuesFiltersStore, ( { values } ) => values)

export const getSearchButtonsFiltersStore = createSelector(getSearchValuesFiltersStore, ( { buttons } ) => buttons)
export const getHistoryhButtonsFiltersStore = createSelector(getHistoryValuesFiltersStore, ( { buttons } ) => buttons)
export const getStatusButtonsFiltersStore = createSelector(getStatusValuesFiltersStore, ( { buttons } ) => buttons)

export const getSearchGlobalValueFiltersStore = createSelector(getSearchValuesFiltersStore, ( { values } ) => values.globalFilterValue)
export const getHistoryGlobalValueFiltersStore = createSelector(getHistoryValuesFiltersStore, ( { values } ) => values.globalFilterValue)
export const getStatusGlobalValueFiltersStore = createSelector(getStatusValuesFiltersStore, ( { values } ) => values.globalFilterValue)
