import {AppStateType} from '../../redux/redux-store'
import {DaDataStoreReducerStateType} from '../../redux/api/dadata-response-reducer';
import {SelectOptionsType} from '../../ui/common/form-selector/form-selector';
import {createSelector} from 'reselect';


type AuthStoreSelectors<T extends keyof Y, Y = DaDataStoreReducerStateType> = ( state: AppStateType ) => Y[T]

const getSuggestionsDaDataStore: AuthStoreSelectors<'suggestions'> = ( state ) => state.daDataStoreReducer.suggestions


export const getAllKPPSelectFromLocal = createSelector(
    getSuggestionsDaDataStore,
    ( kpp ): SelectOptionsType[] => kpp.map(( { data: { kpp='-',inn }, value } ) => ( {
        key: kpp+inn,
        value: kpp,
        label: `${ kpp }  ${ value }`,
    } )),
)