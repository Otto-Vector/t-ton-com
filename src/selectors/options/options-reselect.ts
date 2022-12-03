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
import {getAllTransportSelectFromLocal, getAllTransportStore} from './transport-reselect';
import {getAllTrailerSelectFromLocal, getAllTrailerStore} from './trailer-reselect';
import {getAllEmployeesStore} from './employees-reselect';
import {parseFamilyToFIO} from '../../utils/parsers';
import {SelectOptionsType} from '../../ui/common/form-selector/selector-utils';
import {getInitialValuesRequestStore} from '../forms/request-form-reselect';

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
            content: shippers.map(( { idSender: id, title = '', city: subTitle } ) => ( {
                id,
                title,
                subTitle,
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
            content: consignee.map(( { idRecipient: id, title = '', city: subTitle } ) => ( {
                id,
                title,
                subTitle,
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
                ( { idTransport: id, transportTrademark, transportNumber }, index ) =>
                    ( {
                        id,
                        title: transportTrademark + ', ' + transportNumber,
                        subTitle: transportHasEmployee[index].subLabel,
                    } )),
        }
    })

// выборка из списка загруженных прицепов
export const getTrailerOptionsStore = createSelector(getAllTrailerStore, getTrailerTitleOptionsStore, getAllTrailerSelectFromLocal,
    ( trailer: TrailerCardType[], titles, trailersHasEmployee ): OptionsStoreReducerStateType['trailer'] => {

        return {
            ...titles, content: trailer.map(
                ( { idTrailer: id, trailerTrademark, trailerNumber }, index ) =>
                    ( {
                        id,
                        title: trailerTrademark + ', ' + trailerNumber,
                        subTitle: trailersHasEmployee[index].subLabel,
                    } )),
        }
    })

// выборка из списка загруженных сотрудников
export const getEmployeesOptionsStore = createSelector(getAllEmployeesStore, getEmployeesTitleOptionsStore, getAllTransportStore,
    ( employees: EmployeesCardType[], titles, transports ): OptionsStoreReducerStateType['employees'] => {
        return {
            ...titles, content: employees.map(( { idEmployee: id, employeeFIO: title = '', idTransport } ) => {
                    const subTitleFind = transports.find(( { idTransport: trId } ) => idTransport === trId)
                    return { id, title, subTitle: subTitleFind?.transportTrademark }
                },
            ),
        }
    })

// все сотрудники в селектор с доп. данными о типе груза
export const getAllEmployeesSelectWithCargoType = createSelector(
    getAllEmployeesStore,
    getAllTransportStore,
    getAllTrailerStore,
    ( employees, transports, trailers ): SelectOptionsType[] => employees
        .map(( { idEmployee, idTransport, idTrailer, employeeFIO } ) => {
                const currentTransport = transports.find(v => v.idTransport === idTransport)
                const transportCargoType = currentTransport?.cargoType || 'без транспорта'
                const transportTrailerCargoType = transportCargoType !== 'Тягач' ? transportCargoType
                    : trailers.find(v => v.idTrailer === idTrailer)?.cargoType || transportCargoType
                return ( {
                    key: idEmployee,
                    value: idEmployee,
                    label: parseFamilyToFIO(employeeFIO),
                    subLabel: currentTransport
                        ? currentTransport?.transportTrademark + ', ' + ( transportTrailerCargoType.toUpperCase() )
                        : transportTrailerCargoType,
                    isDisabled: !currentTransport?.idTransport || !transportTrailerCargoType,
                    extendInfo: transportTrailerCargoType,
                } )
            },
        ),
)

// все сотрудники в селектор с доп. данными о типе груза и отключенным выбором неверного типа груза
export const getAllEmployeesSelectWithCargoTypeDisabledWrongCargo = createSelector(
    getAllEmployeesSelectWithCargoType,
    getInitialValuesRequestStore,
    ( employees, { cargoType } ): SelectOptionsType[] => employees.map(( val ) => ( {
        ...val,
        isDisabled: val.isDisabled || val.extendInfo !== cargoType,
    } )),
)