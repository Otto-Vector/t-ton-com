import {AppStateType} from '../../redux/redux-store'
import {EmployeesStoreReducerStateType} from '../../redux/options/employees-store-reducer'

type EmployeesStoreSelectors<T extends keyof Y, Y = EmployeesStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelEmployeesStore: EmployeesStoreSelectors<'label'> = (state) => state.employeesStoreReducer.label
export const getInitialValuesEmployeesStore: EmployeesStoreSelectors<'initialValues'> = (state) => state.employeesStoreReducer.initialValues
export const getMaskOnEmployeesStore: EmployeesStoreSelectors<'maskOn'> = (state) => state.employeesStoreReducer.maskOn
export const getValidatorsEmployeesStore: EmployeesStoreSelectors<'validators'> = (state) => state.employeesStoreReducer.validators
export const getParsersEmployeesStore: EmployeesStoreSelectors<'parsers'> = (state) => state.employeesStoreReducer.parsers


// // выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
// export const getOneBookFromLocal = createSelector( getBooksList, getBookToView,
//     ( booksList, bookToView ): ItemBook['volumeInfo'] | undefined => {
//         return booksList.filter( ( book ) => book.id === bookToView.bookId )[0]?.volumeInfo
//     } )
