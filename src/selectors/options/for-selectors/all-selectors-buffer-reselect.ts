
/*////////////////CЕЛЕКТОРЫ СОТРУДНИКОВ//////////////////////////////////////////////*/
// все сотрудники в селектор с доп. данными о типе груза
import {getAllTrailerStore, getCurrentIdTrailerStore} from '../trailer-reselect';
import {getAllTransportStore, getCurrentIdTransportStore} from '../transport-reselect';
import {getAllEmployeesStore, getOneEmployeeFromLocal} from '../employees-reselect';
import {createSelector} from 'reselect';
import {getInitialValuesRequestStore} from '../../forms/request-form-reselect';
import {parseFamilyToFIO} from '../../../utils/parsers';
import {SelectOptionsType} from '../../../ui/common/inputs/final-form-inputs/form-selector/selector-utils';

export const getAllEmployeesSelectWithCargoType = createSelector(
    getAllEmployeesStore,
    getAllTransportStore,
    getAllTrailerStore,
    ( employees, transports, trailers ): SelectOptionsType[] => employees
        .map(( { idEmployee, idTransport, idTrailer, employeeFIO, status } ) => {
                const currentTransport = transports.find(v => v.idTransport === idTransport)
                const transportCargoType = currentTransport?.cargoType || 'без транспорта'
                const transportTrailerCargoType = transportCargoType !== 'Тягач' ? transportCargoType
                    : trailers.find(v => v.idTrailer === idTrailer)?.cargoType || transportCargoType
                const subLabelTransport = currentTransport
                    ? currentTransport?.transportTrademark + ', ' + ( transportTrailerCargoType.toUpperCase() )
                    : transportTrailerCargoType
                const busyStatus = status === 'на заявке' && 'на другой заявке'
                return ( {
                    key: idEmployee,
                    value: idEmployee,
                    label: parseFamilyToFIO(employeeFIO),
                    subLabel: busyStatus || subLabelTransport,
                    isDisabled: !currentTransport?.idTransport || !transportTrailerCargoType,
                    extendInfo: busyStatus || transportTrailerCargoType,
                } )
            },
        ),
)

/*////////////////CЕЛЕКТОРЫ ПРИЦЕПОВ//////////////////////////////////////////////*/
// все сотрудники в селектор с доп. данными о типе груза и отключенным выбором неверного типа груза
export const getAllEmployeesSelectWithCargoTypeDisabledWrongCargo = createSelector(
    getAllEmployeesSelectWithCargoType,
    getInitialValuesRequestStore,
    ( employees, { cargoType } ): SelectOptionsType[] => employees.map(( val ) => ( {
        ...val,
        isDisabled: val.isDisabled || val.extendInfo !== cargoType,
    } )),
)

// список ПРИЦЕПОВ в селекторы
export const getAllTrailerSelectFromLocal = createSelector(
    getAllTrailerStore, getAllEmployeesStore, ( trailers, employees ): SelectOptionsType[] =>
        trailers
            .map(( { idTrailer, trailerTrademark, trailerNumber, cargoWeight, cargoType } ) => {
                    const employeesHasTrailer = employees
                        .filter(( { idTrailer: id } ) => id === idTrailer)
                        .map(( { employeeFIO } ) => parseFamilyToFIO(employeeFIO))
                        .join(',')
                    return ( {
                        key: idTrailer,
                        value: idTrailer,
                        label: [ trailerTrademark, trailerNumber, '(' + cargoWeight ].join(', ') + 'т.)',
                        isDisabled: !!employeesHasTrailer.length,
                        subLabel: employeesHasTrailer,
                        extendInfo: cargoType,
                    } )
                },
            ),
)

// индикатор привязки данного ПРИЦЕПА к сотруднику из списка для селектора по доп. признаку isDisabled
export const getIsBusyTrailer = createSelector(getAllTrailerSelectFromLocal, getCurrentIdTrailerStore,
    ( list, currentId ): SelectOptionsType | undefined => list
        .find(( { key, isDisabled } ) => key === currentId && isDisabled),
)

// селектор для сотрудника с активным выбором его же ПРИЦЕПА
export const getTrailerSelectEnableCurrentEmployee = createSelector(getAllTrailerSelectFromLocal, getOneEmployeeFromLocal,
    ( trailerSelect, oneEmployee ) => trailerSelect.map(values => ( {
        ...values,
        isDisabled: values.isDisabled && ( values.key !== oneEmployee.idTrailer ),
    } )),
)

export const getTrailerSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel = createSelector(getTrailerSelectEnableCurrentEmployee,
    ( trailerSelect ): SelectOptionsType[] => trailerSelect.map(( values ) => ( {
        ...values,
        subLabel: !values.isDisabled ? values.extendInfo?.toUpperCase() : values.subLabel,
    } )))


/*////////////////CЕЛЕКТОРЫ ТРАНСПОРТА//////////////////////////////////////////////*/
// список транспорта в селекторы
export const getAllTransportSelectFromLocal = createSelector(
    getAllTransportStore, getAllEmployeesStore, ( transports, employees ): SelectOptionsType[] =>
        transports
            .map(( { idTransport, transportTrademark, transportNumber, cargoWeight, cargoType } ) => {
                    const employeesHasTransport = employees
                        .filter(( { idTransport: id } ) => id === idTransport)
                        .map(( { employeeFIO } ) => parseFamilyToFIO(employeeFIO))
                        .join(',')
                    return ( {
                        key: idTransport,
                        value: idTransport,
                        label: [ transportTrademark, transportNumber, '(' + cargoWeight + 'т.)' ].join(', '),
                        isDisabled: !!employeesHasTransport,
                        subLabel: employeesHasTransport,
                        extendInfo: cargoType,
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
    ( trailerSelect, oneEmployee ): SelectOptionsType[] => trailerSelect.map(values => ( {
        ...values,
        isDisabled: values.isDisabled && ( values.value !== oneEmployee.idTransport ),
    } )),
)

export const getTransportSelectEnableCurrentEmployeeWithCargoTypeOnSubLabel = createSelector(getTransportSelectEnableCurrentEmployee,
    ( transportSelect ): SelectOptionsType[] => transportSelect.map(( values ) => ( {
            ...values,
            subLabel: !values.isDisabled ? values.extendInfo?.toUpperCase() : values.subLabel,
        }
    )))
