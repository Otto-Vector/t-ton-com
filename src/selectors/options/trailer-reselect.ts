import {AppStateType} from '../../redux/redux-store'
import {TrailerStoreReducerStateType} from '../../redux/options/trailer-store-reducer'
import {createSelector} from 'reselect';
import {TrailerCardType} from '../../types/form-types';
import {SelectOptions} from '../../ui/common/form-selector/form-selector';

type TrailerStoreSelectors<T extends keyof Y, Y = TrailerStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelTrailerStore: TrailerStoreSelectors<'label'> = ( state ) => state.trailerStoreReducer.label
export const getMaskOnTrailerStore: TrailerStoreSelectors<'maskOn'> = ( state ) => state.trailerStoreReducer.maskOn
export const getValidatorsTrailerStore: TrailerStoreSelectors<'validators'> = ( state ) => state.trailerStoreReducer.validators
export const getParsersTrailerStore: TrailerStoreSelectors<'parsers'> = ( state ) => state.trailerStoreReducer.parsers

export const getInitialValuesTrailerStore: TrailerStoreSelectors<'initialValues'> = ( state ) => state.trailerStoreReducer.initialValues
export const getAllTrailerStore: TrailerStoreSelectors<'content'> = ( state ) => state.trailerStoreReducer.content
export const getCurrentIdTrailerStore: TrailerStoreSelectors<'currentId'> = ( state ) => state.trailerStoreReducer.currentId


export const getOneTrailerFromLocal = createSelector(getCurrentIdTrailerStore, getAllTrailerStore, getInitialValuesTrailerStore,
    ( currentId, trailer, initials ): TrailerCardType => {
        return trailer.filter(( { id } ) => id === currentId)[0] || initials
    })

export const getAllTrailerSelectFromLocal = createSelector(getAllTrailerStore, ( trailer ): SelectOptions[] =>
    trailer
        .map(( { id, trailerTrademark, trailerNumber, cargoWeight } ) =>
            ( {
                key: id.toString(),
                value: id.toString(),
                label: [ trailerTrademark, trailerNumber, cargoWeight ].join(', ') + 'т.',
            } )),
)