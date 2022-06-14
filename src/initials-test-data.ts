import {
    CargoTypeType,
    ConsigneesCardType,
    DocumentsRequestType,
    EmployeesCardType,
    OneRequestType,
    ShippersCardType,
    TrailerCardType,
    TransportCardType,
} from './types/form-types'
import {randArrayValue, randFloorMax, randMinMax, randomDifferentIntegersArrayCreator} from './utils/random-utils';
import {OneInfoItem} from './redux/info-store-reducer';
import {addNDay, randomDate, randomPassportDate} from './utils/date-formats';
import {randomDriverImage, randomTrailerImage, randomTruckImage} from './api/randomImage';

const today = new Date()

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
        coordinates: '51.609284, 45.838219',
        city: 'Саратов',
    },
    {
        id: 2, title: 'Зайцы',
        innNumber: '1234567890',
        organizationName: 'Мастера боевых искусств',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Бийск, Вокзальная ул., д. 12 кв.74',
        shipperFio: 'Бобров Алексей Христофорович',
        shipperTel: '+7 (976) 524-18-63',
        description: 'доп. инфо',
        coordinates: '52.587329, 85.168558',
        city: 'Бийск',
    },
    {
        id: 3, title: 'Бегемоты',
        innNumber: '1234567890',
        organizationName: 'Локтекусательный комбинат',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Волгодонск, Парковая ул., д. 4 кв.76',
        shipperFio: 'Галкин Николай Митрофанович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '47.564976, 42.066528',
        city: 'Волгодонск',
    },
    {
        id: 4, title: 'Лоси',
        innNumber: '1234567890',
        organizationName: 'Манерные водовозы',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Махачкала, Речная ул., д. 3 кв.157',
        shipperFio: 'Кузьмин Мартын Эльдарович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '43.025323, 47.404208',
        city: 'Махачкала',
    },
    {
        id: 5, title: 'Пауки',
        innNumber: '1234567890',
        organizationName: 'Усомокающая станция',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Челябинск, Юбилейная ул., д. 16 кв.71',
        shipperFio: 'Белов Осип Макарович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.247083, 61.273699',
        city: 'Челябинск',
    },
    {
        id: 6, title: 'Крокодилы',
        innNumber: '1234567890',
        organizationName: 'Распилы подельника',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Киров, Шоссейная ул., д. 2 кв.70',
        shipperFio: 'Гаврилов Мартин Никитевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '58.614604, 49.767323',
        city: 'Киров',
    },
    {
        id: 7, title: 'Чайки',
        innNumber: '1234567890',
        organizationName: 'Бодрые бородачи и мухи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Елец, Сосновая ул., д. 7 кв.118',
        shipperFio: 'Лепёхин Егор Игнатьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '52.633895, 38.536974',
        city: 'Елец',
    },
    {
        id: 8, title: 'Гуси',
        innNumber: '1234567890',
        organizationName: 'Б и Ко Лимитэд',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Пермь, Дачная ул., д. 5 кв.185',
        shipperFio: 'Гордеев Натан Ярославович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '57.960043, 56.353672',
        city: 'Пермь',
    },
    {
        id: 9, title: 'Лебеди',
        innNumber: '1234567890',
        organizationName: 'Мощное Хозяйство',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Каменск-Уральский, Победы ул., д. 13 кв.174',
        shipperFio: 'Гусев Мирон Алексеевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '56.448037, 61.886388',
        city: 'Каменск-Уральский',
    },
    {
        id: 10, title: 'Очень сильные тигры',
        innNumber: '1234567890',
        organizationName: 'Каменные скрипели',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Волгоград, Гагарина ул., д. 11 кв.75',
        shipperFio: 'Капустин Агафон Ростиславович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '48.773180, 44.393717',
        city: 'Волгоград',
    },
    {
        id: 11, title: 'Везучие атоллы',
        innNumber: '1234567890',
        organizationName: 'Бабтистский Разогрев',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Петропавловск-Камчатский, Гагарина ул., д. 15 кв.203',
        shipperFio: 'Суханов Фрол Семёнович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '53.108197, 158.627442',
        city: 'Петропавловск-Камчатский',
    },
    {
        id: 12, title: 'Хранители попкорна',
        innNumber: '1234567890',
        organizationName: 'Юстиция почивает',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Казань, Мира ул., д. 9 кв.21',
        shipperFio: 'Молчанов Юстиниан Борисович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.805033, 49.332738',
        city: 'Казань',
    },
    {
        id: 13, title: 'Б и Ко',
        innNumber: '1234567890',
        organizationName: 'Поночка Хряк',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Йошкар-Ола, Дачная ул., д. 20 кв.191',
        shipperFio: 'Бобров Федор Протасьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.805033, 49.332738',
        city: 'Йошкар-Ола',
    },
    {
        id: 14, title: 'Южный Мак',
        innNumber: '1234567890',
        organizationName: 'Северный полюс2',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Астрахань, Мира ул., д. 7 кв.83',
        shipperFio: 'Савельев Даниил Вадимович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '46.466533, 47.961194',
        city: 'Астрахань',
    },
    {
        id: 15, title: 'Ретир Заново',
        innNumber: '1234567890',
        organizationName: 'Чемпионы неугомонны',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Москва, Севернаяул., д. 11 кв.119',
        shipperFio: 'Веселов Альфред Тимофеевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.682583, 37.955424',
        city: 'Москва',
    },
    {
        id: 16, title: 'Загребущие тараканы',
        innNumber: '1234567890',
        organizationName: 'Черепа',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новошахтинск, Садовая ул., д. 11 кв.134',
        shipperFio: 'Зуев Мартин Павлович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '47.754315, 39.934705',
        city: 'Новошахтинск',
    },
    {
        id: 17, title: 'Насекомоядные',
        innNumber: '1234567890',
        organizationName: 'Черешенный запах молотилки',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Владимир, Советская ул., д. 19 кв.31',
        shipperFio: 'Уваров Владлен Артемович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '52.757095, 103.637332',
        city: 'Усолье-Сибирское',
    },
    {
        id: 18, title: 'Растительные жиры',
        innNumber: '1234567890',
        organizationName: 'Пашня Луговая',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Северск, Набережная ул., д. 3 кв.59',
        shipperFio: 'Пестов Рудольф Валерьевич',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '56.603190, 84.880913',
        city: 'Северск',
    },
    {
        id: 19, title: 'Собаки гавкающие',
        innNumber: '1234567890',
        organizationName: 'Настигатор',
        kpp: '606369470',
        ogrn: '8179195353032',
        address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
        shipperFio: 'Суворов Корнелий Богуславович',
        shipperTel: '+7 (955) 890-24-98',
        description: 'доп. инфо',
        coordinates: '51.527623, 81.217673',
        city: 'Рубцовск',
    },
    {
        id: 20, title: 'Собаки лающие',
        innNumber: '1234567890',
        organizationName: 'ЧерепаПАхи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Реутов, Партизанская ул., д. 4 кв.138',
        shipperFio: 'Волков Влас Михаилович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '51.527623, 81.217673',
        city: 'Нижний Тагил',
    },
    {
        id: 21, title: 'Собаки кусающие',
        innNumber: '1234567890',
        organizationName: 'Чере--пахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Чебоксары, ЯнкиКупалы ул., д. 4 кв.32',
        shipperFio: 'Сафонов Вольдемар Пётрович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '56.097990, 47.275677',
        city: 'Чебоксары',
    },
    {
        id: 22, title: 'Рыба, плавающая очень глубоко, пока никого нет',
        innNumber: '1234567890',
        organizationName: 'Черепахи и Кит',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
        shipperFio: 'Трофимов Алексей Альбертович',
        shipperTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '53.099469, 49.947776',
        city: 'Новокуйбышевск',
    },
    {
        id: 23, title: 'Кит',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Курган, Трудовая ул., д. 7 кв.104',
        shipperFio: 'Савин Моисей Александрович',
        shipperTel: '+7 (997) 365-88-66',
        description: 'доп. инфо',
        coordinates: '55.437637, 65.324856',
        city: 'Курган',
    },
]

