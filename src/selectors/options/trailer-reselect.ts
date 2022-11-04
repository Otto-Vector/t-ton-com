import {AppStateType} from '../../redux/redux-store'
import {TrailerStoreReducerStateType} from '../../redux/options/trailer-store-reducer'
import {createSelector} from 'reselect';
import {TrailerCardType} from '../../types/form-types';
import {getAllEmployeesStore} from './employees-reselect';
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


export const getOneTrailerFromLocal = createSelector(getCurrentIdTrailerStore, getAllTrailerStore, getInitialValuesTrailerStore,
    ( currentId, trailer, initials ): TrailerCardType => {
        return trailer.filter(( { idTrailer } ) => idTrailer === currentId)[0] || initials
    })

export const getAllTrailerSelectFromLocal = createSelector(
    getAllTrailerStore, getAllEmployeesStore, ( trailers, employees ): SelectOptionsType[] =>
        trailers
            .map(( { idTrailer, trailerTrademark, trailerNumber, cargoWeight } ) => {
                    const employeesHasTrailer = employees
                        .filter(( { idTrailer: id } ) => id === idTrailer)
                        .map(( { employeeFIO } ) => parseFamilyToFIO(employeeFIO))
                    const isEmployeesHasTrailer = employeesHasTrailer.length > 0
                    const subLabel = [ ...employeesHasTrailer ].join(',')
                    const label = [ trailerTrademark, trailerNumber, cargoWeight ].join(', ') + 'т.' + subLabel
                    return ( {
                        key: idTrailer,
                        value: idTrailer,
                        label,
                        isDisabled: isEmployeesHasTrailer,
                        subLabel,
                    } )
                },
            ),
)
