import {AppStateType} from '../../redux/redux-store'
import {ConsigneesStoreReducerStateType} from '../../redux/options/consignees-store-reducer'
import {ConsigneesCardType} from '../../types/form-types';
import {createSelector} from 'reselect';
import {SelectOptionsType} from '../../ui/common/form-selector/selector-utils';


type ConsigneesStoreSelectors<T extends keyof Y, Y = ConsigneesStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getInitialValuesConsigneesStore: ConsigneesStoreSelectors<'initialValues'> = ( state ) => state.consigneesStoreReducer.initialValues
export const getIsFetchingConsigneesStore: ConsigneesStoreSelectors<'consigneeIsFetching'> = ( state ) => state.consigneesStoreReducer.consigneeIsFetching

export const getLabelConsigneesStore: ConsigneesStoreSelectors<'label'> = ( state ) => state.consigneesStoreReducer.label
export const getMaskOnConsigneesStore: ConsigneesStoreSelectors<'maskOn'> = ( state ) => state.consigneesStoreReducer.maskOn
export const getValidatorsConsigneesStore: ConsigneesStoreSelectors<'validators'> = ( state ) => state.consigneesStoreReducer.validators
export const getParsersConsigneesStore: ConsigneesStoreSelectors<'parsers'> = ( state ) => state.consigneesStoreReducer.parsers

export const getAllConsigneesStore: ConsigneesStoreSelectors<'content'> = ( state ) => state.consigneesStoreReducer.content
export const getCurrentIdConsigneeStore: ConsigneesStoreSelectors<'currentId'> = ( state ) => state.consigneesStoreReducer.currentId


export const getOneConsigneesFromLocal = createSelector(
    getCurrentIdConsigneeStore,
    getAllConsigneesStore,
    getInitialValuesConsigneesStore,
    ( currentId, consignees, initials ): ConsigneesCardType => {
        return consignees.filter(( { idRecipient } ) => idRecipient === currentId)[0] || initials
    })

export const getAllConsigneesSelectFromLocal = createSelector(getAllConsigneesStore,
    ( consignees ): SelectOptionsType[] => consignees.map(( { idRecipient, title, city } ) =>
        ( { key: idRecipient + '', value: idRecipient + '', label: title || '', subLabel: city } )),
)