// фейковые грузополучатели
export const initialConsigneesContent: ConsigneesCardType[] = [
    {
        id: 12, title: 'Хранители попкорна',
        innNumber: '1234567890',
        organizationName: 'Юстиция почивает',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Казань, Мира ул., д. 9 кв.21',
        consigneesFio: 'Молчанов Юстиниан Борисович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '49.332738, 55.805033',
        city: 'Казань',
    },
    {
        id: 13, title: 'Б и Ко',
        innNumber: '1234567890',
        organizationName: 'Поночка Хряк',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Йошкар-Ола, Дачная ул., д. 20 кв.191',
        consigneesFio: 'Бобров Федор Протасьевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.805033, 49.332738',
        city: 'Йошкар-Ола',
    },
    {
        id: 14, title: 'Южный Мак',
        innNumber: '1234567890',
        organizationName: 'Северный полюс2',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Астрахань, Мира ул., д. 7 кв.83',
        consigneesFio: 'Савельев Даниил Вадимович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '46.466533, 47.961194',
        city: 'Астрахань',
    },
    {
        id: 15, title: 'Ретир Заново',
        innNumber: '1234567890',
        organizationName: 'Чемпионы неугомонны',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Москва, Севернаяул., д. 11 кв.119',
        consigneesFio: 'Веселов Альфред Тимофеевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '55.682583, 37.955424',
        city: 'Москва',
    },
    {
        id: 16, title: 'Загребущие тараканы',
        innNumber: '1234567890',
        organizationName: 'Черепа',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новошахтинск, Садовая ул., д. 11 кв.134',
        consigneesFio: 'Зуев Мартин Павлович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '47.754315, 39.934705',
        city: 'Новошахтинск',
    },
    {
        id: 17, title: 'Насекомоядные',
        innNumber: '1234567890',
        organizationName: 'Черешенный запах молотилки',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Владимир, Советская ул., д. 19 кв.31',
        consigneesFio: 'Уваров Владлен Артемович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '52.757095, 103.637332',
        city: 'Усолье-Сибирское',
    },
    {
        id: 18, title: 'Растительные жиры',
        innNumber: '1234567890',
        organizationName: 'Пашня Луговая',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Северск, Набережная ул., д. 3 кв.59',
        consigneesFio: 'Пестов Рудольф Валерьевич',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '56.603190, 84.880913',
        city: 'Северск',
    },
    {
        id: 19, title: 'Собаки гавкающие',
        innNumber: '1234567890',
        organizationName: 'Настигатор',
        kpp: '606369470',
        ogrn: '8179195353032',
        address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
        consigneesFio: 'Суворов Корнелий Богуславович',
        consigneesTel: '+7 (955) 890-24-98',
        description: 'доп. инфо',
        coordinates: '51.527623, 81.217673',
        city: 'Рубцовск',
    },
    {
        id: 20, title: 'Собаки лающие',
        innNumber: '1234567890',
        organizationName: 'ЧерепаПАхи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Реутов, Партизанская ул., д. 4 кв.138',
        consigneesFio: 'Волков Влас Михаилович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '51.527623, 81.217673',
        city: 'Нижний Тагил',
    },
    {
        id: 21, title: 'Собаки кусающие',
        innNumber: '1234567890',
        organizationName: 'Чере--пахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Чебоксары, ЯнкиКупалы ул., д. 4 кв.32',
        consigneesFio: 'Сафонов Вольдемар Пётрович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '56.097990, 47.275677',
        city: 'Чебоксары',
    },
    {
        id: 22, title: 'Рыба, плавающая очень глубоко, пока никого нет',
        innNumber: '1234567890',
        organizationName: 'Черепахи и Кит',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
        consigneesFio: 'Трофимов Алексей Альбертович',
        consigneesTel: '+7 (974) 694-85-51',
        description: 'доп. инфо',
        coordinates: '53.099469, 49.947776',
        city: 'Новокуйбышевск',
    },
    {
        id: 23, title: 'Кит',
        innNumber: '1234567890',
        organizationName: 'Черепахи',
        kpp: '123456789',
        ogrn: '123456789012',
        address: 'Россия, г. Курган, Трудовая ул., д. 7 кв.104',
        consigneesFio: 'Савин Моисей Александрович',
        consigneesTel: '+7 (997) 365-88-66',
        description: 'доп. инфо',
        coordinates: '55.437637, 65.324856',
        city: 'Курган',
    },
]

