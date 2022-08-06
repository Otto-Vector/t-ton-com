import {AppStateType} from '../../redux/redux-store'
import {TransportStoreReducerStateType} from '../../redux/options/transport-store-reducer'
import {TransportCardType} from '../../types/form-types';
import {createSelector} from 'reselect';
import {SelectOptions} from '../../ui/common/form-selector/form-selector';

type TransportStoreSelectors<T extends keyof Y, Y = TransportStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelTransportStore: TransportStoreSelectors<'label'> = ( state ) => state.transportStoreReducer.label
export const getMaskOnTransportStore: TransportStoreSelectors<'maskOn'> = ( state ) => state.transportStoreReducer.maskOn
export const getValidatorsTransportStore: TransportStoreSelectors<'validators'> = ( state ) => state.transportStoreReducer.validators
export const getParsersTransportStore: TransportStoreSelectors<'parsers'> = ( state ) => state.transportStoreReducer.parsers

export const getInitialValuesTransportStore: TransportStoreSelectors<'initialValues'> = ( state ) => state.transportStoreReducer.initialValues
export const getIsFetchingTransportStore: TransportStoreSelectors<'transportIsFetchig'> = ( state ) => state.transportStoreReducer.transportIsFetchig
export const getAllTransportStore: TransportStoreSelectors<'content'> = ( state ) => state.transportStoreReducer.content
export const getCurrentIdTransportStore: TransportStoreSelectors<'currentId'> = ( state ) => state.transportStoreReducer.currentId


export const getOneTransportFromLocal = createSelector(getCurrentIdTransportStore, getAllTransportStore, getInitialValuesTransportStore,
    ( currentId, transport, initials ): TransportCardType => {
        return transport.filter(( { idTransport } ) => idTransport === currentId)[0] || initials
    })

export const getAllTransportSelectFromLocal = createSelector(getAllTransportStore, ( transport ): SelectOptions[] =>
    transport
        .map(( { idTransport, transportTrademark, transportNumber, cargoWeight } ) =>
            ( {
                key: idTransport,
                value: idTransport,
                label: [ transportTrademark, transportNumber, cargoWeight ].join(', ') + 'т.',
            } )),
)