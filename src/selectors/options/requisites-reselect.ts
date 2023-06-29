import {AppStateType} from '../../redux/redux-store'
import {RequisitesStoreReducerStateType} from '../../redux/options/requisites-store-reducer';
import {createSelector} from 'reselect';
import {CompanyRequisitesType} from '../../types/form-types';
import {getTariffsBaseStore} from '../base-reselect';

type RequisitesStoreSelectors<T extends keyof Y, Y = RequisitesStoreReducerStateType> = ( state: AppStateType ) => Y[T]
type RequisitesStoreSelectorsInit<T extends keyof Y, Y = RequisitesStoreReducerStateType['storedValues']> = ( state: AppStateType ) => Y[T]

export const getIsFetchingRequisitesStore: RequisitesStoreSelectors<'isFetching'> = ( state ) => state.requisitesStoreReducer.isFetching

export const getLabelRequisitesStore: RequisitesStoreSelectors<'label'> = ( state ) => state.requisitesStoreReducer.label
export const getStoredValuesRequisitesStore: RequisitesStoreSelectors<'storedValues'> = ( state ) => state.requisitesStoreReducer.storedValues

export const getCashRequisitesStore: RequisitesStoreSelectorsInit<'cash'> = ( state ) => state.requisitesStoreReducer.storedValues.cash
export const getTariffsCurrentRequisitesStore: RequisitesStoreSelectorsInit<'tariffs'> = ( state ) => state.requisitesStoreReducer.storedValues.tariffs

export const getMaskOnRequisitesStore: RequisitesStoreSelectors<'maskOn'> = ( state ) => state.requisitesStoreReducer.maskOn
export const getValidatorsRequisitesStore: RequisitesStoreSelectors<'validators'> = ( state ) => state.requisitesStoreReducer.validators
export const getParsersRequisitesStore: RequisitesStoreSelectors<'parsers'> = ( state ) => state.requisitesStoreReducer.parsers
export const getIsReqErrorRequisitesStore: RequisitesStoreSelectors<'isRequisitesError'> = ( state ) => state.requisitesStoreReducer.isRequisitesError


export const getTariffsRequisitesStore = createSelector(getTariffsCurrentRequisitesStore, getTariffsBaseStore,
    ( currentTarifs, globalTarifs ): CompanyRequisitesType['tariffs'] => ( {
        create: ( currentTarifs?.create || -1 ) < 0 ? globalTarifs?.create : currentTarifs?.create,
        acceptShortRoute: ( currentTarifs?.acceptShortRoute || -1 ) < 0 ? globalTarifs?.acceptShortRoute : currentTarifs?.acceptShortRoute,
        acceptLongRoute: ( currentTarifs?.acceptLongRoute || -1 ) < 0 ? globalTarifs?.acceptLongRoute : currentTarifs?.acceptLongRoute,
        paySafeTax: ( currentTarifs?.paySafeTax || -1 ) < 0 ? globalTarifs?.paySafeTax : currentTarifs?.paySafeTax,

    } ),
)
