import {AppStateType} from '../../redux/redux-store'
import {ShippersStoreReducerStateType} from '../../redux/options/shippers-store-reducer'
import {createSelector} from 'reselect';
import {ShippersCardType} from '../../types/form-types';
import {SelectOptionsType} from '../../ui/common/inputs/final-form-inputs/form-selector/selector-utils';


type ShippersStoreSelectors<T extends keyof Y, Y = ShippersStoreReducerStateType> = ( state: AppStateType ) => Y[T]

export const getInitialValuesShippersStore: ShippersStoreSelectors<'initialValues'> = ( state ) => state.shippersStoreReducer.initialValues
export const getIsFetchingShippersStore: ShippersStoreSelectors<'shippersIsFetching'> = ( state ) => state.shippersStoreReducer.shippersIsFetching

export const getLabelShippersStore: ShippersStoreSelectors<'label'> = ( state ) => state.shippersStoreReducer.label
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
        return shippers.filter(( { idSender } ) => idSender === currentId)[0] || initials
    })

// все грузоотправители в формате "для селектора"
export const getAllShippersSelectFromLocal = createSelector(getAllShippersStore,
    ( shippers ): SelectOptionsType[] => shippers.map(( { idSender, title, city, innNumber } ) =>
        ( { key: idSender + '', value: idSender + '', label: title + '' , subLabel: city, extendInfo: innNumber} )),
)
