import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {EmployeeCardType, ResponseToRequestCardType, ValidateType} from '../../types/form-types'
import {syncValidators} from '../../utils/validators'
import {responseToRequestApi} from '../../api/local-api/request-response/response-to-request.api'
import {GlobalModalActionsType, globalModalStoreActions} from '../utils/global-modal-store-reducer'
import {getAllRequestsAPI} from './request-store-reducer'
import {modifyOneEmployeeSetStatusAddedToResponse} from '../options/employees-store-reducer'
import {GetActionsTypes} from '../../types/ts-utils'
import {syncParsers} from '../../utils/parsers'
import {TtonErrorType} from '../../api/local-api/back-instance.api'
import {boldWrapper} from '../../utils/html-rebuilds'
import {employeesApi} from '../../api/local-api/options/employee.api'


const initialState = {
    isFetching: false,
    label: {
        idEmployee: 'Сотрудник',
        idTransport: 'Транспорт',
        idTrailer: 'Прицеп',
        responseStavka: 'Ставка, тн.км.',
        responsePrice: 'Сумма, руб.',
        responseTax: 'Налог',
    } as ResponseToRequestCardType,

    initialValues: {} as ResponseToRequestCardType,

    placeholder: {
        idEmployee: 'Поиск водителя...',
        idTransport: 'Поиск транспорта...',
        idTrailer: 'Поиск прицепа...',
        responseStavka: '0.00 руб',
    },

    maskOn: {
        responseStavka: undefined,
    },

    validators: {
        idEmployee: syncValidators.required,
        idTransport: syncValidators.required,
        idTrailer: undefined,
        responseStavka: syncValidators.responseStavka,
    } as ResponseToRequestCardType<ValidateType>,

}

export type AddDriverStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof addDriverStoreActions>

export const addDriverStoreReducer = ( state = initialState, action: ActionsType ): AddDriverStoreReducerStateType => {

    switch (action.type) {

        case 'add-driver-store-reducer/SET-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        default: {
            return state
        }
    }
}

/* ЭКШОНЫ */
export const addDriverStoreActions = {
    // установка значения в карточку отображения водителя
    setValues: ( initialValues: ResponseToRequestCardType ) => ( {
        type: 'add-driver-store-reducer/SET-VALUES',
        initialValues,
    } as const ),
    setIsFetching: ( isFetching: boolean ) => ( {
        type: 'add-driver-store-reducer/SET-IS-FETCHING',
        isFetching,
    } as const ),
}

/* САНКИ */
export type AddDriverStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType | GlobalModalActionsType>

// сохраняем новый ответ на заявку
export const setOneResponseToRequest = (
    {
        addDriverValues, oneEmployee: employeeValues,
    }: { addDriverValues: ResponseToRequestCardType<string>, oneEmployee: EmployeeCardType<string> } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch, getState ) => {
        dispatch(addDriverStoreActions.setIsFetching(true))
        try {
            const requestCarrierId = getState().authStoreReducer.authID
            await responseToRequestApi.createOneResponseToRequest({
                ...addDriverValues, requestCarrierId,
            })

            // ставим статус водителю
            await dispatch(modifyOneEmployeeSetStatusAddedToResponse({ idEmployee: employeeValues.idEmployee }))

            dispatch(getAllRequestsAPI())
        } catch (e: TtonErrorType<{ prevResponseToRequest: string }>) {
            dispatch(addDriverStoreActions.setIsFetching(false))
            if (e?.response?.data?.prevResponseToRequest) {
                dispatch(globalModalStoreActions.setTextMessage([
                    'Водитель уже был привязан к данной заявке.',
                    'Cтоимость скорректирована с учётом внесённых данных.',
                    boldWrapper('Водитель: ') + employeeValues.employeeFIO,
                    boldWrapper('Общий перевозимый вес: ') + addDriverValues.cargoWeight + ' тн.',
                    boldWrapper('Стоимость тн.км.: ') + addDriverValues.responseStavka + ' руб.',
                    boldWrapper('Общая цена за заявку: ') + syncParsers.parseToNormalMoney(+addDriverValues.responsePrice) + ' руб.',
                ]))
                await dispatch(modifyOneResponseToRequest({
                    addDriverValues,
                    responseId: e.response.data.prevResponseToRequest,
                }))
            } else {
                dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
            }
        }
        dispatch(addDriverStoreActions.setIsFetching(false))
    }

// изменяем существующий ответ на заявку
export const modifyOneResponseToRequest = ( {
                                                addDriverValues,
                                                responseId,
                                            }: { addDriverValues: ResponseToRequestCardType<string>, responseId: string } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.modifyOneResponseToRequest({ ...addDriverValues, responseId })
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
        }
    }

// запрос на список ответов на заявки, по данным водителя
export const getResponseToRequestListByIdEmployee = ( idEmployee: { idEmployee: string } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.getOneOrMoreResponseToRequest(idEmployee)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
        }
    }

// запрос на список ответов на заявки, по данным номера заявки
export const getResponseToRequestListByRequestNumber = ( requestNumber: { requestNumber: string } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.getOneOrMoreResponseToRequest(requestNumber)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
        }
    }

// запрос на список ответов на заявки, по данным номера заявки
export const getOneResponseToRequestById = ( responseId: { responseId: string } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.getOneOrMoreResponseToRequest(responseId)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data?.message)))
        }
    }

// удаление ответов на заявки, из-за принятия на заявке
export const removeResponseToRequestsBzAcceptRequest = ( requestNumber: string ): AddDriverStoreReducerThunkActionType =>
    async () => {
        try {
            const response = await responseToRequestApi.deleteSomeResponseToRequest({ requestNumber })
            console.log(response)
        } catch (e: TtonErrorType) {
            console.log(JSON.stringify(e?.response?.data))
        }
    }

export const removeResponseToRequestsBzRemoveThisDriverFromRequest = ( responseId: string ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.deleteSomeResponseToRequest({ responseId })
            dispatch(getAllRequestsAPI())
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }

// удаление ответов на заявки, привязанных к сотруднику
// *по idEmployee работает некорректно, удаляю по списку из addedToResponses*
export const removeResponseToRequestsBzEmployee = ( {
                                                        responseId,
                                                        idEmployee,
                                                    }: { responseId: string, idEmployee: string } ): AddDriverStoreReducerThunkActionType =>
    async ( dispatch ) => {
        try {
            await responseToRequestApi.deleteSomeResponseToRequest({ responseId })
            // дополнительная зачистка из-за предыдущих глюков удаления в этом поле
            await employeesApi.removeResponseToRequestFromEmployee({ idEmployee, addedToResponse: 'all' })
            await dispatch(getAllRequestsAPI())
            // console.log(response)
        } catch (e: TtonErrorType) {
            dispatch(globalModalStoreActions.setTextMessage(JSON.stringify(e?.response?.data)))
        }
    }
