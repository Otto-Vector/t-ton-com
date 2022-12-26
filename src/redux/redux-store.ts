import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import thunkMiddleWare from 'redux-thunk'
import {baseStoreReducer} from './base-store-reducer';
import {authStoreReducer} from './auth-store-reducer';
import {routesStoreReducer} from './routes-store-reducer';
import {requisitesStoreReducer} from './options/requisites-store-reducer';
import {optionsStoreReducer} from './options/options-store-reducer';
import {employeesStoreReducer} from './options/employees-store-reducer'
import {consigneesStoreReducer} from './options/consignees-store-reducer'
import {shippersStoreReducer} from './options/shippers-store-reducer'
import {trailerStoreReducer} from './options/trailer-store-reducer'
import {transportStoreReducer} from './options/transport-store-reducer'
import {filtersStoreReducer} from './table/filters-store-reducer'
import {tableStoreReducer} from './table/table-store-reducer';
import {addDriverStoreReducer} from './forms/add-driver-store-reducer';
import {requestStoreReducer} from './forms/request-store-reducer';
import {infoStoreReducer} from './info-store-reducer';
import {lightBoxStoreReducer} from './utils/lightbox-store-reducer'
import {bigMapStoreReducer} from './maps/big-map-store-reducer';
import {appStoreReducer} from './app-store-reducer';
import {daDataStoreReducer} from './api/dadata-response-reducer';
import {globalModalStoreReducer} from './utils/global-modal-store-reducer';
import {avtoDispetcherStoreReducer} from './api/avto-dispetcher-response-reducer';
import {cargoCompositionStoreReducer} from './api/cargo-composition-response-reducer';


const reducersObject = {
    appStoreReducer,
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
    filtersStoreReducer,
    tableStoreReducer,
    addDriverStoreReducer,
    requestStoreReducer,
    infoStoreReducer,
    lightBoxStoreReducer,
    bigMapStoreReducer,
    daDataStoreReducer,
    avtoDispetcherStoreReducer,
    globalModalStoreReducer,
    cargoCompositionStoreReducer,
}

const rootReducer = combineReducers(reducersObject)

type StateType = typeof rootReducer
export type AppStateType = ReturnType<StateType>


// для расширения reduxDevTool в браузере и отслеживания стейта
// @ts-ignore-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// возвращаем стор вместе с санками
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleWare)))

export default store
