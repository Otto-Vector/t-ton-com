import {AppStateType} from '../../redux/redux-store'
import {OneRequestTableType, TableStoreReducerStateType} from '../../redux/table/table-store-reducer'
import {createSelector} from 'reselect'
import {getAllRequestStore} from '../forms/request-form-reselect'
import {getAllConsigneesStore} from '../options/consignees-reselect'
import {getAllShippersStore} from '../options/shippers-reselect'

type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = ( state: AppStateType ) => Y[T]

// export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content
export const geInitialValuesTableStore: TableStoreSelectors<'initialValues'> = ( state ) => state.tableStoreReducer.initialValues


export const getContentTableStore = createSelector(getAllRequestStore, getAllConsigneesStore, getAllShippersStore, geInitialValuesTableStore,
    ( requests, consignees, shippers, initial ): OneRequestTableType[] => {
        return requests.filter(( { visible } ) => visible).map((
            { requestNumber, shipmentDate, cargoType, shipper, consignee, distance, answers } ) =>
            ( {
                requestNumber, cargoType, shipmentDate, distance,
                answers: answers?.length, price: 100,
                route: shippers.filter(( { id } ) => id === shipper)[0]?.city + ' в '
                    + ( consignees.filter(( { id } ) => id === consignee)[0]?.city ),
            } )) || [ initial ]
    })
