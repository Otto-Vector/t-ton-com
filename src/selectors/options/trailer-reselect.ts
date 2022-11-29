import {AppStateType} from '../../redux/redux-store'
import {TrailerStoreReducerStateType} from '../../redux/options/trailer-store-reducer'
import {createSelector} from 'reselect';
import {TrailerCardType} from '../../types/form-types';
import {getAllEmployeesStore, getOneEmployeeFromLocal} from './employees-reselect';
import {parseFamilyToFIO} from '../../utils/parsers';
import {SelectOptionsType} from '../../ui/common/form-selector/selector-utils';

type TrailerStoreSelectors<T extends keyof Y, Y = TrailerStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelTrailerStore: TrailerStoreSelectors<'label'> = ( state ) => state.trailerStoreReducer.label
export const getMaskOnTrailerStore: TrailerStoreSelectors<'maskOn'> = ( state ) => state.trailerStoreReducer.maskOn
export const getValidatorsTrailerStore: TrailerStoreSelectors<'validators'> = ( state ) => state.trailerStoreReducer.validators
export const getParsersTrailerStore: TrailerStoreSelectors<'parsers'> = ( state ) => state.trailerStoreReducer.parsers

export const getInitialValuesTrailerStore: TrailerStoreSelectors<'initialValues'> = ( state ) => state.trailerStoreReducer.initialValues
export const getIsFetchingTrailerStore: TrailerStoreSelectors<'trailerIsFetching'> = ( state ) => state.trailerStoreReducer.trailerIsFetching
export const getAllTrailerStore: TrailerStoreSelectors<'content'> = ( state ) => state.trailerStoreReducer.content
export const getCurrentIdTrailerStore: TrailerStoreSelectors<'currentId'> = ( state ) => state.trailerStoreReducer.currentId

// выборка искомого ПРИЦЕПА из локально загруженного списка
export const getOneTrailerFromLocal = createSelector(getCurrentIdTrailerStore, getAllTrailerStore, getInitialValuesTrailerStore,
    ( currentId, trailer, initials ): TrailerCardType => {
        return trailer.filter(( { idTrailer } ) => idTrailer === currentId)[0] || initials
    })

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