import {AppStateType} from '../../redux/redux-store'
import {TableStoreReducerStateType} from '../../redux/table/table-store-reducer'
import {createSelector} from 'reselect'
import {getAllByDateRequestStore, getAllByUserRequestStore} from '../forms/request-form-reselect'
import {ddMmYearFormat} from '../../utils/date-formats'
import {getTariffsRequisitesStore} from '../options/requisites-reselect'
import {OneRequestTableType, OneRequestType, TableLocalStatus} from '../../types/form-types'
import {parseFamilyToFIO, toNumber} from '../../utils/parsers'
import {getAuthIdAuthStore, getInitialValuesAuthStore} from '../auth-reselect'


type TableStoreSelectors<T extends keyof Y, Y = TableStoreReducerStateType> = ( state: AppStateType ) => Y[T]

// export const getContentTableStore: TableStoreSelectors<'content'> = (state) => state.tableStoreReducer.content
export const getInitialValuesTableStore: TableStoreSelectors<'initialValues'> = ( state ) => state.tableStoreReducer.initialValues
export const getFilteredRowsCountTableStore: TableStoreSelectors<'filteredRowsCount'> = ( state ) => state.tableStoreReducer.filteredRowsCount

// присвоение статуса в таблицу
const requestStatusToTableStatus = ( {
                                         globalStatus,
                                         localStatus: { cargoHasBeenTransferred, cargoHasBeenReceived },
                                         answers,
                                     }: Pick<OneRequestType, 'globalStatus' | 'localStatus' | 'answers'>,
): TableLocalStatus =>
    globalStatus === 'в работе'
        ? (
            cargoHasBeenReceived
                ? 'груз у получателя'
                : (
                    cargoHasBeenTransferred
                        ? 'груз у водителя'
                        : 'водитель выбран'
                )
        )
        : globalStatus === 'новая заявка'
            ? (
                !answers?.length
                    ? 'нет ответов'
                    : 'есть ответы'
            )
            : ''

// парсинг заявки в таблицу
const parseRequestToTable = ( {
                                  acceptLongRoute,
                                  acceptShortRoute,
                                  authId,
                              }: { acceptLongRoute?: number, acceptShortRoute?: number, authId: string },
) => (
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
        responseEmployee,
        acceptedUsers,
        globalStatus,
        localStatus,
        roleStatus,
    }: OneRequestType ): OneRequestTableType => {

    const globalStatusNormal = globalStatus || 'отменена'
    const markedNormal = globalStatusNormal !== 'отменена'
        ? ( [ idUserCustomer, idUserRecipient, idUserSender, requestUserCarrierId ].includes(authId)
            || !!acceptedUsers?.includes(authId) )
        : false

    return {
        requestNumber,
        cargoType: cargoType + '',
        shipmentDate: ddMmYearFormat(shipmentDate) + '',
        distance: toNumber(distance),
        route: cityShipper + ' в ' + cityConsignee,
        answers: toNumber(answers?.length),
        // ставим цену в зависимости от расстояния
        price: toNumber(distance) > 100 ? toNumber(acceptLongRoute) : toNumber(acceptShortRoute),
        globalStatus: globalStatusNormal,
        localStatus: requestStatusToTableStatus({ globalStatus, localStatus, answers }),
        responseEmployee: parseFamilyToFIO(responseEmployee?.employeeFIO) || answers?.length + '' || '0',
        // Отмечаем причастных к заявкам
        marked: markedNormal,
        roleStatus,
    }
}

// для реализации контента по списку заявок из разных источников
export const getContentTableStore = ( getContent: ( state: AppStateType ) => OneRequestType[] ) => createSelector(
    getContent,
    getInitialValuesTableStore,
    getTariffsRequisitesStore,
    getAuthIdAuthStore,
    getInitialValuesAuthStore,
    ( requests, initial, {
        acceptShortRoute,
        acceptLongRoute,
    }, authId, { innNumber } ): OneRequestTableType[] => requests
            .filter(( { visible } ) => visible)
            .map(parseRequestToTable({ acceptLongRoute, acceptShortRoute, authId }))
        || [ initial ],
)


// адаптация заявок в таблицу (список на ответы)
export const getContentByDateTableStore = getContentTableStore(getAllByDateRequestStore)

// адаптация заявок в таблицу (список своих заявок || список истории)
export const getContentByUserTableStore = getContentTableStore(getAllByUserRequestStore)

export const getContentTableStoreNew = createSelector(getContentByDateTableStore,
    ( requests ): OneRequestTableType[] => requests.filter(( { globalStatus } ) => globalStatus === 'новая заявка'))

export const getContentTableStoreInWork = createSelector(getContentByUserTableStore,
    ( requests ): OneRequestTableType[] => requests.filter(( {
                                                                 marked,
                                                                 globalStatus,
                                                             } ) => marked && globalStatus && globalStatus !== 'завершена')
        .map(( { globalStatus, ...request } ) => ( {
            ...request, globalStatus,
            marked: globalStatus === 'в работе',
        } )),
)

export const getContentTableStoreInHistory = createSelector(getContentByUserTableStore,
    ( requests ): OneRequestTableType[] => requests.filter(( {
                                                                 globalStatus,
                                                                 marked,
                                                             } ) => globalStatus === 'завершена' && marked))
