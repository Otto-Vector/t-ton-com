import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer';
import {createSelector} from 'reselect';
import {OneRequestType} from '../../types/form-types';
import {polyline_decode} from '../../utils/polilyne-decode';

type RequestStoreSelectors<T extends keyof Y, Y = RequestStoreReducerStateType> = ( state: AppStateType ) => Y[T]
type RequestStoreSelectorsInit<T extends keyof Y, Y = RequestStoreReducerStateType['initialValues']> = ( state: AppStateType ) => Y[T]

export const getIsFetchingRequestStore: RequestStoreSelectors<'requestIsFetching'> = ( state ) => state.requestStoreReducer.requestIsFetching
export const getInitialValuesRequestStore: RequestStoreSelectors<'initialValues'> = ( state ) => state.requestStoreReducer.initialValues
export const getInitialDocumentsRequestValuesStore: RequestStoreSelectors<'initialDocumentsRequestValues'> = ( state ) => state.requestStoreReducer.initialDocumentsRequestValues
export const getLabelDocumentsRequestValuesStore: RequestStoreSelectors<'labelDocumentsRequestValues'> = ( state ) => state.requestStoreReducer.labelDocumentsRequestValues
export const getInfoTextModalsRequestValuesStore: RequestStoreSelectors<'infoTextModals'> = ( state ) => state.requestStoreReducer.infoTextModals

export const getLabelRequestStore: RequestStoreSelectors<'label'> = ( state ) => state.requestStoreReducer.label
export const getPlaceholderRequestStore: RequestStoreSelectors<'placeholder'> = ( state ) => state.requestStoreReducer.placeholder
export const getValidatorsRequestStore: RequestStoreSelectors<'validators'> = ( state ) => state.requestStoreReducer.validators

export const getAllRequestStore: RequestStoreSelectors<'content'> = ( state ) => state.requestStoreReducer.content
export const getCurrentDistanceIsFetchingRequestStore: RequestStoreSelectors<'currentDistanceIsFetching'> = ( state ) => state.requestStoreReducer.currentDistanceIsFetching
export const getPolylineRouteRequestStore: RequestStoreSelectorsInit<'route'> = ( state: AppStateType ) => state.requestStoreReducer.initialValues.route
export const getCurrentRequestNumberStore: RequestStoreSelectors<'currentRequestNumber'> = ( state ) => state.requestStoreReducer.currentRequestNumber

// дистанция. пока непонятно почему в селекторе, но лучше оставлю
export const getInitialDistanceRequestStore = createSelector(getInitialValuesRequestStore, ( { distance } ) => distance)

// забираем данные о конкретной заявке из загруженного списка заявок
export const getOneRequestStore = createSelector(getAllRequestStore, getCurrentRequestNumberStore,
    ( content, numberValue ): OneRequestType => {
        return content?.filter(( { requestNumber } ) => requestNumber === numberValue)[0]
    })

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


        // создаёт новый объект из старого после обработки значений ключа
        return Object.fromEntries(Object
            .entries({
                /* ЗАКАЗЧИК */
                customerData: [
                    customerUser?.organizationName,
                    customerUser?.innNumber && 'ИНН: ' + customerUser.innNumber,
                    customerUser?.legalAddress && 'Юр.Адрес: ' + customerUser.legalAddress,
                ],
                customerPhoneData: [
                    customerUser?.phoneDirector && 'Телефон директора: ' + customerUser.phoneDirector,
                    customerUser?.phoneAccountant && 'Телефон бухгалтера: ' + customerUser.phoneAccountant,
                    customerUser?.description && 'Телефон сотрудника: ' + customerUser.description,
                ],
                /* ГРУЗООТПРАВИТЕЛЬ */
                shipperSenderData: [
                    senderUser?.organizationName || sender?.organizationName,
                    senderInnNumber && 'ИНН: ' + senderInnNumber,
                    senderLegalAddress && 'Юр.Адрес: ' + senderLegalAddress,
                    sender?.description && 'Адрес отправления: ' + sender.description,
                ],
                shipperSenderPhoneData: [
                    senderUser?.phoneDirector && 'Телефон директора: ' + senderUser.phoneDirector,
                    senderUser?.phoneAccountant && 'Телефон бухгалтера: ' + senderUser.phoneAccountant,
                    sender?.shipperTel && 'Телефон сотрудника: ' + sender.shipperTel,
                ],
                /* ГРУЗОПОЛУЧАТЕЛЬ */
                consigneeRecipientData: [
                    recipientUser?.organizationName || recipient?.organizationName,
                    recipientInn && 'ИНН: ' + recipientInn,
                    recipientLegalAddress && 'Юр.Адрес: ' + recipientLegalAddress,
                    recipient?.description && 'Адрес прибытия: ' + recipient.description,
                ],
                consigneeRecipientPhoneData: [
                    recipientUser?.phoneDirector && 'Телефон директора: ' + recipientUser.phoneDirector,
                    recipientUser?.phoneAccountant && 'Телефон бухгалтера: ' + recipientUser.phoneAccountant,
                    recipient?.consigneesTel && 'Телефон сотрудника: ' + recipient.consigneesTel,
                ],
                /* АКЦЕПТИРОВАННЫЙ ПЕРЕВОЗЧИК */
                acceptedCarrierData: [
                    requestCarrierUser?.organizationName,
                    requestCarrierUser?.innNumber && 'ИНН: ' + requestCarrierUser?.innNumber,
                    requestCarrierUser?.legalAddress && 'Юр.Адрес: ' + requestCarrierUser?.legalAddress,
                ],
                acceptedCarrierPhoneData: [
                    requestCarrierUser?.phoneDirector && 'Телефон директора: ' + requestCarrierUser.phoneDirector,
                    requestCarrierUser?.phoneAccountant && 'Телефон бухгалтера: ' + requestCarrierUser.phoneAccountant,
                    requestCarrierUser?.description && 'Телефон сотрудника: ' + requestCarrierUser.description,
                ],
                /* ВОДИТЕЛЬ */
                acceptedEmployeeData: [
                    responseEmployee?.employeeFIO && 'ФИО водителя: ' + responseEmployee.employeeFIO,
                    responseTransport?.transportModel && 'Модель транспорта: ' + responseTransport.transportModel,
                    responseTransport?.transportNumber && 'Номер транспорта: ' + responseTransport.transportNumber,
                    responseTrailer?.trailerModel && 'Модель прицепа: ' + responseTrailer.trailerModel,
                    driverCanCargoWeight && 'Может перевезти: ' + driverCanCargoWeight + ' тн',
                ],
                acceptedEmployeePhoneData: [
                    responseEmployee?.employeeFIO && 'ФИО: ' + responseEmployee.employeeFIO,
                    responseEmployee?.employeePhoneNumber && 'Телефон: ' + responseEmployee.employeePhoneNumber,
                ],
            })
            // чистим пустые строки массивов
            .map(n => [ n[0], n[1].filter(x => x) as string[] ]))
    },
)