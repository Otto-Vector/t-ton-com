import {AppStateType} from '../redux/redux-store'
import {RoutesStoreReducerStateType} from '../redux/routes-store-reducer';


type RoutesStoreSelectors<T extends keyof Y, Y = RoutesStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getRoutesStore: RoutesStoreSelectors<'routes'> = ( state ) => state.routesStoreReducer.routes


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
