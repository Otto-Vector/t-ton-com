import {AppStateType} from '../../redux/redux-store'
import {RequisitesStoreReducerStateType} from '../../redux/options/requisites-store-reducer';

type RequisitesStoreSelectors<T extends keyof Y, Y = RequisitesStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getIsFetchingRequisitesStore: RequisitesStoreSelectors<'isFetching'> = (state) => state.requisitesStoreReducer.isFetching

export const getLabelRequisitesStore: RequisitesStoreSelectors<'label'> = (state) => state.requisitesStoreReducer.label
export const getInitialValuesRequisitesStore: RequisitesStoreSelectors<'initialValues'> = (state) => state.requisitesStoreReducer.initialValues
export const getMaskOnRequisitesStore: RequisitesStoreSelectors<'maskOn'> = (state) => state.requisitesStoreReducer.maskOn
export const getValidatorsRequisitesStore: RequisitesStoreSelectors<'validators'> = (state) => state.requisitesStoreReducer.validators

// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
