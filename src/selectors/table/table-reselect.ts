import {AppStateType} from '../../redux/redux-store'
import {OneRequestTableType, TableStoreReducerStateType} from '../../redux/table/table-store-reducer'
import {createSelector} from 'reselect'
import {getAllRequestStore} from '../forms/request-form-reselect'
import {getAllConsigneesStore} from '../options/consignees-reselect'
import {getAllShippersStore} from '../options/shippers-reselect'
import {ddMmYearFormat} from '../../utils/date-formats';
import {getTarifsRequisitesStore} from '../options/requisites-reselect';


type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = ( state: AppStateType ) => Y[T]

// export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content
export const geInitialValuesTableStore: TableStoreSelectors<'initialValues'> = ( state ) => state.tableStoreReducer.initialValues


export const getContentTableStore = createSelector(
    getAllRequestStore,
    getAllConsigneesStore,
    getAllShippersStore,
    geInitialValuesTableStore,
    getTarifsRequisitesStore,
    ( requests, consignees, shippers, initial, { acceptShortRoute, acceptLongRoute } ): OneRequestTableType[] => {
        return requests.filter(( { visible } ) => visible).map((
            { requestNumber, shipmentDate, cargoType, idSender: shipper, idRecipient: consignee, distance, answers } ) =>
            ( {
                requestNumber,
                cargoType,
                shipmentDate: ddMmYearFormat(shipmentDate),
                distance,
                route: shippers.filter(( { idSender } ) => idSender === shipper)[0]?.city + ' в '
                    + ( consignees.filter(( { idRecipient } ) => idRecipient === consignee)[0]?.city ),
                answers: answers?.length || 0,
                // ставим цену в зависимости от расстояния
                price: ( distance || 0 ) > 100 ? +( acceptLongRoute || 0 ) : +( acceptShortRoute || 0 ),
            } )) || [ initial ]
    })
