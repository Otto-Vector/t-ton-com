import {AppStateType} from '../../redux/redux-store'
import {TrailerStoreReducerStateType} from '../../redux/options/trailer-store-reducer'

type TrailerStoreSelectors<T extends keyof Y, Y = TrailerStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelTrailerStore: TrailerStoreSelectors<'label'> = (state) => state.trailerStoreReducer.label
export const getInitialValuesTrailerStore: TrailerStoreSelectors<'initialValues'> = (state) => state.trailerStoreReducer.initialValues
export const getMaskOnTrailerStore: TrailerStoreSelectors<'maskOn'> = (state) => state.trailerStoreReducer.maskOn
export const getValidatorsTrailerStore: TrailerStoreSelectors<'validators'> = (state) => state.trailerStoreReducer.validators



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
