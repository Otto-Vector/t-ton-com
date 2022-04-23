import {AppStateType} from '../redux/redux-store'
import {BaseStoreReducerStateType} from '../redux/base-store-reducer';


type BaseStoreSelectors<T extends keyof Y, Y = BaseStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getCompanyName: BaseStoreSelectors<'companyName'> = (state) => state.baseStoreReducer.companyName
export const getBaseHref: BaseStoreSelectors<'baseHref'> = (state) => state.baseStoreReducer.baseHref
export const getDirectPhoneNumber: BaseStoreSelectors<'directPhoneNumber'> = (state) => state.baseStoreReducer.directPhoneNumber


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
