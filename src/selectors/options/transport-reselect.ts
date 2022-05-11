import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'

type TranstportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelTranstportStore: TranstportStoreSelectors<'label'> = (state) => state.transportStoreReducer.label
export const getInitialValuesTranstportStore: TranstportStoreSelectors<'initialValues'> = (state) => state.transportStoreReducer.initialValues
export const getMaskOnTranstportStore: TranstportStoreSelectors<'maskOn'> = (state) => state.transportStoreReducer.maskOn
export const getValidatorsTranstportStore: TranstportStoreSelectors<'validators'> = (state) => state.transportStoreReducer.validators


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
