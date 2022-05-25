import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer';

type RequestStoreSelectors<T extends keyof Y, Y = RequestStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getCargoСompositionRequestStore: RequestStoreSelectors<'cargoСomposition'> = (state) => state.requestStoreReducer.cargoСomposition
export const getInitialValuesRequestStore: RequestStoreSelectors<'initialValues'> = (state) => state.requestStoreReducer.initialValues
export const getLabelRequestStore: RequestStoreSelectors<'label'> = ( state) => state.requestStoreReducer.label
export const getPlaceholderRequestStore: RequestStoreSelectors<'placeholder'> = ( state) => state.requestStoreReducer.placeholder
export const getContentRequestStore: RequestStoreSelectors<'content'> = ( state) => state.requestStoreReducer.content



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
