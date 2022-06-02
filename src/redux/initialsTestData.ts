import {
    CargoType,
    ConsigneesCardType,
    DocumentsRequestType,
    OneRequestType,
    ShippersCardType,
} from '../types/form-types'
import {randArrayValue, randFloorMax, randMinMax, randomDifferentIntegersArrayCreator} from '../utils/random-utils';
import {OneInfoItem} from './info-store-reducer';

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
    'Битум 90/130, фасованный в кловертейнеры',
]

// фейковые грузоотправители
export const initialShippersContent: ShippersCardType[] = [
    {
        id: 1,
        title: 'Черепахи',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
        shipperFio: 'Лепёхин Егор Игнатьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Саратов',
    },
    {
        id: 2, title: 'Зайцы',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Бийск, Вокзальная ул., д. 12 кв.74',
        shipperFio: 'Бобров Алексей Христофорович',
        shipperTel: '+7 (976) 524-18-63',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Бийск',
    },
    {
        id: 3, title: 'Бегемоты',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Волгодонск, Парковая ул., д. 4 кв.76',
        shipperFio: 'Галкин Николай Митрофанович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Волгодонск',
    },
    {
        id: 4, title: 'Лоси',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Махачкала, Речная ул., д. 3 кв.157',
        shipperFio: 'Кузьмин Мартын Эльдарович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Махачкала',
    },
    {
        id: 5, title: 'Пауки',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Челябинск, Юбилейная ул., д. 16 кв.71',
        shipperFio: 'Белов Осип Макарович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Челябинск',
    },
    {
        id: 6, title: 'Крокодилы',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Киров, Шоссейная ул., д. 2 кв.70',
        shipperFio: 'Гаврилов Мартин Никитевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Киров',
    },
    {
        id: 7, title: 'Чайки',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Елец, Сосновая ул., д. 7 кв.118',
        shipperFio: 'Лепёхин Егор Игнатьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Елец',
    },
    {
        id: 8, title: 'Гуси',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Пермь, Дачная ул., д. 5 кв.185',
        shipperFio: 'Гордеев Натан Ярославович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Пермь',
    },
    {
        id: 9, title: 'Лебеди',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Каменск-Уральский, Победы ул., д. 13 кв.174',
        shipperFio: 'Гусев Мирон Алексеевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Каменск-Уральский',
    },
    {
        id: 10, title: 'Очень сильные тигры',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Волгоград, Гагарина ул., д. 11 кв.75',
        shipperFio: 'Капустин Агафон Ростиславович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Волгоград',
    },
    {
        id: 11, title: 'Везучие атоллы',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Петропавловск-Камчатский, Гагарина ул., д. 15 кв.203',
        shipperFio: 'Суханов Фрол Семёнович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Петропавловск-Камчатский',
    },
    {
        id: 12, title: 'Хранители попкорна',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Казань, Мира ул., д. 9 кв.21',
        shipperFio: 'Молчанов Юстиниан Борисович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Казань',
    },
    {
        id: 13, title: 'Б и Ко',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Йошкар-Ола, Дачная ул., д. 20 кв.191',
        shipperFio: 'Бобров Федор Протасьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Йошкар-Ола',
    },
    {
        id: 14, title: 'Южный Мак',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Астрахань, Мира ул., д. 7 кв.83',
        shipperFio: 'Савельев Даниил Вадимович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Астрахань',
    },
    {
        id: 15, title: 'Ретир загубыч',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Москва, Севернаяул., д. 11 кв.119',
        shipperFio: 'Веселов Альфред Тимофеевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Москва',
    },
    {
        id: 16, title: 'Загребущие тараканы',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новошахтинск, Садовая ул., д. 11 кв.134',
        shipperFio: 'Зуев Мартин Павлович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Новошахтинск',
    },
    {
        id: 17, title: 'Насекомоядные',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Владимир, Советская ул., д. 19 кв.31',
        shipperFio: 'Уваров Владлен Артемович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Усолье-Сибирское',
    },
    {
        id: 18, title: 'Растительные жиры',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Северск, Набережная ул., д. 3 кв.59',
        shipperFio: 'Пестов Рудольф Валерьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Северск',
    },
    {
        id: 19, title: 'Собаки гавкающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '606369470',
        ogrn: '8179195353032',
        address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
        shipperFio: 'Суворов Корнелий Богуславович',
        shipperTel: '+7 (955) 890-24-98',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Рубцовск',
    },
    {
        id: 20, title: 'Собаки лающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Реутов, Партизанская ул., д. 4 кв.138',
        shipperFio: 'Волков Влас Михаилович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Нижний Реутов',
    },
    {
        id: 21, title: 'Собаки кусающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Чебоксары, ЯнкиКупалы ул., д. 4 кв.32',
        shipperFio: 'Сафонов Вольдемар Пётрович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Чебоксары',
    },
    {
        id: 22, title: 'Рыба, плавающая очень глубоко, пока никого нет',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
        shipperFio: 'Трофимов Алексей Альбертович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Новокуйбышевск',
    },
    {
        id: 23, title: 'Кит',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Калининград, Трудовая ул., д. 7 кв.104',
        shipperFio: 'Савин Моисей Александрович',
        shipperTel: '+7 (997) 365-88-66',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Калининград',
    },
]

