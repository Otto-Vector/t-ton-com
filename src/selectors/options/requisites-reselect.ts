import {AppStateType} from '../../redux/redux-store'
import {RequisitesStoreReducerStateType} from '../../redux/options/requisites-store-reducer';

type RequisitesStoreSelectors<T extends keyof Y, Y = RequisitesStoreReducerStateType> = ( state: AppStateType ) => Y[T]
type RequisitesStoreSelectorsInit<T extends keyof Y, Y = RequisitesStoreReducerStateType['storedValues']> = ( state: AppStateType ) => Y[T]

export const getIsFetchingRequisitesStore: RequisitesStoreSelectors<'isFetching'> = ( state ) => state.requisitesStoreReducer.isFetching

export const getLabelRequisitesStore: RequisitesStoreSelectors<'label'> = ( state ) => state.requisitesStoreReducer.label
export const getStoredValuesRequisitesStore: RequisitesStoreSelectors<'storedValues'> = ( state ) => state.requisitesStoreReducer.storedValues

export const getCashRequisitesStore: RequisitesStoreSelectorsInit<'cash'> = (state)=> state.requisitesStoreReducer.storedValues.cash
export const getTariffsRequisitesStore: RequisitesStoreSelectorsInit<'tariffs'>  = ( state ) => state.requisitesStoreReducer.storedValues.tariffs

export const getMaskOnRequisitesStore: RequisitesStoreSelectors<'maskOn'> = ( state ) => state.requisitesStoreReducer.maskOn
export const getValidatorsRequisitesStore: RequisitesStoreSelectors<'validators'> = ( state ) => state.requisitesStoreReducer.validators
export const getParsersRequisitesStore: RequisitesStoreSelectors<'parsers'> = ( state ) => state.requisitesStoreReducer.parsers
export const getIsReqErrorRequisitesStore: RequisitesStoreSelectors<'isRequisitesError'> = ( state ) => state.requisitesStoreReducer.isRequisitesError


