import {
    DocumentsRequestType,
} from './types/form-types'


export const cargoType = [ 'Бензовоз', 'Битумовоз', 'Газовоз', 'Изотерм', 'Контейнеровоз', 'Лесовоз', 'Самосвал',
    'Тягач', 'Фургон, Борт', 'Цементовоз' ]

export const cargoComposition = [
    'Мазут топочный М-100 ТУ2012-110712',
    'Битум нефтяной дорожный вязкий БНД 90/130',
    'Битум нефтяной дорожный вязкий БНД 100/130',
    'Битум нефтяной дорожный БНД 100/130',
    'Битум БНД 90/130 дорожный вязкий, в танк-контейнере',
    'Битум 90/130, фасованный в кловертейнеры',
    'Мазут топочный марки М-100 малозольный 0,5% серности',
    'Битум 100/130, фасованный в кловертейнеры',
]


// для обработки документов в заявке
export const initialDocumentsRequestValues: DocumentsRequestType = {

    proxyWay: {
        header: undefined,
        proxyFreightLoader: undefined,
        proxyDriver: undefined,
        waybillDriver: undefined,
    },

    cargoDocuments: undefined,

    ttnECP: {
        header: undefined,
        documentDownload: undefined,
        documentUpload: undefined,
        customerIsSubscribe: false,
        carrierIsSubscribe: false,
        consigneeIsSubscribe: false,
    },

    contractECP: {
        header: undefined,
        documentDownload: undefined,
        documentUpload: undefined,
        customerIsSubscribe: false,
        carrierIsSubscribe: false,
    },

    updECP: {
        header: undefined,
        documentDownload: undefined,
        documentUpload: undefined,
        customerIsSubscribe: false,
        carrierIsSubscribe: false,
    },

    customerToConsigneeContractECP: {
        header: undefined,
        documentDownload: undefined,
        documentUpload: undefined,
        customerIsSubscribe: false,
        consigneeIsSubscribe: false,
    },
}
