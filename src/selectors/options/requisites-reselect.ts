import {AppStateType} from '../../redux/redux-store'
import {RequisitesStoreReducerStateType} from '../../redux/options/requisites-store-reducer';
import {CompanyRequisitesType} from '../../types/form-types';
import {createSelector} from 'reselect';

type RequisitesStoreSelectors<T extends keyof Y, Y = RequisitesStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getIsFetchingRequisitesStore: RequisitesStoreSelectors<'isFetching'> = ( state ) => state.requisitesStoreReducer.isFetching

export const getLabelRequisitesStore: RequisitesStoreSelectors<'label'> = ( state ) => state.requisitesStoreReducer.label
export const getInitialValuesRequisitesStore: RequisitesStoreSelectors<'initialValues'> = ( state ) => state.requisitesStoreReducer.initialValues
export const getStoredValuesRequisitesStore: RequisitesStoreSelectors<'storedValues'> = ( state ) => state.requisitesStoreReducer.storedValues
export const getMaskOnRequisitesStore: RequisitesStoreSelectors<'maskOn'> = ( state ) => state.requisitesStoreReducer.maskOn
export const getValidatorsRequisitesStore: RequisitesStoreSelectors<'validators'> = ( state ) => state.requisitesStoreReducer.validators
export const getParsersRequisitesStore: RequisitesStoreSelectors<'parsers'> = ( state ) => state.requisitesStoreReducer.parsers
export const getIsReqErrorRequisitesStore: RequisitesStoreSelectors<'isRequisitesError'> = ( state ) => state.requisitesStoreReducer.isRequisitesError


// выгрузка тарифов из локальных данных пользователя
export const getTarifsRequisitesStore = createSelector(getStoredValuesRequisitesStore,
    ( requisites ): CompanyRequisitesType['tariffs'] => {
        return requisites.tariffs
    })
