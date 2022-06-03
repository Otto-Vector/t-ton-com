import {AppStateType} from '../../redux/redux-store'
import {ConsigneesStoreReducerStateType} from '../../redux/options/consignees-store-reducer'
import {ConsigneesCardType} from '../../types/form-types';
import {createSelector} from 'reselect';

type ConsigneesStoreSelectors<T extends keyof Y, Y = ConsigneesStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelConsigneesStore: ConsigneesStoreSelectors<'label'> = (state) => state.consigneesStoreReducer.label
export const getInitialValuesConsigneesStore: ConsigneesStoreSelectors<'initialValues'> = (state) => state.consigneesStoreReducer.initialValues
export const getMaskOnConsigneesStore: ConsigneesStoreSelectors<'maskOn'> = (state) => state.consigneesStoreReducer.maskOn
export const getValidatorsConsigneesStore: ConsigneesStoreSelectors<'validators'> = (state) => state.consigneesStoreReducer.validators
export const getAllConsigneesStore: ConsigneesStoreSelectors<'content'> = (state) => state.consigneesStoreReducer.content
export const getCurrentIdConsigneeStore: ConsigneesStoreSelectors<'currentId'> = (state) => state.consigneesStoreReducer.currentId


export const getOneConsigneesFromLocal = createSelector( getCurrentIdConsigneeStore, getAllConsigneesStore, getInitialValuesConsigneesStore,
    (currentId, consignees, initials ):  ConsigneesCardType  => {
        return consignees.filter( ( { id } ) => id === currentId )[0] || initials
    } )
