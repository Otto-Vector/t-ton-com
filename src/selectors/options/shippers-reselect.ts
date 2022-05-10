import {AppStateType} from '../../redux/redux-store'
import {ShippersStoreReducerStateType} from '../../redux/options/shippers-store-reducer'

type ShippersStoreSelectors<T extends keyof Y, Y = ShippersStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelShippersStore: ShippersStoreSelectors<'label'> = (state) => state.shippersStoreReducer.label
export const getInitialValuesShippersStore: ShippersStoreSelectors<'initialValues'> = (state) => state.shippersStoreReducer.initialValues
export const getMaskOnShippersStore: ShippersStoreSelectors<'maskOn'> = (state) => state.shippersStoreReducer.maskOn
export const getValidatorsShippersStore: ShippersStoreSelectors<'validators'> = (state) => state.shippersStoreReducer.validators



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
