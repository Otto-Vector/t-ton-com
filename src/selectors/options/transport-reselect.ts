import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'
import {TransportCardType} from '../../types/form-types';
import {createSelector} from 'reselect';

type TranstportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelTranstportStore: TranstportStoreSelectors<'label'> = (state) => state.transportStoreReducer.label
export const getInitialValuesTranstportStore: TranstportStoreSelectors<'initialValues'> = (state) => state.transportStoreReducer.initialValues
export const getMaskOnTranstportStore: TranstportStoreSelectors<'maskOn'> = (state) => state.transportStoreReducer.maskOn
export const getValidatorsTranstportStore: TranstportStoreSelectors<'validators'> = (state) => state.transportStoreReducer.validators
export const getAllTranstportStore: TranstportStoreSelectors<'content'> = (state) => state.transportStoreReducer.content
export const getCurrentIdTransportStore: TranstportStoreSelectors<'currentId'> = (state) => state.transportStoreReducer.currentId


export const getOneTransportFromLocal = createSelector( getCurrentIdTransportStore, getAllTranstportStore, getInitialValuesTranstportStore,
    (currentId, transport, initials ):  TransportCardType  => {
        return transport.filter( ( { id } ) => id === currentId )[0] || initials
    } )