// фейковые грузополучатели
export const initialConsigneesContent: ConsigneesCardType[] = [
    {
        id: 12, title: 'Хранители попкорна',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Казань, Мира ул., д. 9 кв.21',
        consigneesFio: 'Молчанов Юстиниан Борисович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Казань',
    },
    {
        id: 13, title: 'Б и Ко',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Йошкар-Ола, Дачная ул., д. 20 кв.191',
        consigneesFio: 'Бобров Федор Протасьевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Йошкар-Ола',
    },
    {
        id: 14, title: 'Южный Мак',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Астрахань, Мира ул., д. 7 кв.83',
        consigneesFio: 'Савельев Даниил Вадимович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Астрахань',
    },
    {
        id: 15, title: 'Ретир загубыч',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Москва, Севернаяул., д. 11 кв.119',
        consigneesFio: 'Веселов Альфред Тимофеевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Москва',
    },
    {
        id: 16, title: 'Загребущие тараканы',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новошахтинск, Садовая ул., д. 11 кв.134',
        consigneesFio: 'Зуев Мартин Павлович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Новошахтинск',
    },
    {
        id: 17, title: 'Насекомоядные',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Владимир, Советская ул., д. 19 кв.31',
        consigneesFio: 'Уваров Владлен Артемович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Усолье-Сибирское',
    },
    {
        id: 18, title: 'Растительные жиры',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Северск, Набережная ул., д. 3 кв.59',
        consigneesFio: 'Пестов Рудольф Валерьевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Северск',
    },
    {
        id: 19, title: 'Собаки гавкающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '606369470',
        ogrn: '8179195353032',
        address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
        consigneesFio: 'Суворов Корнелий Богуславович',
        consigneesTel: '+7 (955) 890-24-98',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Рубцовск',
    },
    {
        id: 20, title: 'Собаки лающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Реутов, Партизанская ул., д. 4 кв.138',
        consigneesFio: 'Волков Влас Михаилович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Нижний Реутов',
    },
    {
        id: 21, title: 'Собаки кусающие',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Чебоксары, ЯнкиКупалы ул., д. 4 кв.32',
        consigneesFio: 'Сафонов Вольдемар Пётрович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Чебоксары',
    },
    {
        id: 22, title: 'Рыба, плавающая очень глубоко, пока никого нет',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
        consigneesFio: 'Трофимов Алексей Альбертович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Новокуйбышевск',
    },
    {
        id: 23, title: 'Кит',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Калининград, Трудовая ул., д. 7 кв.104',
        consigneesFio: 'Савин Моисей Александрович',
        consigneesTel: '+7 (997) 365-88-66',
        description: 'доп. инфо',
        coordinates: '12345,66 78910,01',
        city: 'Калининград',
    },
]

