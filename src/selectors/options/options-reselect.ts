import {AppStateType} from '../../redux/redux-store'
import {OptionsStoreReducerStateType} from '../../redux/options/options-store-reducer';
import {createSelector} from 'reselect'
import {getAllShippersStore, getCurrentIdShipperStore} from './shippers-reselect';
import {
    ConsigneesCardType,
    EmployeesCardType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
} from '../../types/form-types';
import {getAllConsigneesStore, getCurrentIdConsigneeStore} from './consignees-reselect';
import {getAllTransportStore} from './transport-reselect';
import {getAllTrailerStore} from './trailer-reselect';
import {getAllEmployeesStore} from './employees-reselect';

type OptionsStoreSelectors<T extends keyof Y, Y = OptionsStoreReducerStateType> = ( state: AppStateType ) => Y[T]

const getShippersTitleOptionsStore: OptionsStoreSelectors<'shippers'> = ( state ) => state.optionsStoreReducer.shippers
const getConsigneesTitleOptionsStore: OptionsStoreSelectors<'consignees'> = ( state ) => state.optionsStoreReducer.consignees
const getTransportTitleOptionsStore: OptionsStoreSelectors<'transport'> = ( state ) => state.optionsStoreReducer.transport
const getTrailerTitleOptionsStore: OptionsStoreSelectors<'trailer'> = ( state ) => state.optionsStoreReducer.trailer
const getEmployeesTitleOptionsStore: OptionsStoreSelectors<'employees'> = ( state ) => state.optionsStoreReducer.employees

export const getRequisitesInfoOptionsStore: OptionsStoreSelectors<'requisitesInfo'> = ( state ) => state.optionsStoreReducer.requisitesInfo


// выборка из списка загруженных грузоотправителей
export const getShippersOptionsStore = createSelector(getAllShippersStore, getShippersTitleOptionsStore,
    ( shippers: ShippersCardType[], titles ): OptionsStoreReducerStateType['shippers'] => {
        return { ...titles, content: shippers.map(( { idSender: id, title , city} ) => ( { id, title: title + '', city: `[${city||''}]` } )) }
    })
// выборка из названий грузополучателей
export const getShippersAllNamesListOptionsStore = createSelector(getShippersOptionsStore,
    ( { content } ): string[] => content.map(( { title } ) => title))
// выборка из названий грузополучателей, кроме имени того, который сейчас редактируется
export const getShippersNamesListOptionsStore = createSelector(getShippersOptionsStore, getCurrentIdShipperStore,
    ( { content }, currentId ): string[] => content.filter(( { id } ) => id !== currentId).map(( { title } ) => title))

// выборка из списка загруженных грузополучателей
export const getConsigneesOptionsStore = createSelector(getAllConsigneesStore, getConsigneesTitleOptionsStore,
    ( consignee: ConsigneesCardType[], titles ): OptionsStoreReducerStateType['consignees'] => {
return { ...titles, content: consignee.map(( { idRecipient: id, title , city} ) => ( { id, title: title + '', city: `[${city||''}]` } )) }
    })
// выборка из названий грузополучателей
export const getConsigneesAllNamesListOptionsStore = createSelector(getConsigneesOptionsStore,
    ( { content } ): string[] => content.map(( { title } ) => title))
// выборка из названий грузополучателей, кроме имени того, который сейчас редактируется
export const getConsigneesNamesListOptionsStore = createSelector(getConsigneesOptionsStore, getCurrentIdConsigneeStore,
    ( { content }, currentId ): string[] => content.filter(( { id } ) => id !== currentId).map(( { title } ) => title))

// выборка из списка загруженных грузовиков/тягачей
export const getTransportOptionsStore = createSelector(getAllTransportStore, getTransportTitleOptionsStore,
    ( transport: TransportCardType[], titles ): OptionsStoreReducerStateType['transport'] => {
        return {
            ...titles, content: transport.map(( { idTransport: id, transportTrademark, transportNumber } ) =>
                ( { id, title: transportTrademark + ', ' + transportNumber } )),
        }
    })

// выборка из списка загруженных прицепов
export const getTrailerOptionsStore = createSelector(getAllTrailerStore, getTrailerTitleOptionsStore,
    ( trailer: TrailerCardType[], titles ): OptionsStoreReducerStateType['trailer'] => {
        return {
            ...titles, content: trailer.map(( { idTrailer: id, trailerTrademark, trailerNumber } ) =>
                ( { id, title: trailerTrademark + ', ' + trailerNumber } )),
        }
    })

// выборка из списка загруженных прицепов
export const getEmployeesOptionsStore = createSelector(getAllEmployeesStore, getEmployeesTitleOptionsStore,
    ( employees: EmployeesCardType[], titles ): OptionsStoreReducerStateType['employees'] => {
        return {
            ...titles, content: employees.map(( { idEmployee: id, employeeFIO } ) =>
                ( { id, title: employeeFIO + '' } )),
        }
    })