import {AppStateType} from '../../redux/redux-store'
import {OptionsStoreReducerStateType} from '../../redux/options/options-store-reducer'
import {createSelector} from 'reselect'
import {getAllShippersStore, getCurrentIdShipperStore} from './shippers-reselect'
import {
    ConsigneesCardType,
    EmployeeCardType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
} from '../../types/form-types'
import {getAllConsigneesStore, getCurrentIdConsigneeStore} from './consignees-reselect'
import {getAllTransportStore} from './transport-reselect'
import {getAllTrailerStore} from './trailer-reselect'
import {getAllEmployeesStore} from './employees-reselect'
import {
    getAllTrailerSelectFromLocal,
    getAllTransportSelectFromLocal,
} from './for-selectors/all-selectors-buffer-reselect'


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
        return {
            ...titles,
            content: shippers.map(( {
                                        idSender: id,
                                        title = '',
                                        city: subTitle,
                                        innNumber: extendInfo,
                                    } ) => ( {
                id,
                title,
                subTitle,
                extendInfo,
            } )),
        }
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
        return {
            ...titles,
            content: consignee.map(( {
                                         idRecipient: id,
                                         title = '',
                                         city: subTitle,
                                         innNumber: extendInfo,
                                     } ) => ( {
                id,
                title,
                subTitle,
                extendInfo,
            } )),
        }
    })

// массив названий грузополучателей
export const getConsigneesAllNamesListOptionsStore = createSelector(getConsigneesOptionsStore,
    ( { content } ): string[] => content.map(( { title } ) => title))
// выборка из названий грузополучателей, кроме имени того, который сейчас редактируется
export const getConsigneesNamesListOptionsStore = createSelector(getConsigneesOptionsStore, getCurrentIdConsigneeStore,
    ( { content }, currentId ): string[] => content.filter(( { id } ) => id !== currentId).map(( { title } ) => title))

// выборка из списка загруженных грузовиков/тягачей
export const getTransportOptionsStore = createSelector(getAllTransportStore, getTransportTitleOptionsStore, getAllTransportSelectFromLocal,
    ( transport: TransportCardType[], titles, transportHasEmployee ): OptionsStoreReducerStateType['transport'] => {
        return {
            ...titles, content: transport.map(
                ( { idTransport: id, transportTrademark, transportNumber, cargoType }, index ) =>
                    ( {
                        id,
                        title: transportTrademark + ', ' + transportNumber,
                        subTitle: transportHasEmployee[index].subLabel,
                        moreDataForSearch: cargoType,
                    } )),
        }
    })

// выборка из списка загруженных прицепов
export const getTrailerOptionsStore = createSelector(getAllTrailerStore, getTrailerTitleOptionsStore, getAllTrailerSelectFromLocal,
    ( trailer: TrailerCardType[], titles, trailersHasEmployee ): OptionsStoreReducerStateType['trailer'] => {

        return {
            ...titles, content: trailer.map(
                ( { idTrailer: id, trailerTrademark, trailerNumber, cargoType }, index ) =>
                    ( {
                        id,
                        title: trailerTrademark + ', ' + trailerNumber,
                        subTitle: trailersHasEmployee[index].subLabel,
                        moreDataForSearch: cargoType,
                    } )),
        }
    })

// выборка из списка загруженных сотрудников в список отображения "Настройки"
export const getEmployeesOptionsStore = createSelector(getAllEmployeesStore, getEmployeesTitleOptionsStore, getAllTransportStore, getAllTrailerStore,
    ( employees: EmployeeCardType[], titles, transports, trailers ): OptionsStoreReducerStateType['employees'] => {
        return {
            ...titles, content: employees.map(
                ( { idEmployee: id, employeeFIO: title = '', idTransport, idTrailer, status } ) => {
                    const transportOfCurrentEmployee = transports.find(( { idTransport: trId } ) => idTransport === trId)
                    const cargoType = transportOfCurrentEmployee?.cargoType !== 'Тягач'
                        ? transportOfCurrentEmployee?.cargoType
                        : trailers.find(( { idTrailer: trId } ) => idTrailer === trId)?.cargoType
                    return {
                        id,
                        title,
                        subTitle: transportOfCurrentEmployee?.transportTrademark,
                        extendInfo: status,
                        moreDataForSearch: cargoType || '',
                    }
                },
            ),
        }
    })
