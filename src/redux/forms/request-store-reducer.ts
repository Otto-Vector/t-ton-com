import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {cargoType, CargoType, ValidateType} from '../../types/form-types'
import {randArrayValue, randFloorMax, randMinMax, randomDifferentIntegersArrayCreator} from '../../utils/random-utils'
import {composeValidators, required} from '../../utils/validators';


export type OneRequestType = {
    id: number | undefined,
    requestNumber: number | undefined, // номер заявки
    requestDate: undefined | Date, // дата создания заявки
    cargoComposition: undefined | string, // вид груза
    shipmentDate: undefined | Date, // дата погрузки
    cargoType: undefined | CargoType, // тип груза
    customer: undefined | number, // заказчик
    shipper: undefined | number, // грузоотправитель
    consignee: undefined | number, // грузополучатель
    carrier: undefined | number, // перевозчик
    driver: undefined | number, // водитель
    distance: undefined | number, // расстояние
    note: undefined | string, // примечание
    answers: number[] | undefined // количество ответов от водителей // что-то вроде массива с айдишками
    driverPrice: number | undefined // стоимость перевозки
    documents: DocumentsRequestType
}

export type DocumentsRequestType = {
    proxyWay: {
        label: string | undefined // Транспортные документы Сторон
        proxyFreightLoader: boolean | string // Доверенность Грузовладельцу
        proxyDriver: boolean | string // Доверенность на Водителя
        waybillDriver: boolean | string // Путевой Лист Водителя
    },
    uploadTime: Date | undefined | string // Время погрузки
    cargoWeight: number | string // Вес груза, в тн.
    cargoDocuments: string | undefined // Документы груза
    cargoPrice: number | string // Цена по Заявке
    addedPrice: number | string // Доп. Услуги
    finalPrice: number | string // Итоговая Цена
    ttnECP: {
        label: string | undefined // ТТН или ЭТрН с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        consignee: boolean | string // Грузополучатель
    },
    contractECP: {
        label: string | undefined // Договор оказания транспортных услуг с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        uploadDocument: string | undefined // Загрузить
    },
    updECP: {
        label: string | undefined // УПД от Перевозчика для Заказчика с ЭЦП
        customer: boolean | string // Заказчик
        carrier: boolean | string // Перевозчик
        uploadDocument: string | undefined // Загрузить
    },
    customerToConsigneeContractECP: {
        label: string | undefined // Документы от Заказчика для Получателя с ЭЦП
        customer: boolean | string // Заказчик
        consignee: boolean | string // Грузополучатель
        uploadDocument: string | undefined // Загрузить
    },
    paymentHasBeenTransferred: string | undefined // Оплату передал
    paymentHasBeenReceived: boolean | string // Оплату получил
    completeRequest: boolean | string // Закрыть заявку
}

const cargoComposition = [
    'Мазут топочный М-100 ТУ2012-110712',
    'Битум нефтяной дорожный вязкий БНД 90/130',
    'Битум нефтяной дорожный вязкий БНД 100/130',
    'Битум нефтяной дорожный БНД 100/130',
    'Битум БНД 90/130 дорожный вязкий, в танк-контейнере',
    'Битум 90/130, фасованный в кловертейнеры',
    'Мазут топочный марки М-100 малозольный 0,5% серности',
    'Битум 90/130, фасованный в кловертейнеры',
]

const initialDocumentsRequestValues: DocumentsRequestType = {
    proxyWay: {
        label: undefined,
        proxyFreightLoader: false,
        proxyDriver: false,
        waybillDriver: false,
    },
    uploadTime: undefined,
    cargoWeight: 0,
    cargoDocuments: undefined,
    cargoPrice: 0,
    addedPrice: 0,
    finalPrice: 0,
    ttnECP: {
        label: undefined,
        customer: false,
        carrier: false,
        consignee: false,
    },
    contractECP: {
        label: undefined,
        customer: false,
        carrier: false,
        uploadDocument: undefined,
    },
    updECP: {
        label: undefined,
        customer: false,
        carrier: false,
        uploadDocument: undefined,
    },
    customerToConsigneeContractECP: {
        label: undefined,
        customer: false,
        consignee: false,
        uploadDocument: undefined,
    },
    paymentHasBeenTransferred: undefined,
    paymentHasBeenReceived: false,
    completeRequest: false,
}

const makeOneTestRequest = ( id: number ): OneRequestType => ( {
    id: id,
    requestNumber: id,
    requestDate: new Date(2022, 5, randFloorMax(30)),
    cargoComposition: randArrayValue(cargoComposition),
    shipmentDate: id === 999 ? new Date() : new Date(2022, 6, randFloorMax(30)),
    cargoType: randArrayValue(cargoType) as CargoType,
    customer: randFloorMax(9),
    shipper: randFloorMax(11),
    consignee: randMinMax(12, 23),
    carrier: randFloorMax(9),
    driver: randFloorMax(9),
    distance: randFloorMax(1200),
    note: 'Насос на 120, рукава, ДОПОГ.',
    answers: randomDifferentIntegersArrayCreator(randFloorMax(9))(),
    driverPrice: undefined,
    documents: initialDocumentsRequestValues,
} )

const makeNTestRequests = ( count: number ): OneRequestType[] => [ 999, ...randomDifferentIntegersArrayCreator(998)(count) ]
    .map(( id ) => makeOneTestRequest(id))

