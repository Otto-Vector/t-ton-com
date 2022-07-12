import {AppStateType} from '../../redux/redux-store'
import {FiltersStoreReducerStateType} from '../../redux/table/filters-store-reducer'

type FiltersStoreSelectors<T extends keyof Y, Y = FiltersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getValuesFiltersStore: FiltersStoreSelectors<'values'> = ( state ) => state.filtersStoreReducer.values
export const getButtonsFiltersStore: FiltersStoreSelectors<'buttons'> = ( state ) => state.filtersStoreReducer.buttons
export const getFiltersStore = ( state: AppStateType ): FiltersStoreReducerStateType => state.filtersStoreReducer


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
