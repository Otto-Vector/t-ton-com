import {AppStateType} from '../../redux/redux-store'
import {ConsigneesStoreReducerStateType} from '../../redux/options/consignees-store-reducer'

type ConsigneesStoreSelectors<T extends keyof Y, Y = ConsigneesStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelConsigneesStore: ConsigneesStoreSelectors<'label'> = (state) => state.consigneesStoreReducer.label
export const getInitialValuesConsigneesStore: ConsigneesStoreSelectors<'initialValues'> = (state) => state.consigneesStoreReducer.initialValues
export const getMaskOnConsigneesStore: ConsigneesStoreSelectors<'maskOn'> = (state) => state.consigneesStoreReducer.maskOn
export const getValidatorsConsigneesStore: ConsigneesStoreSelectors<'validators'> = (state) => state.consigneesStoreReducer.validators
export const getAllConsigneesStore: ConsigneesStoreSelectors<'content'> = (state) => state.consigneesStoreReducer.content



// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