// фейковый транспорт
export const initialTransportValues: TransportCardType[] = [
    {
        id: 1,
        transportNumber: 'В 367 РА',
        transportTrademark: 'Dacia',
        transportModel: 'Maruti',
        pts: '55РТ 114857',
        dopog: 'Х323',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: 'https://www.fraikinrus.ru/upload/iblock/eb9/eb9b0dc47eb0d3340cdad41d5c25c101.png',
    },
    {
        id: 2,
        transportNumber: 'Р 571 АЕ',
        transportTrademark: 'Dadi',
        transportModel: 'Maserati',
        pts: '17ЕА 519329',
        dopog: '33',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(2),
    },
    {
        id: 3,
        transportNumber: 'Н 436 ХВ',
        transportTrademark: 'Daewoo',
        transportModel: 'Maybach',
        pts: '74ХН 939066',
        dopog: '333',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(3),
    },
    {
        id: 4,
        transportNumber: 'В 358 ЕТ',
        transportTrademark: 'Daihatsu',
        transportModel: 'Mazda',
        pts: '61УА 299363',
        dopog: 'Х333',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(4),
    },
    {
        id: 15,
        transportNumber: 'Е 916 РУ',
        transportTrademark: 'Daimler',
        transportModel: 'McLaren',
        pts: '68ЕУ 674842',
        dopog: '336',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(15),
    },
    {
        id: 5,
        transportNumber: 'А 055 УТ',
        transportTrademark: 'Dallas',
        transportModel: 'Mega',
        pts: '59ХР 438299',
        dopog: '338',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(5),
    },
    {
        id: 6,
        transportNumber: 'А 426 УХ',
        transportTrademark: 'Derways',
        transportModel: 'Mercedes-Benz',
        pts: '49УХ 105717',
        dopog: 'Х338',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(6),
    },
    {
        id: 7,
        transportNumber: 'О 805 СМ',
        transportTrademark: 'De Tomaso',
        transportModel: 'Mercury',
        pts: '85АН 886286',
        dopog: '339',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(7),
    },
    {
        id: 8,
        transportNumber: 'Х 538 КУ',
        transportTrademark: 'Dodge',
        transportModel: 'Metrocab',
        pts: '58НХ 667817',
        dopog: '36',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(8),
    },
    {
        id: 9,
        transportNumber: 'Р 321 КТ',
        transportTrademark: 'Dong Feng',
        transportModel: 'MG',
        pts: '82УР 268409',
        dopog: '362',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(9),
    },
    {
        id: 10,
        transportNumber: 'Е 749 ТВ',
        transportTrademark: 'Doninvest',
        transportModel: 'Minelli',
        pts: '73ТР 562526',
        dopog: 'Х362',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        transportImage: randomTruckImage(10),
    },
]

