import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'
import {TransportCardType} from '../../types/form-types';
import {createSelector} from 'reselect';

type TransportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = ( state: AppStateType) => Y[T]

export const getLabelTransportStore: TransportStoreSelectors<'label'> = ( state) => state.transportStoreReducer.label
export const getMaskOnTransportStore: TransportStoreSelectors<'maskOn'> = ( state) => state.transportStoreReducer.maskOn
export const getValidatorsTransportStore: TransportStoreSelectors<'validators'> = ( state) => state.transportStoreReducer.validators
export const getParsersTransportStore: TransportStoreSelectors<'parsers'> = ( state) => state.transportStoreReducer.parsers

export const getInitialValuesTransportStore: TransportStoreSelectors<'initialValues'> = ( state) => state.transportStoreReducer.initialValues
export const getAllTransportStore: TransportStoreSelectors<'content'> = ( state) => state.transportStoreReducer.content
export const getCurrentIdTransportStore: TransportStoreSelectors<'currentId'> = ( state) => state.transportStoreReducer.currentId


export const getOneTransportFromLocal = createSelector( getCurrentIdTransportStore, getAllTransportStore, getInitialValuesTransportStore,
    (currentId, transport, initials ):  TransportCardType  => {
        return transport.filter( ( { id } ) => id === currentId )[0] || initials
    } )
