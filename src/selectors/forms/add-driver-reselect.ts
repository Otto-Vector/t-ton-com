import {AppStateType} from '../../redux/redux-store'
import {AddDriverStoreReducerStateType} from '../../redux/forms/add-driver-store-reducer';

type AddDriverStoreSelectors<T extends keyof Y, Y = AddDriverStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelAddDriverStore: AddDriverStoreSelectors<'label'> = (state) => state.addDriverStoreReducer.label
export const getInitialValuesAddDriverStore: AddDriverStoreSelectors<'initialValues'> = (state) => state.addDriverStoreReducer.initialValues



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
