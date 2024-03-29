import {AppStateType} from '../../redux/redux-store'
import {EmployeesStoreReducerStateType} from '../../redux/options/employees-store-reducer'
import {EmployeeCardType} from '../../types/form-types';
import {createSelector} from 'reselect';

type EmployeesStoreSelectors<T extends keyof Y, Y = EmployeesStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getInitialValuesEmployeesStore: EmployeesStoreSelectors<'initialValues'> = ( state ) => state.employeesStoreReducer.initialValues
export const getIsFetchingEmployeesStore: EmployeesStoreSelectors<'employeeIsFetching'> = ( state ) => state.employeesStoreReducer.employeeIsFetching

export const getLabelEmployeesStore: EmployeesStoreSelectors<'label'> = ( state ) => state.employeesStoreReducer.label
export const getMaskOnEmployeesStore: EmployeesStoreSelectors<'maskOn'> = ( state ) => state.employeesStoreReducer.maskOn
export const getValidatorsEmployeesStore: EmployeesStoreSelectors<'validators'> = ( state ) => state.employeesStoreReducer.validators
export const getParsersEmployeesStore: EmployeesStoreSelectors<'parsers'> = ( state ) => state.employeesStoreReducer.parsers

export const getAllEmployeesStore: EmployeesStoreSelectors<'content'> = ( state ) => state.employeesStoreReducer.content
export const getCurrentIdEmployeesStore: EmployeesStoreSelectors<'currentId'> = ( state ) => state.employeesStoreReducer.currentId


export const getOneEmployeeFromLocal = createSelector(getCurrentIdEmployeesStore, getAllEmployeesStore, getInitialValuesEmployeesStore,
    ( currentId, employees, initial ): EmployeeCardType =>
        employees.find(( { idEmployee } ) => idEmployee === currentId) || initial )
