import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'
import {TransportCardType} from '../../types/form-types';
import {createSelector} from 'reselect';
import {parseFamilyToFIO} from '../../utils/parsers';
import {getAllEmployeesStore, getOneEmployeeFromLocal} from './employees-reselect';
import {SelectOptionsType} from '../../ui/common/form-selector/selector-utils';

type TransportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelTransportStore: TransportStoreSelectors<'label'> = ( state ) => state.transportStoreReducer.label
export const getMaskOnTransportStore: TransportStoreSelectors<'maskOn'> = ( state ) => state.transportStoreReducer.maskOn
export const getValidatorsTransportStore: TransportStoreSelectors<'validators'> = ( state ) => state.transportStoreReducer.validators
export const getParsersTransportStore: TransportStoreSelectors<'parsers'> = ( state ) => state.transportStoreReducer.parsers

export const getInitialValuesTransportStore: TransportStoreSelectors<'initialValues'> = ( state ) => state.transportStoreReducer.initialValues
export const getIsFetchingTransportStore: TransportStoreSelectors<'transportIsFetching'> = ( state ) => state.transportStoreReducer.transportIsFetching
export const getAllTransportStore: TransportStoreSelectors<'content'> = ( state ) => state.transportStoreReducer.content
export const getCurrentIdTransportStore: TransportStoreSelectors<'currentId'> = ( state ) => state.transportStoreReducer.currentId

// выборка искомого ТРАНСПОРТА из локально загруженного списка
export const getOneTransportFromLocal = createSelector(getCurrentIdTransportStore, getAllTransportStore, getInitialValuesTransportStore,
    ( currentId, transport, initials ): TransportCardType => {
        return transport.filter(( { idTransport } ) => idTransport === currentId)[0] || initials
    })

// список транспорта в селекторы
export const getAllTransportSelectFromLocal = createSelector(
    getAllTransportStore, getAllEmployeesStore, ( transports, employees ): SelectOptionsType[] =>
        transports
            .map(( { idTransport, transportTrademark, transportNumber, cargoWeight } ) => {
                    const employeesHasTransport = employees
                        .filter(( { idTransport: id } ) => id === idTransport)
                        .map(( { employeeFIO } ) => parseFamilyToFIO(employeeFIO))
                    const isEmployeesHasTransport = employeesHasTransport.length > 0
                    const subLabel = isEmployeesHasTransport ? employeesHasTransport.join(',') : undefined
                    const label = [ transportTrademark, transportNumber, '(' + cargoWeight ].join(', ') + 'т.)'
                    return ( {
                        key: idTransport,
                        value: idTransport,
                        label,
                        isDisabled: isEmployeesHasTransport,
                        subLabel,
                    } )
                },
            ),
)

// индикатор привязки данного ТРАНСПОРТА к сотруднику из списка для селектора по доп. признаку isDisabled
export const getIsBusyTransport = createSelector(getAllTransportSelectFromLocal, getCurrentIdTransportStore,
    ( list, currentId ): SelectOptionsType | undefined => list
        .find(( { key, isDisabled } ) => key === currentId && isDisabled),
)

// селектор для сотрудника с активным выбором его же ТРАНСПОРТА
export const getTransportSelectEnableCurrentEmployee = createSelector(getAllTransportSelectFromLocal, getOneEmployeeFromLocal,
    ( trailerSelect, oneEmployee ) => trailerSelect.map(values => ( {
        ...values,
        isDisabled: values.isDisabled && ( values.key !== oneEmployee.idTransport ),
    } )),
)