// для обработки документов в заявке
export const initialDocumentsRequestValues: DocumentsRequestType = {
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

// создание рандомной заявки
const makeOneTestRequest = ( id: number ): OneRequestType => ( {
    id: id,
    requestNumber: id,
    requestDate: new Date(2022, 4, randFloorMax(30)),
    cargoComposition: randArrayValue(cargoComposition),
    shipmentDate: id === 999 ? new Date() : new Date(2022, 5, randFloorMax(15)),
    cargoType: randArrayValue(cargoType) as CargoType,
    customer: randFloorMax(10),
    shipper: randFloorMax(11),
    consignee: randMinMax(12, 23),
    carrier: randFloorMax(9),
    driver: randFloorMax(9),
    distance: randMinMax(20, 400),
    note: 'Насос на 120, рукава, ДОПОГ.',
    answers: randomDifferentIntegersArrayCreator(randFloorMax(9))(),
    driverPrice: undefined,
    visible: true,
    documents: initialDocumentsRequestValues,
} )

export const makeNTestRequests = ( count: number ): OneRequestType[] =>
    [ 999, 339, 348, 361, 375, 388, ...randomDifferentIntegersArrayCreator(998)(count - 6) ]
        .map(( id ) => makeOneTestRequest(id))

const today = new Date()
export const infoMessagesTest: OneInfoItem[] = [
    {
        requestNumber: undefined,
        infoText: 'Автотранспорт А 993 УЕ 138  Создание',
        timeDate: new Date(2022, 3, 28),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Сотрудник “Иванов Иван Иванович” создание',
        timeDate: new Date(2022, 4, 5),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Баланс счета +500р',
        timeDate: new Date(2022, 4, 8),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: 339,
        infoText: 'Ответ по Заявке отправлен',
        timeDate: new Date(2022, 4, 8),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: undefined,
        infoText: 'Иванов И.И. изменение Автотранспорт',
        timeDate: new Date(2022, 4, 10),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Грузоотправитель “Ромашка” создание',
        timeDate: new Date(2022, 4, 10),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Грузополучатель “Ошибочный” удаление',
        timeDate: new Date(2022, 4, 10),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Грузополучатель “Одуванчик” изменение',
        timeDate: new Date(2022, 4, 10),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: undefined,
        infoText: 'Грузополучатель “Ромашка” создание',
        timeDate: new Date(2022, 4, 11),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: 339,
        infoText: 'Заявка Отклонена',
        timeDate: new Date(2022, 4, 11),
        viewed: false,
        mode: 'red',
    },
    {
        requestNumber: 348,
        infoText: 'Груз Получен',
        timeDate: new Date(2022, 4, 11),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 348,
        infoText: 'Оплата получена',
        timeDate: new Date(2022, 4, 11),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 361,
        infoText: 'Заявка Принята',
        timeDate: new Date(2022, 4, 11),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: undefined,
        infoText: 'Автотранспорт Е 966 ЕЕ 138  Создание',
        timeDate: new Date(2022, 4, 12),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: 348,
        infoText: 'Груз передан',
        timeDate: new Date(2022, 4, 12),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 361,
        infoText: 'Груз получен',
        timeDate: new Date(2022, 4, 12),
        viewed: false,
        mode: 'blue',
    },
    ////////////////////////////////////////////////////
    {
        requestNumber: 348,
        infoText: 'Заявка закрыта',
        timeDate: new Date(2022, 4, 12),
        viewed: false,
        mode: 'green',
    },
    {
        requestNumber: 361,
        infoText: 'Подпишите документы по ЭЦП ',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 9, 46),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 375,
        infoText: 'Ответ по Заявке отправлен',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 11, 10),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 361,
        infoText: 'Оплата получена',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 14, 1),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 361,
        infoText: 'Груз Передан',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 14, 30),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: 375,
        infoText: 'Заявка Отклонена',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 14, 48),
        viewed: false,
        mode: 'red',
    },
    {
        requestNumber: 361,
        infoText: 'Заявка Закрыта',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 14, 55),
        viewed: false,
        mode: 'green',
    },
    {
        requestNumber: undefined,
        infoText: 'Баланс счета +100р',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 15, 48),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: 388,
        infoText: 'Ответ по Заявке отправлен',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 16, 10),
        viewed: false,
        mode: 'blue',
    },
    {
        requestNumber: undefined,
        infoText: 'Грузополучатель “Ромашка” изменение параметров ',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 16, 18),
        viewed: false,
        mode: 'gray',
    },
    {
        requestNumber: 388,
        infoText: 'Принять заявку',
        timeDate: new Date(2022, today.getMonth(), today.getDate(), 16, 33),
        viewed: false,
        mode: 'blue',
    },

]