import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer';
import {createSelector} from 'reselect';
import {OneRequestType} from '../../types/form-types';

type RequestStoreSelectors<T extends keyof Y, Y = RequestStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getCargoCompositionRequestStore: RequestStoreSelectors<'cargoComposition'> = ( state ) => state.requestStoreReducer.cargoComposition
export const getInitialValuesRequestStore: RequestStoreSelectors<'initialValues'> = ( state ) => state.requestStoreReducer.initialValues
export const getInitialDocumentsRequestValuesStore: RequestStoreSelectors<'initialDocumentsRequestValues'> = ( state ) => state.requestStoreReducer.initialDocumentsRequestValues
export const getDefaultInitialValuesRequestStore: RequestStoreSelectors<'defaultInitialStateValues'> = ( state ) => state.requestStoreReducer.defaultInitialStateValues
export const getLabelDocumentsRequestValuesStore: RequestStoreSelectors<'labelDocumentsRequestValues'> = ( state ) => state.requestStoreReducer.labelDocumentsRequestValues
export const getInfoTextModalsRequestValuesStore: RequestStoreSelectors<'infoTextModals'> = ( state ) => state.requestStoreReducer.infoTextModals

export const getLabelRequestStore: RequestStoreSelectors<'label'> = ( state ) => state.requestStoreReducer.label
export const getPlaceholderRequestStore: RequestStoreSelectors<'placeholder'> = ( state ) => state.requestStoreReducer.placeholder
export const getValidatorsRequestStore: RequestStoreSelectors<'validators'> = ( state ) => state.requestStoreReducer.validators

export const getAllRequestStore: RequestStoreSelectors<'content'> = ( state ) => state.requestStoreReducer.content
export const getCurrentDistanceRequestStore: RequestStoreSelectors<'currentDistance'> = ( state ) => state.requestStoreReducer.currentDistance
export const getCurrentDistanceIsFetchingRequestStore: RequestStoreSelectors<'currentDistanceIsFetching'> = ( state ) => state.requestStoreReducer.currentDistanceIsFetching
export const getRouteRequestStore: RequestStoreSelectors<'currentRoute'> = ( state ) => state.requestStoreReducer.currentRoute
export const getIsNewRequestRequestStore: RequestStoreSelectors<'isNewRequest'> = ( state ) => state.requestStoreReducer.isNewRequest
export const getCurrentRequestNumberStore: RequestStoreSelectors<'currentRequestNumber'> = ( state ) => state.requestStoreReducer.currentRequestNumber

export const getInitialDistanceRequestStore = createSelector(getInitialValuesRequestStore, ( { distance } ) => distance)

export const getOneRequestStore = createSelector(getAllRequestStore, getCurrentRequestNumberStore,
    ( content, numberValue ): OneRequestType => {
        return content?.filter(( { requestNumber } ) => requestNumber === numberValue)[0]
    })
