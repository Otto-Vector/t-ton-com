import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {syncValidators} from '../../utils/validators'
import {EmployeeCardType, ParserType, ValidateType} from '../../types/form-types'
import {syncParsers} from '../../utils/parsers'
import {employeesApi} from '../../api/local-api/options/employee.api'
import {
    GlobalModalActionsType,
    globalModalStoreActions,
    textAndActionGlobalModal,
} from '../utils/global-modal-store-reducer'
import {removeResponseToRequestsBzEmployee} from '../forms/add-driver-store-reducer'
import {GetActionsTypes} from '../../types/ts-utils'
import {rerenderTransport} from './transport-store-reducer'
import {rerenderTrailer} from './trailer-store-reducer'
import {TtonErrorType} from '../../api/local-api/back-instance.api'

const initialState = {
    employeeIsFetching: false,
    currentId: '',
    label: {
        employeeFIO: 'ФИО сотрудника',
        employeePhoneNumber: 'Телефон сотрудника',
        passportSerial: 'Серия, № паспорта',
        passportFMS: 'Кем выдан паспорт',
        passportDate: 'Когда выдан паспорт',
        drivingLicenseNumber: 'Номер водительского удостоверения',
        drivingCategory: 'Водительские категории',
        personnelNumber: 'Табельный номер',
        garageNumber: 'Гаражный номер',
        photoFace: 'Добавить фотографию сотрудника',
        rating: 'Рейтинг:',
        idTransport: 'Прикреплённый транспорт',
        idTrailer: 'Прикреплённый прицеп',
    } as EmployeeCardType<string>,

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
    } as EmployeeCardType,

    initialValues: {} as EmployeeCardType,

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
    } as EmployeeCardType<ValidateType>,

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
    } as EmployeeCardType<ParserType>,

    content: [] as EmployeeCardType[],
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
    setEmployeesContent: ( employees: EmployeeCardType[] ) => ( {
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
    setInitialValues: ( initialValues: EmployeeCardType ) => ( {
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
export const newEmployeeSaveToAPI = ( values: EmployeeCardType<string>, image: File | undefined ): EmployeesStoreReducerThunkActionType<string | void> =>
    async ( dispatch, getState ) => {

        try {
            const idUser = getState().authStoreReducer.authID
            const response = await employeesApi.createOneEmployee({
                ...values, idUser,
                status: 'свободен',
                rating: '-',
            }, image)
            if (response.success) console.log(response.success)
        } catch (e: TtonErrorType<{ idEmployee: string }>) {
            if (e?.response?.data?.failed) { // если сотрудник с данным паспортом уже существует
                return e?.response?.data?.idEmployee
            }
            console.log(JSON.stringify(e?.response?.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// изменить одну запись СОТРУДНИКА через АПИ (с неявным присвоением idUser)
export const modifyOneEmployeeToAPI = (
    {
        employeeValues,
        image,
        status,
    }: { employeeValues: EmployeeCardType<string>, image?: File, status: EmployeeCardType['status'] } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        const idUser = getState().authStoreReducer.authID
        try {
            const response = await employeesApi.modifyOneEmployee({
                ...employeeValues,
                idUser,
                status,
            }, image)
            if (response.success) console.log(response.success)
            if (response.message) console.log(response.message)
            // перерисовываем список транспорт/прицеп при любом изменении сотрудника
            dispatch(rerenderTransport())
            dispatch(rerenderTrailer())
        } catch (e: TtonErrorType) {
            console.error(JSON.stringify(e?.response?.data))
        }
        await dispatch(getAllEmployeesAPI())
    }

// частичное изменение данных сотрудника
export const modifyOneEmployeeSoftToAPI = ( employeeData: Partial<Omit<EmployeeCardType, 'idEmployee' | 'photoFace'>> & { idEmployee: string } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.modifyOneEmployeeNoPhoto(employeeData)
            if (response.message) console.log(response.message)
            if (response.success) console.log(response.success)
            // перерисовываем список транспорт/прицеп при любом изменении сотрудника
            dispatch(rerenderTransport())
            dispatch(rerenderTrailer())
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllEmployeesAPI())
    }

// события после изменения данных пользователя, ведущих к удалению ответов на заявки, в которых он учавстовал
// и очистки его статуса на статус 'свободен'
export const modifyOneEmployeeResetResponsesAndStatus = (
    {
        employeeValues,
        image,
    }: { employeeValues: EmployeeCardType<string>, image?: File } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // удаляем все ответы на запросы у данного сотрудника
        await dispatch(removeResponseToRequestsBzEmployee(employeeValues.idEmployee))
        await dispatch(modifyOneEmployeeToAPI({ employeeValues, image, status: 'свободен' }))
    }

// события после утверждения пользователя на заявке
export const modifyOneEmployeeResetResponsesSetStatusAcceptedToRequest = (
    { idEmployee }: { idEmployee: string } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        // удаляем все ответы на запросы у данного сотрудника
        await dispatch(removeResponseToRequestsBzEmployee(idEmployee))
        await dispatch(modifyOneEmployeeSoftToAPI({ idEmployee, status: 'на заявке' }))
    }

// события после добавления пользователя на заявку
export const modifyOneEmployeeSetStatusAddedToResponse = (
    {
        idEmployee,
        addedToResponse,
    }: { idEmployee: string, addedToResponse?: string } ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        await dispatch(modifyOneEmployeeSoftToAPI({ idEmployee, status: 'ожидает принятия', addedToResponse }))
    }


// удаляем одного СОТРУДНИКА "частично"
export const oneEmployeeDeleteSoftToAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        await dispatch(modifyOneEmployeeSoftToAPI({
            idEmployee,
            idUser: '-',
            status: 'уволен',
            idTransport: '-',
            idTrailer: '-',
        }))
    }

// удаляем одного СОТРУДНИКА ПОЛНОСТЬЮ
export const oneEmployeeDeleteHardToAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.deleteOneEmployee({ idEmployee })
            if (response.message) console.log(response.message)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
        await dispatch(getAllEmployeesAPI())
    }

// простой запрос на одного сотрудника по idEmployee
export const getOneEmployeeFromAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            const response = await employeesApi.getOneOrMoreEmployeeById({ idEmployee })
            if (response.message) console.log(response.message)
            if (response.length > 0) {
                const oneEmployee = response[0]
                dispatch(employeesStoreActions.setInitialValues(oneEmployee))
            }
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }

// запрос на одного сотрудника по idEmployee ДЛЯ ВОССТАНОВЛЕНИЯ
export const getOneFiredEmployeeFromAPI = ( idEmployee: string ): EmployeesStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(employeesStoreActions.setInitialValues({} as EmployeeCardType))
        try {
            const response = await employeesApi.getOneOrMoreEmployeeById({ idEmployee })
            if (response.message) console.log(response.message)
            if (response.length > 0) {
                const oneEmployee = response[0]
                const organization = getState().requisitesStoreReducer.filteredContent?.find(( { idUser } ) => idUser === oneEmployee.idUser)
                const { options } = getState().routesStoreReducer.routes
                if (oneEmployee.status === 'уволен' || oneEmployee.idUser === '-') {
                    dispatch(employeesStoreActions.setInitialValues(oneEmployee))
                    await dispatch(textAndActionGlobalModal({
                        text: 'Восстановление сотрудника успешно выполнено!',
                        timeToDeactivate: 3000,
                    }))
                } else {
                    await dispatch(textAndActionGlobalModal({
                        text: [
                            'Сотрудник с данным паспортом приписан к другой оранизации: ' +
                            `<b>${ ( organization?.organizationName ? organization.organizationName.toUpperCase() : '' ) }</b>`,
                            'Необходимо его уволить (УДАЛИТЬ) в другой организации, чтобы приписать к вашей',
                        ],
                        navigateOnOk: options,
                        navigateOnCancel: options,
                    }))
                }
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
