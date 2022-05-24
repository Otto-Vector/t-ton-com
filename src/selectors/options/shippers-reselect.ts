import {AppStateType} from '../../redux/redux-store'
import {ShippersStoreReducerStateType} from '../../redux/options/shippers-store-reducer'
import {createSelector} from 'reselect';

type ShippersStoreSelectors<T extends keyof Y, Y = ShippersStoreReducerStateType> = (state: AppStateType) => Y[T]

export const getLabelShippersStore: ShippersStoreSelectors<'label'> = (state) => state.shippersStoreReducer.label
export const getInitialValuesShippersStore: ShippersStoreSelectors<'initialValues'> = (state) => state.shippersStoreReducer.initialValues
export const getMaskOnShippersStore: ShippersStoreSelectors<'maskOn'> = (state) => state.shippersStoreReducer.maskOn
export const getValidatorsShippersStore: ShippersStoreSelectors<'validators'> = (state) => state.shippersStoreReducer.validators
export const getAllShippersStore: ShippersStoreSelectors<'content'> = (state) => state.shippersStoreReducer.content
export const getCurrentIdShipperStore: ShippersStoreSelectors<'currentId'> = ( state) => state.shippersStoreReducer.currentId

// выборка из списка загруженных книг (пока отключил) - загружаю каждую книгу напрямую из API
export const getOneShipperFromLocal = createSelector( getCurrentIdShipperStore, getAllShippersStore,
    (currentId, shippers )  => {
        return shippers.filter( ( { id } ) => id === currentId )[0]
    } )
