import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer'
import {createSelector} from 'reselect'
import {polyline_decode} from '../../utils/map-utils'
import {boldWrapper} from '../../utils/html-rebuilds'

type RequestStoreSelectors<T extends keyof Y, Y = RequestStoreReducerStateType> = ( state: AppStateType ) => Y[T]
type RequestStoreSelectorsInit<T extends keyof Y, Y = RequestStoreReducerStateType['initialValues']> = ( state: AppStateType ) => Y[T]

export const getIsFetchingRequestStore: RequestStoreSelectors<'requestIsFetching'> = ( state ) => state.requestStoreReducer.requestIsFetching
export const getInitialValuesRequestStore: RequestStoreSelectors<'initialValues'> = ( state ) => state.requestStoreReducer.initialValues
export const getLabelDocumentsRequestValuesStore: RequestStoreSelectors<'labelDocumentsRequestValues'> = ( state ) => state.requestStoreReducer.labelDocumentsRequestValues
export const getInfoTextModalsRequestValuesStore: RequestStoreSelectors<'infoTextModals'> = ( state ) => state.requestStoreReducer.infoTextModals

export const getLabelRequestStore: RequestStoreSelectors<'label'> = ( state ) => state.requestStoreReducer.label
export const getPlaceholderRequestStore: RequestStoreSelectors<'placeholder'> = ( state ) => state.requestStoreReducer.placeholder
export const getValidatorsRequestStore: RequestStoreSelectors<'validators'> = ( state ) => state.requestStoreReducer.validators

export const getAllByDateRequestStore: RequestStoreSelectors<'contentByDate'> = ( state ) => state.requestStoreReducer.contentByDate
export const getAllByUserRequestStore: RequestStoreSelectors<'contentByUser'> = ( state ) => state.requestStoreReducer.contentByUser
export const getCurrentDistanceIsFetchingRequestStore: RequestStoreSelectors<'currentDistanceIsFetching'> = ( state ) => state.requestStoreReducer.currentDistanceIsFetching
export const getPolylineRouteRequestStore: RequestStoreSelectorsInit<'route'> = ( state: AppStateType ) => state.requestStoreReducer.initialValues.route

// дистанция. пока непонятно почему в селекторе, но лучше оставлю
export const getInitialDistanceRequestStore = createSelector(getInitialValuesRequestStore, ( { distance } ) => distance)
// export const getInitialCargoWeightRequestStore = createSelector(getInitialValuesRequestStore, ( { cargoWeight } ) => cargoWeight)
// export const getInitialAddedPriceRequestStore = createSelector(getInitialValuesRequestStore, ( { addedPrice } ) => addedPrice)
// export const getInitialStavkaRequestStore = createSelector(getInitialValuesRequestStore, ( { responseStavka } ) => responseStavka)

export const getInitialDataToModalCalcRequestStore = createSelector(getInitialValuesRequestStore, (
        { distance, cargoWeight, responsePrice, responseStavka, responseTransport, responseTrailer } ) => ( {
        distance: +( distance || 0 ),
        cargoWeight: +( cargoWeight || 0 ),
        responsePrice: +( responsePrice || 0 ),
        responseStavka: +( responseStavka || 0 ),
        driverCanCargoWeight: ( +( responseTransport?.cargoWeight || 0 ) + ( +( responseTrailer?.cargoWeight || 0 ) ) ),
    } ),
)

// декодированный путь для отрисовки на карте заявки
export const getRoutesParsedFromPolylineRequestStore = createSelector(getPolylineRouteRequestStore,
    ( polyline ): number[][] | undefined => polyline ? polyline_decode(polyline) : undefined)

