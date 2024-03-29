import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/request-form/request-store-reducer'
import {createSelector} from 'reselect'
import {polyline_decode} from '../../utils/map-utils'
import {boldWrapper} from '../../utils/html-rebuilds'
import {toNumber} from '../../utils/parsers'
import { ResponseToRequestCardType } from '../../types/form-types'

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

// данные в модальное окно калькуляции при нажатии "груз у водителя"
export const getInitialDataToModalCalcRequestStore = createSelector(getInitialValuesRequestStore, (
        { distance, cargoWeight, responsePrice, responseStavka, responseTransport, responseTrailer } ) => ( {
        distance: toNumber(distance),
        cargoWeight: toNumber(cargoWeight),
        responsePrice: toNumber(responsePrice),
        responseStavka: toNumber(responseStavka),
        driverCanCargoWeight: toNumber(responseTransport?.cargoWeight) + toNumber(responseTrailer?.cargoWeight),
    } ),
)

// декодированный путь для отрисовки на карте заявки
export const getRoutesParsedFromPolylineRequestStore = createSelector(getPolylineRouteRequestStore,
    ( polyline ): number[][] | undefined => polyline ? polyline_decode(polyline) : undefined)

// информация, подготовленная для отображения в информационных полях первой вкладки
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
        const driverCanCargoWeight = toNumber(responseTransport?.cargoWeight) + toNumber(responseTrailer?.cargoWeight)

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
                sender?.phisicalAddress && boldWrapper('Адрес отправления: ') + sender.phisicalAddress,
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
                recipient?.phisicalAddress && boldWrapper('Адрес прибытия: ') + recipient.phisicalAddress,
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

// данные об ответе на заявку, взятые из самой заявки
export const getResponseDataFromRequestStore = createSelector(getInitialValuesRequestStore,
    (currentOneRequest): ResponseToRequestCardType<string>=>({
        responseTax: currentOneRequest.responseTax + '',
        requestNumber: currentOneRequest.requestNumber + '',
        cargoWeight: currentOneRequest.cargoWeight + '',
        idEmployee: currentOneRequest.idEmployee + '',
        idTrailer: currentOneRequest.idTrailer + '',
        responseId: '0',
        idTransport: currentOneRequest.idTransport + '',
        responsePrice: currentOneRequest.responsePrice + '',
        responseStavka: currentOneRequest.responseStavka + '',
        requestCarrierId: currentOneRequest.requestCarrierId + '',
        responseCreateTime: ''
    }))
