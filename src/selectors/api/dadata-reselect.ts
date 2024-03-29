import {AppStateType} from '../../redux/redux-store'
import {DaDataStoreReducerStateType} from '../../redux/api/dadata-response-reducer';
import {createSelector} from 'reselect';
import {SelectOptionsType} from '../../ui/common/inputs/final-form-inputs/form-selector/selector-utils';


type daDataStoreSelectors<T extends keyof Y, Y = DaDataStoreReducerStateType> = ( state: AppStateType ) => Y[T]

const getSuggestionsDaDataStore: daDataStoreSelectors<'suggestions'> = ( state ) => state.daDataStoreReducer.suggestions


export const getAllKPPSelectFromLocal = createSelector(
    getSuggestionsDaDataStore,
    ( kpp ): SelectOptionsType[] => kpp.map(( { data: { kpp = '_', inn }, value } ,index) => ( {
        key: kpp + inn,
        value: kpp,
        label: `${ kpp }  ${ value }`,
        isDefault: index === 0
    } )),
)
