import {AppStateType} from '../../redux/redux-store'
import {OneRequestType, RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer';
import {createSelector} from 'reselect';

type RequestStoreSelectors<T extends keyof Y, Y = RequestStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getCargoСompositionRequestStore: RequestStoreSelectors<'cargoComposition'> = (state) => state.requestStoreReducer.cargoComposition
export const getInitialValuesRequestStore: RequestStoreSelectors<'initialValues'> = (state) => state.requestStoreReducer.initialValues
export const getLabelRequestStore: RequestStoreSelectors<'label'> = ( state) => state.requestStoreReducer.label
export const getPlaceholderRequestStore: RequestStoreSelectors<'placeholder'> = ( state) => state.requestStoreReducer.placeholder
export const getValidatorsRequestStore: RequestStoreSelectors<'validators'> = ( state) => state.requestStoreReducer.validators
export const getAllRequestStore: RequestStoreSelectors<'content'> = ( state) => state.requestStoreReducer.content
const getCurrentRequestNumberStore: RequestStoreSelectors<'currentRequestNumber'> = ( state) => state.requestStoreReducer.currentRequestNumber



export const getOneRequestStore = createSelector( getAllRequestStore, getCurrentRequestNumberStore, getInitialValuesRequestStore,
    ( content, numberValue, initial ): OneRequestType => {
        return content?.filter( ( {requestNumber} ) => requestNumber === numberValue )[0] || initial
    } )
