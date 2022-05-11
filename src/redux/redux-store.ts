import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import thunkMiddleWare from 'redux-thunk'
import {baseStoreReducer} from './base-store-reducer';
import {authStoreReducer} from './auth-store-reducer';
import {routesStoreReducer} from './routes-store-reducer';
import {requisitesStoreReducer} from './requisites-store-reducer';
import {optionsStoreReducer} from './options/options-store-reducer';
import {employeesStoreReducer} from './options/employees-store-reducer'
import {consigneesStoreReducer} from './options/consignees-store-reducer'
import {shippersStoreReducer} from './options/shippers-store-reducer'
import {trailerStoreReducer} from './options/trailer-store-reducer'
import {transportStoreReducer} from './options/transport-store-reducer'


const reducersObject = {
    baseStoreReducer,
    authStoreReducer,
    routesStoreReducer,
    requisitesStoreReducer,
    optionsStoreReducer,
    employeesStoreReducer,
    consigneesStoreReducer,
    shippersStoreReducer,
    trailerStoreReducer,
    transportStoreReducer,
}

const rootReducer = combineReducers(reducersObject)

type StateType = typeof rootReducer
export type AppStateType = ReturnType<StateType>

// создал тип с обязательным type среди возвращаемых ключей для actions
export type ActionsAnyType = Record<string, (...args: any[]) => { type: string, [key: string]: any }>
// комбайним все значения объекта
export type PropertiesType<T> = T extends { [key: string]: infer U } ? U : never;
// возвращаем комбайн возвращаемых значений, также extends-ом проверяем, является ли он типом ActionsAnyType
// также удаляем вcе undefined и null
export type GetActionsTypes<T extends ActionsAnyType> = NonNullable<ReturnType<PropertiesType<T>>>

// для расширения reduxDevTool в браузере и отслеживания стейта
// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// возвращаем стор вместе с санками
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleWare)))
// let store = createStore(reducers, applyMiddleware(thunkMiddleWare));

export default store