// фейковые прицепы
export const initialTrailerValues: TrailerCardType[] = [
    {
        id: 11,
        trailerNumber: 'А 355 ВС',
        trailerTrademark: 'Jeep',
        trailerModel: 'Mini',
        pts: '71СР 245074',
        dopog: '368',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        trailerImage: 'http://maz-kam.ru/wp-content/uploads/2018/01/pritsep-1.jpg',
    },
    {
        id: 12,
        trailerNumber: 'К 796 ОР',
        trailerTrademark: 'Jiangling',
        trailerModel: 'Mitsubishi',
        pts: '27КС 289906',
        dopog: '38',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        trailerImage: randomTrailerImage(12),
    },
    {
        id: 13,
        trailerNumber: 'Н 916 ОМ',
        trailerTrademark: 'Jiangnan',
        trailerModel: 'Mitsuoka',
        pts: '24СО 206228',
        dopog: '382',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        trailerImage: randomTrailerImage(13),
    },
    {
        id: 14,
        trailerNumber: 'Р 209 КХ',
        trailerTrademark: 'КАМАЗ',
        trailerModel: 'Monte Carlo',
        pts: '11СО 837334',
        dopog: 'Х382',
        cargoType: randArrayValue(cargoType),
        cargoWeight: randFloorMax(50).toString(),
        propertyRights: 'Аренда',
        trailerImage: randomTrailerImage(14),
    }
    ]

