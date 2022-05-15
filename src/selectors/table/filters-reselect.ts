import {AppStateType} from '../../redux/redux-store'
import {FiltersStoreReducerStateType} from '../../redux/table/filters-store-reducer'

type FiltersStoreSelectors<T extends keyof Y, Y = FiltersStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getTodayFiltersStore: FiltersStoreSelectors<'todayFilter'> = (state) => state.filtersStoreReducer.todayFilter
export const getTomorrowFiltersStore: FiltersStoreSelectors<'tomorrowFilter'> = (state) => state.filtersStoreReducer.tomorrowFilter



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