const initialState = {

    cargoComposition: cargoComposition,
    currentRequestNumber: undefined as undefined | number,

    label: {
        id: undefined,
        requestNumber: 'Номер заявки',
        requestDate: 'Дата создания заявки',
        cargoComposition: 'Вид груза',
        shipmentDate: 'Дата погрузки',
        distance: 'Расстояние, км.',
        cargoType: 'Тип груза',
        customer: 'Заказчик',
        shipper: 'Грузоотправитель',
        consignee: 'Грузополучатель',
        carrier: 'Перевозчик',
        driver: 'Водитель',
        note: 'Примечание',
    } as Record<keyof OneRequestType, string | undefined>,

    placeholder: {
        id: undefined,
        requestNumber: '№',
        requestDate: 'ДД-ММ-ГГГГ',
        cargoComposition: 'Полное наименование груза',
        shipmentDate: 'ДД-ММ-ГГГГ',
        distance: 'авто-расчет',
        cargoType: 'Тип груза',
        customer: 'Наименование организации заказчика',
        shipper: 'Наименование организации Владельца груза',
        consignee: 'Наименование организации Грузополучателя',
        carrier: 'Наименование организации Перевозчика',
        driver: 'ФИО, Марка авто, Марка прицепа, тн',
        note: 'дополнительные данные',
    } as Record<keyof OneRequestType, string | undefined>,

    validators: {
        id: undefined,
        requestNumber: undefined,
        requestDate: composeValidators(required),
        cargoComposition: composeValidators(required),
        shipmentDate: composeValidators(required),
        distance: undefined,
        cargoType: composeValidators(required),
        customer: composeValidators(required),
        shipper: composeValidators(required),
        consignee: composeValidators(required),
        carrier: undefined,
        driver: undefined,
        note: undefined,
    } as Record<keyof OneRequestType, ValidateType>,

    initialValues: {
        id: 0,
        requestNumber: undefined,
        requestDate: undefined,
        cargoComposition: undefined,
        shipmentDate: undefined,
        cargoType: undefined,
        customer: undefined,
        distance: undefined,
        shipper: undefined,
        consignee: undefined,
        carrier: undefined,
        driver: undefined,
        note: undefined,
    } as OneRequestType,

    content: makeNTestRequests(50) as OneRequestType[] | undefined, // создаём тестовые заявки

    labelDocumentsRequestValues: {
        proxyWay: {
            label: 'Транспортные документы Сторон',
            proxyFreightLoader: 'Доверенность Грузовладельцу',
            proxyDriver: 'Доверенность на Водителя',
            waybillDriver: 'Путевой Лист Водителя',
        },
        uploadTime: 'Время погрузки',
        cargoWeight: 'Вес груза, в тн.',
        cargoDocuments: 'Документы груза',
        cargoPrice: 'Цена по Заявке',
        addedPrice: 'Доп. Услуги',
        finalPrice: 'Итоговая Цена',
        ttnECP: {
            label: 'ТТН или ЭТрН с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            consignee: 'Грузополучатель',
        },
        contractECP: {
            label: 'Договор оказания транспортных услуг с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            uploadDocument: 'Загрузить',
        },
        updECP: {
            label: 'УПД от Перевозчика для Заказчика с ЭЦП',
            customer: 'Заказчик',
            carrier: 'Перевозчик',
            uploadDocument: 'Загрузить',
        },
        customerToConsigneeContractECP: {
            label: 'Документы от Заказчика для Получателя с ЭЦП',
            customer: 'Заказчик',
            consignee: 'Грузополучатель',
            uploadDocument: 'Загрузить',
        },
        paymentHasBeenTransferred: 'Оплату передал',
        paymentHasBeenReceived: 'Оплату получил',
        completeRequest: 'Закрыть заявку',
    } as DocumentsRequestType,

    initialDocumentsRequestValues: initialDocumentsRequestValues,
}

export type RequestStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof requestStoreActions>

export const requestStoreReducer = ( state = initialState, action: ActionsType ): RequestStoreReducerStateType => {

    switch (action.type) {

        case 'request-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'request-store-reducer/SET-CONTENT': {
            return {
                ...state,
                content: action.content,
            }
        }
        case 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW': {
            return {
                ...state,
                currentRequestNumber: action.currentRequestNumber,
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const requestStoreActions = {
    setInitialValues: ( initialValues: RequestStoreReducerStateType['initialValues'] ) => ( {
        type: 'request-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setContent: ( content: OneRequestType[] ) => ( {
        type: 'request-store-reducer/SET-CONTENT',
        content,
    } as const ),
    setRequestNumber: ( currentRequestNumber: number | undefined ) => ( {
        type: 'request-store-reducer/SET-REQUEST-NUMBER-TO-VIEW',
        currentRequestNumber,
    } as const ),
}

/* САНКИ */

export type RequestStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): BaseStoreReducerThunkActionType =>
//     async ( dispatch ) => {
//         // dispatch( requestFormActions.setIcons( null ) )
//         try {
//             const response = await getIconsFromApi( { domain } )
//             dispatch( baseStoreActions.setIcons( domain, response ) )
//         } catch (e) {
//             alert( e )
//             // dispatch( requestFormActions.setApiError( `Not found book with id: ${ bookId } ` ) )
//         }
//
//     }

