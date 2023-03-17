import {AppStateType} from '../../redux/redux-store'
import {TableStoreReducerStateType} from '../../redux/table/table-store-reducer'
import {createSelector} from 'reselect'
import {getAllRequestStore} from '../forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getTariffsRequisitesStore} from '../options/requisites-reselect'
import {OneRequestTableType} from '../../types/form-types'
import {parseFamilyToFIO} from '../../utils/parsers'
import {getAuthIdAuthStore} from '../auth-reselect'


type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = ( state: AppStateType ) => Y[T]

// export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content
export const geInitialValuesTableStore: TableStoreSelectors<'initialValues'> = ( state ) => state.tableStoreReducer.initialValues


export const getContentTableStore = createSelector(
    getAllRequestStore,
    geInitialValuesTableStore,
    getTariffsRequisitesStore,
    getAuthIdAuthStore,
    ( requests, initial, { acceptShortRoute, acceptLongRoute }, authId ): OneRequestTableType[] => {
        return requests.filter(( { visible } ) => visible).map((
            {
                requestNumber,
                shipmentDate,
                cargoType,
                idUserCustomer,
                idUserRecipient,
                idUserSender,
                sender: { city: cityShipper },
                recipient: { city: cityConsignee },
                distance,
                answers,
                globalStatus,
                responseEmployee,
            } ) =>
            ( {
                requestNumber,
                cargoType,
                shipmentDate: ddMmYearFormat(shipmentDate),
                distance,
                route: cityShipper + ' в ' + cityConsignee,
                answers: answers?.length || 0,
                // ставим цену в зависимости от расстояния
                price: ( distance || 0 ) > 100 ? +( acceptLongRoute || 0 ) : +( acceptShortRoute || 0 ),
                globalStatus,
                responseEmployee: parseFamilyToFIO(responseEmployee?.employeeFIO) || answers?.length+'' || '0',
                marked: [ idUserCustomer, idUserRecipient, idUserSender ].includes(authId),
            } )) || [ initial ]
    })

export const getContentTableStoreNew = createSelector(getContentTableStore,
    ( requests ) => requests.filter(( { globalStatus } ) => globalStatus === 'новая заявка'))

export const getContentTableStoreInWork = createSelector(getContentTableStore,
    ( requests ) => requests.filter(( { marked, globalStatus } ) => marked && globalStatus)
        .map(( request ) => ( { ...request, marked: request.globalStatus === 'в работе' } )),
)

export const getContentTableStoreInHistory = createSelector(getContentTableStore,
    ( requests ) => requests.filter(( { globalStatus, marked } ) => globalStatus === 'завершена' && marked))
