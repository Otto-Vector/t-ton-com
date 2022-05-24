import {ThunkAction} from 'redux-thunk'
import {AppStateType, GetActionsTypes} from '../redux-store'
import {ShippersCardType, ValidateType} from '../../types/form-types'
import {composeValidators, maxLength, mustBe00Numbers, mustBe0_0Numbers, required} from '../../utils/validators'


const initialState = {
    currentId: 0,
    label: {
        title: 'Название грузоотправителя',
        innNumber: 'ИНН',
        organizationName: 'Наименование организации',
        kpp: 'КПП',
        ogrn: 'ОГРН',
        address: 'Юридический адрес',
        shipperFio: 'ФИО отправителя',
        shipperTel: 'Телефон отправителя',
        description: 'Доп. данные для ТТН',
        coordinates: 'Местоположение в координатах',
    } as ShippersCardType,

    maskOn: {
        title: undefined,
        innNumber: '############', // 10,12 цифр
        organizationName: undefined,
        kpp: '#########', // 9 цифр
        ogrn: '############', // 12 цифр
        address: undefined, // понятно. просто адрес
        shipperFio: undefined, //
        shipperTel: '+7 (###) ###-##-##', // 11 цифр
        description: undefined, // много букав
        coordinates: undefined,
    } as ShippersCardType,

    initialValues: {
        title: undefined,
        innNumber: undefined,
        organizationName: undefined,
        kpp: undefined,
        ogrn: undefined,
        address: undefined,
        shipperFio: undefined,
        shipperTel: undefined,
        description: undefined,
        coordinates: undefined,
    } as ShippersCardType,

    validators: {
        title: composeValidators(required, maxLength(50)),
        innNumber: composeValidators(required, mustBe0_0Numbers(10)(12)),
        organizationName: composeValidators(required, maxLength(50)),
        kpp: composeValidators(required, mustBe00Numbers(9)),
        ogrn: composeValidators(required, mustBe00Numbers(12)),
        address: composeValidators(required),
        shipperFio: composeValidators(required),
        shipperTel: composeValidators(required, mustBe00Numbers(11)),
        description: undefined,
        coordinates: composeValidators(required),
    } as ShippersCardType<ValidateType>,

    content: [
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
        },
        {
            id: 5, title: 'Бегемоты',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Галкин Николай Митрофанович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 10, title: 'Лоси',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Кузьмин Мартын Эльдарович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 19, title: 'Пауки',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Белов Осип Макарович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 28, title: 'Крокодилы',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Гаврилов Мартин Никитевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 57, title: 'Чайки',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Лепёхин Егор Игнатьевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 106, title: 'Гуси',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Гордеев Натан Ярославович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 15, title: 'Лебеди',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Гусев Мирон Алексеевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 24, title: 'Очень сильные тигры',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Капустин Агафон Ростиславович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 53, title: 'Везучие атоллы',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Суханов Фрол Семёнович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 102, title: 'Хранители попкорна',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Молчанов Юстиниан Борисович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 11, title: 'Б и Ко',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Бобров Федор Протасьевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 20, title: 'Южный Мак',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Савельев Даниил Вадимович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 54, title: 'Ретир загубыч',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Веселов Альфред Тимофеевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 130, title: 'Загребущие тараканы',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Зуев Мартин Павлович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 17, title: 'Насекомоядные',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Уваров Владлен Артемович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 27, title: 'Растительные жиры',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Пестов Рудольф Валерьевич',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 55, title: 'Собаки гавкающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '606369470',
            ogrn: '8179195353032',
            address: 'Россия, г. Рубцовск, Полесская ул., д. 7 кв.112',
            shipperFio: 'Суворов Корнелий Богуславович',
            shipperTel: '+7 (955) 890-24-98',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 150, title: 'Собаки лающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Волков Влас Михаилович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 91, title: 'Собаки кусающие',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Саратов, Речной пер., д. 10 кв.12',
            shipperFio: 'Сафонов Вольдемар Пётрович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 92, title: 'Рыба, плавающая очень глубоко, пока никого нет',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Новокуйбышевск, 3 Марта ул., д. 21 кв.157',
            shipperFio: 'Трофимов Алексей Альбертович',
            shipperTel: '+7 (974) 694-85-51',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
        {
            id: 95, title: 'Кит',
            innNumber: '1234567890',
            organizationName: 'Черепахи',
            kpp: '123456789',
            ogrn: '123456789012',
            address: 'Россия, г. Калининград, Трудовая ул., д. 7 кв.104',
            shipperFio: 'Савин Моисей Александрович',
            shipperTel: '+7 (997) 365-88-66',
            description: 'доп. инфо',
            coordinates: '12345,66 78910,01',
        },
    ] as ShippersCardType[],
}

export type ShippersStoreReducerStateType = typeof initialState

type ActionsType = GetActionsTypes<typeof shippersStoreActions>

export const shippersStoreReducer = ( state = initialState, action: ActionsType ): ShippersStoreReducerStateType => {

    switch (action.type) {

        case 'shippers-store-reducer/SET-INITIAL-VALUES': {
            return {
                ...state,
                initialValues: action.initialValues,
            }
        }
        case 'shippers-store-reducer/SET-CURRENT-ID': {
            return {
                ...state,
                currentId: action.currentId,
            }
        }
        case 'shippers-store-reducer/SET-SHIPPERS': {
            return {
                ...state,
                content: [
                    ...action.shippers,
                ],
            }
        }
        case 'shippers-store-reducer/ADD-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content,
                    action.shipper,
                ],
            }

        }
        case 'shippers-store-reducer/CHANGE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.map(( val ) => ( val.id !== action.id ) ? val : action.shipper ),
                ],
            }
        }
        case 'shippers-store-reducer/DELETE-SHIPPER': {
            return {
                ...state,
                content: [
                    ...state.content.filter(( { id } ) => id !== action.id),
                ],
            }
        }
        default: {
            return state
        }
    }

}

/* ЭКШОНЫ */
export const shippersStoreActions = {
    // установка значения в карточки пользователей одной страницы
    setInitialValues: ( initialValues: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/SET-INITIAL-VALUES',
        initialValues,
    } as const ),
    setCurrentId: ( currentId: number ) => ( {
        type: 'shippers-store-reducer/SET-CURRENT-ID',
        currentId,
    } as const ),
    setShippers: ( shippers: ShippersCardType[] ) => ( {
        type: 'shippers-store-reducer/SET-SHIPPERS',
        shippers,
    } as const ),
    addShipper: ( shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/ADD-SHIPPER',
        shipper,
    } as const ),
    changeShipper: ( id: number, shipper: ShippersCardType ) => ( {
        type: 'shippers-store-reducer/CHANGE-SHIPPER',
        id,
        shipper,
    } as const ),
    deleteShipper: ( id: number ) => ( {
        type: 'shippers-store-reducer/DELETE-SHIPPER',
        id,
    } as const ),
}

/* САНКИ */

export type ShippersStoreReducerThunkActionType<R = void> = ThunkAction<Promise<R>, AppStateType, unknown, ActionsType>


// export const getIcons = ( { domain }: GetIconsType ): ShippersStoreReducerThunkActionType =>
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

