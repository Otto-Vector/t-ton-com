import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {
    composeValidators,
    maxLength,
    maxNumbers,
    mustBe00Numbers,
    mustNotBeOnlyNull,
    required,
} from '../../utils/validators'
import {EmployeesCardType, ParserType, ValidateType} from '../../types/form-types'
import {
    composeParsers,
    parseFIO,
    parseNoFirstSpaces,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace, parsePseudoLatinCharsAndNumbers, parseToUpperCase,
} from '../../utils/parsers';
import {initialEmployeesValues} from '../../initials-test-data';

const initialState = {
    employeeIsFetching: false,
    currentId: '',
    label: {
        employeeFIO: 'ФИО сотрудника',
        employeePhoneNumber: 'Телефон сотрудника',
        passportSerial: 'Серия, № паспорта',
        passportFMS: 'Кем выдан паспорт',
        passportDate: 'Когда выдан',
        drivingLicenseNumber: 'Номер водительского удостоверения',
        drivingCategory: 'Водительские категории',
        personnelNumber: 'Табельный номер',
        garageNumber: 'Гаражный номер',
        photoFace: 'Добавить фотографию сотрудника',
        rating: 'Рейтинг:',
        idTransport: 'Прикреплённый транспорт',
        idTrailer: 'Прикреплённый прицеп',
    } as EmployeesCardType<string>,

    maskOn: {
        employeeFIO: undefined, // просто текст
        employeePhoneNumber: '+7 (###) ###-##-##', // 11 цифр
        passportSerial: 'Серия: ## ## №: ### ###', // 10 цифр
        passportFMS: undefined, // просто текст
        passportDate: undefined, // режим ввода даты
        drivingLicenseNumber: undefined, // 10 цифр
        drivingCategory: undefined, // просто текст же?
        personnelNumber: '##### #####', // поставим ДО 10 цифр
        garageNumber: '##### #####', // поставим ДО 10 цифр
        photoFace: undefined, // путь к файлу изображения
        rating: '##', // чило ДО 2-х цифр
    } as EmployeesCardType,

    initialValues: {} as EmployeesCardType,

    validators: {
        employeeFIO: composeValidators(required, maxLength(50)),
        employeePhoneNumber: composeValidators(required, mustBe00Numbers(11)),
        passportSerial: composeValidators(mustBe00Numbers(10), mustNotBeOnlyNull),
        passportFMS: undefined,
        passportDate: undefined,
        drivingLicenseNumber: composeValidators(required, maxLength(20)),
        drivingCategory: undefined,
        personnelNumber: composeValidators(maxNumbers(10),mustNotBeOnlyNull),
        garageNumber: composeValidators(maxNumbers(10), mustNotBeOnlyNull),
        photoFace: undefined,
        rating: composeValidators(maxNumbers(2)),
    } as EmployeesCardType<ValidateType>,

    parsers: {
        employeeFIO: composeParsers(parseFIO, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        employeePhoneNumber: undefined,
        passportSerial: undefined,
        passportFMS: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        passportDate: undefined,
        drivingLicenseNumber: composeParsers(parsePseudoLatinCharsAndNumbers, parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces, parseToUpperCase),
        drivingCategory: composeParsers(parseOnlyOneSpace, parseOnlyOneDash, parseOnlyOneDot, parseNoFirstSpaces),
        personnelNumber: undefined,
        garageNumber: undefined,
        photoFace: undefined,
        rating: undefined,
    } as EmployeesCardType<ParserType>,

    content: [] as EmployeesCardType[],
}

export type EmployeesStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof employeesStoreActions>

export const employeesStoreReducer = ( state = initialState, action: ActionsType ): EmployeesStoreReducerStateType => {

    switch (action.type) {

        case 'employees-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'employees-store-reducer/SET-EMPLOYEES-CONTENT': {
            return {
                ...state,
                content: [
                    ...action.employees,
                ],
            }
        }
        case 'employees-store-reducer/TOGGLE-EMPLOYEE-IS-FETCHING': {
            return {
                ...state,
                employeeIsFetching: action.employeeIsFetching,
            }
        }
        case 'employees-store-reducer/CHANGE-EMPLOYEE': {
            return {
                ...state,
                content: [
                    ...state.content
                        .map(( val ) => ( val.idEmployee !== action.idEmployee ) ? val : action.employees),
                ],
            }
        }
        case 'employees-store-reducer/DELETE-EMPLOYEE': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { idEmployee } ) => idEmployee !== action.idEmployee),
                ],
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const employeesStoreActions = {
    setEmployeesContent: ( employees: EmployeesCardType[] ) => ( {
        type: 'employees-store-reducer/SET-EMPLOYEES-CONTENT',
        employees,
    } as const ),
    setCurrentId: ( currentId: string ) => ( {
        type: 'employees-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    changeEmployees: ( idEmployee: string, employees: EmployeesCardType ) => ( {
        type: 'employees-store-reducer/CHANGE-EMPLOYEE',
        idEmployee,
        employees,
    } as const ),
    deleteEmployees: ( idEmployee: string ) => ( {
        type: 'employees-store-reducer/DELETE-EMPLOYEE',
        idEmployee,
    } as const ),
    toggleEmployeeIsFetching: ( employeeIsFetching: boolean ) => ( {
        type: 'employees-store-reducer/TOGGLE-EMPLOYEE-IS-FETCHING',
        employeeIsFetching,
    } as const ),
}

/* САНКИ */

export type EmployeesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


export const getAllEmployeesAPI = ( { innID }: { innID: number } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        dispatch(employeesStoreActions.toggleEmployeeIsFetching(true))
        try {
            const response = initialEmployeesValues
            dispatch(employeesStoreActions.setEmployeesContent(response))
        } catch (e) {
            alert(e)
        }
        dispatch(employeesStoreActions.toggleEmployeeIsFetching(false))
    }
