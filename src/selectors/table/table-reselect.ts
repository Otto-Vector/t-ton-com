import {AppStateType} from '../../redux/redux-store'
import {TableStoreReducerStateType} from '../../redux/table/table-store-reducer'
import {createSelector} from 'reselect'
import {getAllByDateRequestStore, getAllByUserRequestStore} from '../forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getTariffsRequisitesStore} from '../options/requisites-reselect'
import {OneRequestTableType, OneRequestType} from '../../types/form-types'
import {parseFamilyToFIO} from '../../utils/parsers'
import {getAuthIdAuthStore} from '../auth-reselect'


type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = ( state: AppStateType ) => Y[T]

// export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content
export const geInitialValuesTableStore: TableStoreSelectors<'initialValues'> = ( state ) => state.tableStoreReducer.initialValues

// парсинг заявки в таблицу
const parseRequestToTable = ( {
                                  acceptLongRoute,
                                  acceptShortRoute,
                                  authId,
                              }: { acceptLongRoute?: number, acceptShortRoute?: number, authId: string } ) => (
    {
        requestNumber,
        shipmentDate,
        cargoType,
        idUserCustomer,
        idUserRecipient,
        idUserSender,
        requestUserCarrierId,
        sender: { city: cityShipper },
        recipient: { city: cityConsignee },
        distance,
        answers,
        globalStatus,
        responseEmployee,
        acceptedUsers,
        localStatus: { cargoHasBeenTransferred, cargoHasBeenReceived },
    }: OneRequestType ): OneRequestTableType =>
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
        localStatus: globalStatus === 'в работе' ? ( cargoHasBeenReceived ? 'груз у получателя'
                : ( cargoHasBeenTransferred ? 'груз у водителя' : 'водитель выбран' ) )
            : globalStatus === 'новая заявка' ? ( !answers?.length ? 'нет ответов' : 'есть ответы' ) : '',
        responseEmployee: parseFamilyToFIO(responseEmployee?.employeeFIO) || answers?.length + '' || '0',
        // Отмечаем причастных к заявкам
        marked: [ idUserCustomer, idUserRecipient, idUserSender, requestUserCarrierId ].includes(authId) || ( acceptedUsers?.includes(authId) ),
    } )

// для реализации контента по списку заявок из разных источников
export const getContentTableStore = ( getContent: ( state: AppStateType ) => OneRequestType[] ) => createSelector(
    getContent,
    geInitialValuesTableStore,
    getTariffsRequisitesStore,
    getAuthIdAuthStore,
    ( requests, initial, { acceptShortRoute, acceptLongRoute }, authId ): OneRequestTableType[] => requests
            .filter(( { visible } ) => visible)
            .map(parseRequestToTable({ acceptLongRoute, acceptShortRoute, authId }))
        || [ initial ],
)


// адаптация заявок в таблицу (список на ответы)
export const getContentByDateTableStore = getContentTableStore(getAllByDateRequestStore)

// адаптация заявок в таблицу (список своих заявок || список истории)
export const getContentByUserTableStore = getContentTableStore(getAllByUserRequestStore)

export const getContentTableStoreNew = createSelector(getContentByDateTableStore,
    ( requests ) => requests.filter(( { globalStatus } ) => globalStatus === 'новая заявка'))

export const getContentTableStoreInWork = createSelector(getContentByUserTableStore,
    ( requests ) => requests.filter(( {
                                          marked,
                                          globalStatus,
                                      } ) => marked && globalStatus && globalStatus !== 'завершена')
        .map(( request ) => ( { ...request, marked: request.globalStatus === 'в работе' } )),
)

export const getContentTableStoreInHistory = createSelector(getContentByUserTableStore,
    ( requests ) => requests.filter(( { globalStatus, marked } ) => globalStatus === 'завершена' && marked))
