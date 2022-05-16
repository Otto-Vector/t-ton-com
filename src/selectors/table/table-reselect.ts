import {AppStateType} from '../../redux/redux-store'
import {TableStoreReducerStateType} from '../../redux/table/table-store-reducer';

type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content




// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
