import {AppStateType} from '../../redux/redux-store'
import {RequestStoreReducerStateType} from '../../redux/forms/request-store-reducer';
import {createSelector} from 'reselect';
import {OneRequestType} from '../../types/form-types';
import {polyline_decode} from '../../utils/polilyne-decode';
import {parseFamilyToFIO} from '../../utils/parsers';

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

        return {
            customerData: [
                customerUser?.organizationName,
                customerUser?.innNumber && 'ИНН ' + customerUser?.innNumber,
                customerUser?.legalAddress && 'Юр.Адрес: ' + customerUser?.legalAddress,
            ].filter(x => x) as string[],
            shipperSenderData: [
                senderUser?.organizationName || sender?.organizationName,
                senderInnNumber && 'ИНН ' + senderInnNumber,
                senderLegalAddress && 'Юр.Адрес: ' + senderLegalAddress,
            ].filter(x => x) as string[],
            cosigneeRecipientData: [
                recipientUser?.organizationName || recipient?.organizationName,
                recipientInn && 'ИНН ' + recipientInn,
                recipientLegalAddress && 'Юр.Адрес: ' + recipientLegalAddress,
            ].filter(x => x) as string[],
            acceptedCarrierData: [
                requestCarrierUser?.organizationName,
                requestCarrierUser?.innNumber && 'ИНН ' + requestCarrierUser?.innNumber,
                requestCarrierUser?.legalAddress && 'Юр.Адрес: ' + requestCarrierUser?.legalAddress,
            ].filter(x => x) as string[],
            acceptedEmployeeData: [
                parseFamilyToFIO(responseEmployee?.employeeFIO),
                responseTransport?.transportModel,
                responseTransport?.transportNumber,
                responseTrailer?.trailerModel,
                driverCanCargoWeight && +driverCanCargoWeight + ' тн',
            ].filter(x => x) as string[],
        }
    },
)