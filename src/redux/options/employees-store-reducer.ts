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
    parseAllNumbers,
    parseFIO,
    parseNoFirstSpaces,
    parseOnlyOneDash,
    parseOnlyOneDot,
    parseOnlyOneSpace,
    parsePseudoLatinCharsAndNumbers,
    parseToUpperCase,
} from '../../utils/parsers';
import {employeesApi} from '../../api/options/employee.api';

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
        passportSerial: composeValidators(required, mustBe00Numbers(10), mustNotBeOnlyNull),
        passportFMS: composeValidators(required),
        passportDate: composeValidators(required),
        drivingLicenseNumber: composeValidators(required, maxLength(20)),
        drivingCategory: composeValidators(required),
        personnelNumber: composeValidators(maxNumbers(10), mustNotBeOnlyNull),
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
    toggleEmployeeIsFetching: ( employeeIsFetching: boolean ) => ( {
        type: 'employees-store-reducer/TOGGLE-EMPLOYEE-IS-FETCHING',
        employeeIsFetching,
    } as const ),
}

/* САНКИ */

export type EmployeesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// запрос всего транспорта пользователя от сервера
export const getAllEmployeesAPI = (): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(employeesStoreActions.toggleEmployeeIsFetching(true))
        try {
            const idUser = getState().authStoreReducer.authID

            const response = await employeesApi.getAllEmployeesByUserId({ idUser })
            dispatch(employeesStoreActions.setEmployeesContent(response.map(( { idUser, ...values } ) => values)))

            if (!response.length) console.log('Пока ни одного СОТРУДНИКА')
        } catch (e) {
            alert(e)
        }
        dispatch(employeesStoreActions.toggleEmployeeIsFetching(false))
    }

// добавить одну запись ТРАНСПОРТА через АПИ
export const newEmployeeSaveToAPI = ( values: EmployeesCardType<string>, image: File | undefined ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await employeesApi.createOneEmployee({
                idUser, ...values,
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// изменить одну запись ПРИЦЕПА через АПИ
export const modifyOneEmployeeToAPI = ( values: EmployeesCardType<string>, image: File | undefined ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await employeesApi.modifyOneEmployee({
                ...values, idUser,
                rating: '5',
                coordinates: '48.671049, 40.660313',
                status: 'free'
            }, image)
            if (response.success) console.log(response.success)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// удаляем один ПРИЦЕП
export const oneEmployeesDeleteToAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.deleteOneEmployee({ idEmployee })
            if (response.message) console.log(response.message)
        } catch (e) {
            // @ts-ignore
            alert(JSON.stringify(e.response.data))
        }
        await dispatch(getAllEmployeesAPI())
    }