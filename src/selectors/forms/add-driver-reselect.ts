import {AppStateType} from '../../redux/redux-store'
import {AddDriverStoreReducerStateType} from '../../redux/forms/add-driver-store-reducer';

type AddDriverStoreSelectors<T extends keyof Y, Y = AddDriverStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelAddDriverStore: AddDriverStoreSelectors<'label'> = ( state ) => state.addDriverStoreReducer.label
export const getPlaceholderAddDriverStore: AddDriverStoreSelectors<'placeholder'> = ( state ) => state.addDriverStoreReducer.placeholder
export const getInitialValuesAddDriverStore: AddDriverStoreSelectors<'initialValues'> = ( state ) => state.addDriverStoreReducer.initialValues
export const getValidatorsAddDriverStore: AddDriverStoreSelectors<'validators'> = ( state ) => state.addDriverStoreReducer.validators
