import {AppStateType} from '../redux/redux-store'
import {BaseStoreReducerStateType} from '../redux/base-store-reducer';


type BaseStoreSelectors<T extends keyof Y, Y = BaseStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getHeaderStore: BaseStoreSelectors<'header'> = ( state ) => state.baseStoreReducer.header
export const getFooterStore: BaseStoreSelectors<'footer'> = ( state ) => state.baseStoreReducer.footer
export const getLinksStore: BaseStoreSelectors<'links'> = ( state ) => state.baseStoreReducer.links
export const getDrivingCategorySelector: BaseStoreSelectors<'drivingCategorySelector'> = ( state ) => state.baseStoreReducer.drivingCategorySelector


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
