import {AppStateType} from '../../redux/redux-store'
import {OptionsStoreReducerStateType} from '../../redux/options/options-store-reducer';

type OptionsStoreSelectors<T extends keyof Y, Y = OptionsStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getShippersOptionsStore: OptionsStoreSelectors<'shippers'> = (state) => state.optionsStoreReducer.shippers
export const getEmployeesOptionsStore: OptionsStoreSelectors<'employees'> = (state) => state.optionsStoreReducer.employees
export const getTransportOptionsStore: OptionsStoreSelectors<'transport'> = (state) => state.optionsStoreReducer.transport
export const getTrailerOptionsStore: OptionsStoreSelectors<'trailer'> = (state) => state.optionsStoreReducer.trailer
export const getConsigneesOptionsStore: OptionsStoreSelectors<'consignees'> = (state) => state.optionsStoreReducer.consignees


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
