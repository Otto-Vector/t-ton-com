import {AppStateType} from '../../redux/redux-store'
import {OptionsStoreReducerStateType} from '../../redux/options/options-store-reducer';
import {createSelector} from 'reselect'
import {getAllShippersStore} from './shippers-reselect';
import {
    ConsigneesCardType,
    EmployeesCardType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
} from '../../types/form-types';
import {getAllConsigneesStore} from './consignees-reselect';
import {getAllTransportStore} from './transport-reselect';
import {getAllTrailerStore} from './trailer-reselect';
import {getAllEmployeesStore} from './employees-reselect';

type OptionsStoreSelectors<T extends keyof Y, Y = OptionsStoreReducerStateType> = ( state: AppStateType ) => Y[T]

const getShippersTitleOptionsStore: OptionsStoreSelectors<'shippers'> = ( state ) => state.optionsStoreReducer.shippers
const getConsigneesTitleOptionsStore: OptionsStoreSelectors<'consignees'> = ( state ) => state.optionsStoreReducer.consignees
const getTransportTitleOptionsStore: OptionsStoreSelectors<'transport'> = ( state ) => state.optionsStoreReducer.transport
const getTrailerTitleOptionsStore: OptionsStoreSelectors<'trailer'> = ( state ) => state.optionsStoreReducer.trailer
const getEmployeesTitleOptionsStore: OptionsStoreSelectors<'employees'> = ( state ) => state.optionsStoreReducer.employees



// выборка из списка загруженных грузоотправителей
export const getShippersOptionsStore = createSelector(getAllShippersStore, getShippersTitleOptionsStore,
    ( shippers: ShippersCardType[], titles ) => {
        return { ...titles, content: shippers.map(( { id, title } ) => ( { id, title } )) }
    })
// выборка из списка загруженных грузополучателей
export const getConsigneesOptionsStore = createSelector(getAllConsigneesStore, getConsigneesTitleOptionsStore,
    ( consignee: ConsigneesCardType[], titles ) => {
        return { ...titles, content: consignee.map(( { id, title } ) => ( { id, title } )) }
    })

// выборка из списка загруженных грузовиков/тягачей
export const getTransportOptionsStore = createSelector(getAllTransportStore, getTransportTitleOptionsStore,
    ( transport: TransportCardType[], titles ) => {
        return {
            ...titles, content: transport.map(( { id, transportTrademark, transportNumber } ) =>
                ( { id, title: transportTrademark + ', ' + transportNumber } )),
        }
    })

// выборка из списка загруженных прицепов
export const getTrailerOptionsStore = createSelector(getAllTrailerStore, getTrailerTitleOptionsStore,
    ( trailer: TrailerCardType[], titles ) => {
        return {
            ...titles, content: trailer.map(( { id, trailerTrademark, trailerNumber } ) =>
                ( { id, title: trailerTrademark + ', ' + trailerNumber } )),
        }
    })

// выборка из списка загруженных прицепов
export const getEmployeesOptionsStore = createSelector(getAllEmployeesStore, getEmployeesTitleOptionsStore,
    ( employees: EmployeesCardType[], titles ) => {
        return {
            ...titles, content: employees.map(( { id, employeeFIO } ) =>
                ( { id, title: employeeFIO + '' } )),
        }
    })