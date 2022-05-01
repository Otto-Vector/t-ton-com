import {AppStateType} from '../redux/redux-store'
import {RequisitesStoreReducerStateType} from '../redux/requisites-store-reducer';

type RequisitesStoreSelectors<T extends keyof Y, Y = RequisitesStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsFetchingRequisitesStore: RequisitesStoreSelectors<'isFetching'> = (state) => state.requisitesStoreReducer.isFetching


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
