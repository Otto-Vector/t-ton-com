import {AppStateType} from '../../redux/redux-store'
import {ShippersStoreReducerStateType} from '../../redux/options/shippers-store-reducer'
import {createSelector} from 'reselect';
import {ShippersCardType} from '../../types/form-types';
import {SelectOptions} from '../../ui/common/form-selector/form-selector';

type ShippersStoreSelectors<T extends keyof Y, Y = ShippersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getLabelShippersStore: ShippersStoreSelectors<'label'> = ( state ) => state.shippersStoreReducer.label
export const getInitialValuesShippersStore: ShippersStoreSelectors<'initialValues'> = ( state ) => state.shippersStoreReducer.initialValues
export const getMaskOnShippersStore: ShippersStoreSelectors<'maskOn'> = ( state ) => state.shippersStoreReducer.maskOn
export const getValidatorsShippersStore: ShippersStoreSelectors<'validators'> = ( state ) => state.shippersStoreReducer.validators
export const getParsersShippersStore: ShippersStoreSelectors<'parsers'> = ( state ) => state.shippersStoreReducer.parsers

export const getAllShippersStore: ShippersStoreSelectors<'content'> = ( state ) => state.shippersStoreReducer.content
export const getCurrentIdShipperStore: ShippersStoreSelectors<'currentId'> = ( state ) => state.shippersStoreReducer.currentId

// выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
export const getOneShipperFromLocal = createSelector(
    getCurrentIdShipperStore,
    getAllShippersStore,
    getInitialValuesShippersStore,
    ( currentId, shippers, initials ): ShippersCardType => {
        return shippers.filter(( { id } ) => id === currentId)[0] || initials
    })

export const getAllShippersSelectFromLocal = createSelector(getAllShippersStore,
    ( shippers ): SelectOptions[] => shippers.map(( { id, title } ) =>
        ( { key: id.toString(), value: id.toString(), label: title || '' } )),
)