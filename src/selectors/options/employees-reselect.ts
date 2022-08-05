import {AppStateType} from '../../redux/redux-store'
import {EmployeesStoreReducerStateType} from '../../redux/options/employees-store-reducer'
import {EmployeesCardType} from '../../types/form-types';
import {createSelector} from 'reselect';
import {parseFamilyToFIO} from '../../utils/parsers';
import {SelectOptions} from '../../ui/common/form-selector/form-selector';

type EmployeesStoreSelectors<T extends keyof Y, Y = EmployeesStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getInitialValuesEmployeesStore: EmployeesStoreSelectors<'initialValues'> = ( state ) => state.employeesStoreReducer.initialValues
export const getIsFetchingEmployeesStore: EmployeesStoreSelectors<'employeeIsFetching'> = ( state ) => state.employeesStoreReducer.employeeIsFetching

export const getLabelEmployeesStore: EmployeesStoreSelectors<'label'> = ( state ) => state.employeesStoreReducer.label
export const getMaskOnEmployeesStore: EmployeesStoreSelectors<'maskOn'> = ( state ) => state.employeesStoreReducer.maskOn
export const getValidatorsEmployeesStore: EmployeesStoreSelectors<'validators'> = ( state ) => state.employeesStoreReducer.validators
export const getParsersEmployeesStore: EmployeesStoreSelectors<'parsers'> = ( state ) => state.employeesStoreReducer.parsers

export const getAllEmployeesStore: EmployeesStoreSelectors<'content'> = ( state ) => state.employeesStoreReducer.content
export const getCurrentIdEmployeesStore: EmployeesStoreSelectors<'currentId'> = ( state ) => state.employeesStoreReducer.currentId


export const getOneEmployeesFromLocal = createSelector(getCurrentIdEmployeesStore, getAllEmployeesStore, getInitialValuesEmployeesStore,
    ( currentId, employees, initials ): EmployeesCardType => {
        return employees.filter(( { idEmployee } ) => idEmployee === currentId)[0] || initials
    })

export const getAllEmployeesSelectFromLocal = createSelector(getAllEmployeesStore,
    ( employees ): SelectOptions[] => employees.map(( { idEmployee, employeeFIO } ) =>
        ( { key: idEmployee, value: idEmployee, label: parseFamilyToFIO(employeeFIO) } )),
)
