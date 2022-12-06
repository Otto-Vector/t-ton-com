import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {syncValidators} from '../../utils/validators'
import {EmployeesCardType, ParserType, ValidateType} from '../../types/form-types'
import {syncParsers} from '../../utils/parsers';
import {employeesApi} from '../../api/local-api/options/employee.api';
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer';
import {TtonErrorType} from '../../types/other-types';
import {removeResponseToRequestsBzEmployee} from '../forms/add-driver-store-reducer';

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
        drivingLicenseNumber: '## AA ######', // 10 цифр
        drivingCategory: undefined, // просто текст же?
        personnelNumber: '##### #####', // поставим ДО 10 цифр
        garageNumber: '##### #####', // поставим ДО 10 цифр
        photoFace: undefined, // путь к файлу изображения
        rating: '##', // чило ДО 2-х цифр
    } as EmployeesCardType,

    initialValues: {} as EmployeesCardType,

    validators: {
        employeeFIO: syncValidators.textReqMin,
        employeePhoneNumber: syncValidators.phone,
        passportSerial: syncValidators.passport,
        passportFMS: syncValidators.textReqMin,
        passportDate: syncValidators.required,
        drivingLicenseNumber: syncValidators.drivingLicence,
        drivingCategory: syncValidators.drivingCategory,
        personnelNumber: syncValidators.justTenNumbers,
        garageNumber: syncValidators.justTenNumbers,
        photoFace: undefined,
        rating: undefined,
    } as EmployeesCardType<ValidateType>,

    parsers: {
        employeeFIO: syncParsers.fio,
        employeePhoneNumber: syncParsers.tel,
        passportSerial: undefined,
        passportFMS: syncParsers.passportFMS,
        passportDate: undefined,
        drivingLicenseNumber: syncParsers.drivingLicence,
        drivingCategory: syncParsers.drivingCategory,
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

        case 'employees-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
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
    setInitialValues: ( initialValues: EmployeesCardType ) => ( {
        type: 'employees-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
}

/* САНКИ */

export type EmployeesStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>


// запрос всех водителей принадлежащих организации
export const getAllEmployeesAPI = (): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(employeesStoreActions.toggleEmployeeIsFetching(true))
        dispatch(employeesStoreActions.setEmployeesContent([]))
        try {
            const idUser = getState().authStoreReducer.authID

            const response = await employeesApi.getAllEmployeesByUserId({ idUser })
            if (response.message || !response.length) {
                throw new Error(response.message || `Сотрудники не найдены или пока не внесены`)
            } else {
                dispatch(employeesStoreActions.setEmployeesContent(response))
            }

        } catch (e) {
            console.error('Ошибка в запросе списка сотрудников: ', e)
        }

        dispatch(employeesStoreActions.toggleEmployeeIsFetching(false))
    }

// добавить одну запись СОТРУДНИКА через АПИ
export const newEmployeeSaveToAPI = ( values: EmployeesCardType<string>, image: File | undefined ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await employeesApi.createOneEmployee({
                ...values, idUser,
                passportDate: values.passportDate as string,
                status: 'свободен',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            console.log(JSON.stringify(e?.response?.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// изменить одну запись СОТРУДНИКА через АПИ
export const modifyOneEmployeeToAPI = (
    {
        employeeValues,
        image,
        status,
    }: { employeeValues: EmployeesCardType<string>, image?: File, status: EmployeesCardType['status'] } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {

        try {
            const response = await employeesApi.modifyOneEmployee({
                ...employeeValues,
                passportDate: employeeValues.passportDate as string,
                status,
            }, image)
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType) {
            console.error(JSON.stringify(e?.response?.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// события после изменения данных пользователя, ведущих к удалению ответов на заявки, в которых он учавстовал
// и очистки его статуса на статус 'свободен'
export const modifyOneEmployeeResetResponsesAndStatus = (
    {
        employeeValues,
        image,
    }: { employeeValues: EmployeesCardType<string>, image?: File } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // удаляем все ответы на запросы у данного сотрудника
        await dispatch(removeResponseToRequestsBzEmployee(employeeValues.idEmployee))
        await dispatch(modifyOneEmployeeToAPI({ employeeValues, image, status: 'свободен' }))
    }

// события после утверждения пользователя на заявке
export const modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest = (
    { employeeValues }: { employeeValues: EmployeesCardType<string> } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // удаляем все ответы на запросы у данного сотрудника
        await dispatch(removeResponseToRequestsBzEmployee(employeeValues.idEmployee))
        await dispatch(modifyOneEmployeeToAPI({ employeeValues, status: 'на заявке' }))
    }

// события после добавления пользователя на заявку
export const modifyOneEmployeeSetStatusAddedToResponse = (
    { employeeValues }: { employeeValues: EmployeesCardType<string> } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        await dispatch(modifyOneEmployeeToAPI({ employeeValues, status: 'ожидает принятия' }))
    }

// удаляем одного СОТРУДНИКА
export const oneEmployeesDeleteToAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.deleteOneEmployee({ idEmployee })
            if (response.message) console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllEmployeesAPI())
    }

export const getOneEmployeeFromAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.getOneEmployeeById({ idEmployee })
            if (response.message) console.log(response.message)
            if (response.length > 0) {
                const oneEmployee = response[0]
                dispatch(employeesStoreActions.setInitialValues(oneEmployee))
            }

        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }

// добавить пользователю информацию о привязке к ответу по заявке
export const addResponseIdToEmployee = ( data: { idEmployee: string, addedToResponse: string } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.addResponseToRequestToEmployee(data)
            if (response.success) console.log(response.success)
            if (response.message) console.log(response.message)
        } catch (e) {
            console.log(e)
        }
    }

// удалить данные пользователя
export const removeResponseIdFromEmployee = ( data: { idEmployee: string, addedToResponse: string | 'all' } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.removeResponseToRequestFromEmployee(data)
            if (response.success) console.log(response.success)
            if (response.message) console.log(response.message)
        } catch (e) {
            console.log(e)
        }
    }