// информация, подготовленная для отображения в информационных полях
export const getPreparedInfoDataRequestStore = createSelector(getInitialValuesRequestStore,
    ( {
          customerUser,
          senderUser,
          sender,
          recipientUser,
          recipient,
          responseEmployee,
          responseTransport,
          responseTrailer,
          requestCarrierUser,
      } ) => {

        const senderInnNumber = ( senderUser?.innNumber || sender?.innNumber )
        const senderLegalAddress = ( senderUser?.legalAddress || sender?.address )
        const recipientInn = ( recipientUser?.innNumber || recipient?.innNumber )
        const recipientLegalAddress = ( recipientUser?.legalAddress || recipient?.address )
        const driverCanCargoWeight = ( +( responseTransport?.cargoWeight || 0 ) + ( +( responseTrailer?.cargoWeight || 0 ) ) )

        const returnObject = {
            /* ЗАКАЗЧИК */
            customerData: [
                customerUser?.organizationName,
                customerUser?.innNumber && boldWrapper('ИНН: ') + customerUser.innNumber,
                customerUser?.legalAddress && boldWrapper('Юр.Адрес: ') + customerUser.legalAddress,
            ],
            customerPhoneData: [
                customerUser?.phoneDirector && boldWrapper('Телефон директора: ') + customerUser.phoneDirector,
                customerUser?.phoneAccountant && boldWrapper('Телефон бухгалтера: ') + customerUser.phoneAccountant,
                customerUser?.description && boldWrapper('Телефон сотрудника: ') + customerUser.description,
            ],
            /* ГРУЗООТПРАВИТЕЛЬ */
            shipperSenderData: [
                senderUser?.organizationName || sender?.organizationName,
                senderInnNumber && boldWrapper('ИНН: ') + senderInnNumber,
                senderLegalAddress && boldWrapper('Юр.Адрес: ') + senderLegalAddress,
                sender?.description && boldWrapper('Адрес отправления: ') + sender.description,
            ],
            shipperSenderPhoneData: [
                senderUser?.phoneDirector && boldWrapper('Телефон директора: ') + senderUser.phoneDirector,
                senderUser?.phoneAccountant && boldWrapper('Телефон бухгалтера: ') + senderUser.phoneAccountant,
                sender?.shipperTel && boldWrapper('Телефон сотрудника: ') + sender.shipperTel,
            ],
            /* ГРУЗОПОЛУЧАТЕЛЬ */
            consigneeRecipientData: [
                recipientUser?.organizationName || recipient?.organizationName,
                recipientInn && boldWrapper('ИНН: ') + recipientInn,
                recipientLegalAddress && boldWrapper('Юр.Адрес: ') + recipientLegalAddress,
                recipient?.description && boldWrapper('Адрес прибытия: ') + recipient.description,
            ],
            consigneeRecipientPhoneData: [
                recipientUser?.phoneDirector && boldWrapper('Телефон директора: ') + recipientUser.phoneDirector,
                recipientUser?.phoneAccountant && boldWrapper('Телефон бухгалтера: ') + recipientUser.phoneAccountant,
                recipient?.consigneesTel && boldWrapper('Телефон сотрудника: ') + recipient.consigneesTel,
            ],
            /* АКЦЕПТИРОВАННЫЙ ПЕРЕВОЗЧИК */
            acceptedCarrierData: [
                requestCarrierUser?.organizationName,
                requestCarrierUser?.innNumber && boldWrapper('ИНН: ') + requestCarrierUser?.innNumber,
                requestCarrierUser?.legalAddress && boldWrapper('Юр.Адрес: ') + requestCarrierUser?.legalAddress,
            ],
            acceptedCarrierPhoneData: [
                requestCarrierUser?.phoneDirector && boldWrapper('Телефон директора: ') + requestCarrierUser.phoneDirector,
                requestCarrierUser?.phoneAccountant && boldWrapper('Телефон бухгалтера: ') + requestCarrierUser.phoneAccountant,
                requestCarrierUser?.description && boldWrapper('Телефон сотрудника: ') + requestCarrierUser.description,
            ],
            /* ВОДИТЕЛЬ */
            acceptedEmployeeData: [
                responseEmployee?.employeeFIO && boldWrapper('ФИО водителя: ') + responseEmployee.employeeFIO,
                responseTransport?.transportModel && boldWrapper('Модель транспорта: ') + responseTransport.transportModel,
                responseTransport?.transportNumber && boldWrapper('Номер транспорта: ') + responseTransport.transportNumber,
                responseTrailer?.trailerModel && boldWrapper('Модель прицепа: ') + responseTrailer.trailerModel,
                driverCanCargoWeight && boldWrapper('Может перевезти: ') + driverCanCargoWeight + ' тн',
            ],
            acceptedEmployeePhoneData: [
                responseEmployee?.employeeFIO && boldWrapper('ФИО водителя: ') + responseEmployee.employeeFIO,
                responseEmployee?.employeePhoneNumber && boldWrapper('Телефон: ') + responseEmployee.employeePhoneNumber,
            ],
        }

        // создаёт новый объект из старого после обработки значений ключа
        return Object.fromEntries(Object.entries(returnObject)
            // чистим пустые строки массивов
            .map(n => [ n[0], n[1].filter(x => x) as string[] ])) as { [key in keyof typeof returnObject]: string[] }
    },
)