// фейковые водители
export const initialEmployeesValues: EmployeesCardType[] = [
    {
        id: 1,
        employeeFIO: 'Петров Анвар Васильевич',
        employeePhoneNumber: '+7(938)155-22-43',
        passportSerial: '7806563706',
        passportFMS: 'Отделением УФМС России по г. Хабаровск',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '66 78 AB 151642',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '491694',
        garageNumber: '9194',
        mechanicFIO: 'Тимофеев Андрей Федорович',
        dispatcherFIO: 'Маркова Феодосия Данииловна',
        photoFace: randomDriverImage(1),
        rating: randFloorMax(10).toString(),
        coordinates: '49.069515, 47.013803'
    },
    {
        id: 2,
        employeeFIO: 'Беспалов Артем Юрьевич',
        employeePhoneNumber: '+7(938)747-31-53',
        passportSerial: '5839444355',
        passportFMS: 'Отделом внутренних дел России по г. Ногинск',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '47 83 AB 114970',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '230481',
        garageNumber: '3081',
        mechanicFIO: 'Крылов Эрнест Макарович',
        dispatcherFIO: 'Пахомова Архелия Пётровна',
        photoFace: randomDriverImage(2),
        rating: randFloorMax(10).toString(),
        coordinates: '49.751249, 41.117407'
    },
    {
        id: 3,
        employeeFIO: 'Владимиров Аким Платонович',
        employeePhoneNumber: '+7(938)304-98-05',
        passportSerial: '4542766432',
        passportFMS: 'Отделом внутренних дел России по г. Октябрьский',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '24 77 AB 872524',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '218954',
        garageNumber: '1854',
        mechanicFIO: 'Беляков Алан Лаврентьевич',
        dispatcherFIO: 'Меркушева Аксинья Викторовна',
        photoFace: randomDriverImage(3),
        rating: randFloorMax(10).toString(),
        coordinates: '54.721953, 56.146108'
    },
    {
        id: 4,
        employeeFIO: 'Кондратьев Виссарион Даниилович',
        employeePhoneNumber: '+7(938)368-92-65',
        passportSerial: '6157722598',
        passportFMS: 'Отделом УФМС России по г. Нижний Тагил',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '58 50 AB 605366',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '265411',
        garageNumber: '6511',
        mechanicFIO: 'Архипов Лука Ярославович',
        dispatcherFIO: 'Козлова Сара Георгиевна',
        photoFace: randomDriverImage(4),
        rating: randFloorMax(10).toString(),
        coordinates: '56.997002, 65.801063'
    },
    {
        id: 5,
        employeeFIO: 'Белоусов Людвиг Эльдарович',
        employeePhoneNumber: '+7(938)206-44-01',
        passportSerial: '7331537327',
        passportFMS: 'Отделением УФМС России по г. Серпухов',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '24 37 AB 651748',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '415320',
        garageNumber: '1520',
        mechanicFIO: 'Сафонов Роман Васильевич',
        dispatcherFIO: 'Дорофеева Евгения Арсеньевна',
        photoFace: randomDriverImage(5),
        rating: randFloorMax(10).toString(),
        coordinates: '55.028979, 72.900294'
    },
    {
        id: 6,
        employeeFIO: 'Горшков Вольдемар Миронович',
        employeePhoneNumber: '+7(938)495-55-95',
        passportSerial: '9888557656',
        passportFMS: 'ОУФМС России по г. Калуга',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '81 06 AB 185291',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '748518',
        garageNumber: '4818',
        mechanicFIO: 'Миронов Аполлон Антонович',
        dispatcherFIO: 'Самсонова Нева Альбертовна',
        photoFace: randomDriverImage(6),
        rating: randFloorMax(10).toString(),
        coordinates: '57.858574, 59.944197'
    },
    {
        id: 7,
        employeeFIO: 'Зиновьев Вилен Лукьевич',
        employeePhoneNumber: '+7(938)998-79-38',
        passportSerial: '7805913257',
        passportFMS: 'Отделом УФМС России по г. Сергиев Посад',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '98 40 AB 941719',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '681703',
        garageNumber: '8103',
        mechanicFIO: 'Баранов Герасим Георгьевич',
        dispatcherFIO: 'Макарова Эдуарда Максимовна',
        photoFace: randomDriverImage(7),
        rating: randFloorMax(10).toString(),
        coordinates: '55.454877, 65.197628'
    },
    {
        id: 8,
        employeeFIO: 'Симонов Тарас Станиславович',
        employeePhoneNumber: '+7(938)062-23-76',
        passportSerial: '8455069157',
        passportFMS: 'ОВД России по г. Братск',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '82 88 AB 774956',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '595102',
        garageNumber: '9502',
        mechanicFIO: 'Терентьев Тимур Лукьянович',
        dispatcherFIO: 'Гуляева Юстина Леонидовна',
        photoFace: randomDriverImage(8),
        rating: randFloorMax(10).toString(),
        coordinates: '55.736270, 52.525500'
    },
    {
        id: 9,
        employeeFIO: 'Поляков Руслан Рудольфович',
        employeePhoneNumber: '+7(938)730-23-14',
        passportSerial: '9269743181',
        passportFMS: 'ОУФМС России по г. Невинномысск',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '45 92 AB 677966',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '839264',
        garageNumber: '3964',
        mechanicFIO: 'Кузнецов Прохор Валерьевич',
        dispatcherFIO: 'Герасимова Данута Филипповна',
        photoFace: randomDriverImage(9),
        rating: randFloorMax(10).toString(),
        coordinates: '57.839648, 56.252597'
    },
    {
        id: 10,
        employeeFIO: 'Ершов Флор Леонидович',
        employeePhoneNumber: '+7(938)194-68-95',
        passportSerial: '8416910459',
        passportFMS: 'Отделом УФМС России по г. Тула',
        passportDate: randomPassportDate(),
        drivingLicenseNumber: '22 35 AB 736880',
        drivingCategory:'B, C, C1, CE, C1E',
        personnelNumber: '514476',
        garageNumber: '1476',
        mechanicFIO: 'Цветков Осип Макарович',
        dispatcherFIO: 'Савина Гелена Куприяновна',
        photoFace: randomDriverImage(10),
        rating: randFloorMax(10).toString(),
        coordinates: '56.802767, 60.725113'
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
    shipmentDate: id === 999 ? today : randomDate(today, addNDay(today,4)),
    cargoType: randArrayValue(cargoType) as CargoTypeType,
    customer: randFloorMax(10),
    shipper: randFloorMax(11),
    consignee: randMinMax(12, 23),
    carrier: randFloorMax(9),
    driver: randFloorMax(9),
    distance: randMinMax(20, 400),
    note: 'Насос на 120, рукава, ДОПОГ.',
    answers: randomDifferentIntegersArrayCreator(randFloorMax(9))(),
    driverPrice: undefined,
    driverTax: undefined,
    visible: true,
    documents: initialDocumentsRequestValues,
} )

export const makeNTestRequests = ( count: number ): OneRequestType[] =>
    [ 999, 339, 348, 361, 375, 388, ...randomDifferentIntegersArrayCreator(998)(count - 6) ]
        .map(( id ) => makeOneTestRequest(id))


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