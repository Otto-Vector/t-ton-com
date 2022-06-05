import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'
import {TransportCardType} from '../../types/form-types';
import {createSelector} from 'reselect';

type TranstportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelTransportStore: TranstportStoreSelectors<'label'> = ( state) => state.transportStoreReducer.label
export const getInitialValuesTransportStore: TranstportStoreSelectors<'initialValues'> = ( state) => state.transportStoreReducer.initialValues
export const getMaskOnTransportStore: TranstportStoreSelectors<'maskOn'> = ( state) => state.transportStoreReducer.maskOn
export const getValidatorsTransportStore: TranstportStoreSelectors<'validators'> = ( state) => state.transportStoreReducer.validators
export const getAllTransportStore: TranstportStoreSelectors<'content'> = ( state) => state.transportStoreReducer.content
export const getCurrentIdTransportStore: TranstportStoreSelectors<'currentId'> = (state) => state.transportStoreReducer.currentId


export const getOneTransportFromLocal = createSelector( getCurrentIdTransportStore, getAllTransportStore, getInitialValuesTransportStore,
    (currentId, transport, initials ):  TransportCardType  => {
        return transport.filter( ( { id } ) => id === currentId )[0] || initials
    } )
